// Convierte las páginas de Webflow (webflow-export/*.html) en datos que Next
// renderiza: extrae el CSS inline + el <body>, reescribe rutas de assets a
// nombres seguros y los guarda como JSON en src/webflow/<slug>.json.
// Uso: node scripts/build-pages.mjs
import { readdir, readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { join } from "node:path";

const HTML_DIR = "webflow-export";
const ASSET_DIR = "public/assets";
const OUT_DIR = "src/webflow";
const CDN_PREFIX = "https://cdn.prod.website-files.com/69a8ea678e1865edb6b6e309/";

// 1) Renombrar assets a nombres seguros y construir el mapa enc->safe.
function slug(name) {
  let s = name;
  try {
    s = decodeURIComponent(name);
  } catch {}
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // quita acentos combinados
    .replace(/[()']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

async function renameAssets() {
  const files = await readdir(ASSET_DIR);
  for (const f of files) {
    // El CSS compartido se normaliza a webflow-shared.css; el resto a slug.
    if (f.endsWith(".css")) {
      if (f !== "webflow-shared.css") {
        await rename(join(ASSET_DIR, f), join(ASSET_DIR, "webflow-shared.css"));
      }
      continue;
    }
    const safe = slug(f);
    if (safe !== f) await rename(join(ASSET_DIR, f), join(ASSET_DIR, safe));
  }
}

let WEBP = new Set(); // basenames .webp disponibles (lo llena main)

function toLocal(name) {
  // Prefiere la versión .webp si existe (más ligera).
  const webp = name.replace(/\.(png|jpe?g|gif)$/i, ".webp");
  return WEBP.has(webp) ? webp : name;
}

function rewriteAssets(text) {
  // Match: CDN_PREFIX + nombre (permitiendo paréntesis y %20) hasta la extensión.
  // Cortar en la extensión evita comerse el ")" de los url() de CSS.
  const re = new RegExp(
    CDN_PREFIX.replace(/[.]/g, "\\.") +
      "[^\"'\\s]*?\\.(?:png|jpe?g|gif|svg|webp|js|css)",
    "gi"
  );
  return (
    text
      .replace(re, (full) => `/assets/${toLocal(slug(full.slice(CDN_PREFIX.length)))}`)
      // placeholder genérico de Webflow (sin id de proyecto)
      .replace(
        /https?:\/\/cdn\.prod\.website-files\.com\/placeholder\.png/g,
        "/assets/placeholder-image.webp"
      )
      // cualquier /assets/*.png|jpg|gif local → .webp si existe la versión
      .replace(
        /\/assets\/([^"'\s)]+?)\.(png|jpe?g|gif)/gi,
        (_f, base, ext) => `/assets/${toLocal(`${base}.${ext}`)}`
      )
  );
}

function extractMeta(html) {
  // Recupera el SEO del <head> de Webflow (title, description, Open Graph).
  const head = html.slice(0, html.indexOf("</head>"));
  const map = {};
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const key = (m[0].match(/(?:name|property)="([^"]+)"/i) || [])[1];
    const val = (m[0].match(/content="([^"]*)"/i) || [])[1];
    if (key && val != null) map[key.toLowerCase()] = val;
  }
  const title = (head.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || "";
  const description = map["description"] || "";
  const ogImage = map["og:image"] ? rewriteAssets(map["og:image"]) : "";
  return { title, description, ogImage };
}

function extract(html) {
  // CSS inline (todos los <style>)
  let css = "";
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) css += m[1] + "\n";

  // Scripts inline a conservar (slider, carruseles, nav, reveal).
  // Se descartan: analytics (gtag/dataLayer) y el motor de /perfil que
  // ocultaba el body y redirigía (eso lo reemplaza nuestro /portal).
  const js = [];
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const c = m[1];
    if (c.trim().length < 30) continue;
    if (/gtag\(|dataLayer|google_tags_first_party/.test(c)) continue;
    if (/document\.body\.style\.display\s*=\s*['"]none['"]/.test(c)) continue;
    // Login viejo (Google Identity Services + localStorage): se descarta el
    // script puro de auth. El login se unifica a Auth.js (botón → /portal).
    // El script mixto (nav + auth) se conserva por el nav.
    if (/initGoogleAuthGlobal/.test(c) && !/setupScrollAndMenu/.test(c)) continue;
    js.push(c);
  }

  // <body ...> ... </body>: capturamos clases del body y el contenido
  const bodyOpen = html.match(/<body([^>]*)>/);
  const bodyClass = (bodyOpen?.[1].match(/class="([^"]*)"/)?.[1]) ?? "";
  let body = html.slice(
    html.indexOf(">", html.indexOf("<body")) + 1,
    html.lastIndexOf("</body>")
  );

  // Limpieza del body:
  // - scripts/noscript: se ejecutan vía PageScripts.
  // - <style>: ya están en el campo `css` (evita CSS duplicado).
  // - <head> embebido por Webflow dentro del body (title/meta/link) y
  //   fragmentos sueltos </body></html><!DOCTYPE>: HTML inválido / basura.
  body = body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?(?:html|head|body)\b[^>]*>/gi, "");

  return { css, body, bodyClass, js };
}

async function main() {
  await renameAssets();
  WEBP = new Set((await readdir(ASSET_DIR)).filter((f) => f.endsWith(".webp")));
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(HTML_DIR)).filter((f) => f.endsWith(".html"));
  const index = [];
  for (const f of files) {
    const slugName = f.replace(/\.html$/, "");
    const html = await readFile(join(HTML_DIR, f), "utf8");
    let { css, body, bodyClass, js } = extract(html);
    const meta = extractMeta(html);
    css = rewriteAssets(css);
    body = rewriteAssets(body);
    js = js.map(rewriteAssets); // localiza imágenes de productos hardcodeadas
    await writeFile(
      join(OUT_DIR, `${slugName}.json`),
      JSON.stringify({ slug: slugName, css, body, bodyClass, js, meta })
    );
    index.push(slugName);
    console.log(
      `✓ ${slugName} (css ${css.length}, body ${body.length}, ${js.length} scripts, "${meta.title.slice(0, 40)}…")`
    );
  }
  await writeFile(join(OUT_DIR, "_pages.json"), JSON.stringify(index));
  console.log(`\nListo: ${index.length} páginas en ${OUT_DIR}/`);
}

main();
