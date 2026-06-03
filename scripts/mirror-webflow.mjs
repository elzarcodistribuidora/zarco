// Mirror del sitio de Webflow: baja páginas, CSS, JS, imágenes y fuentes.
// Uso: node scripts/mirror-webflow.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ORIGIN = "https://el-zarco.webflow.io";
const PAGES = [
  "/",
  "/abarrotes-basicos",
  "/aviso-de-privacidad",
  "/cafeterias",
  "/catalogo",
  "/contacto",
  "/cremeria",
  "/embutidos",
  "/guias-de-negocio",
  "/nosotros",
  "/perfil",
  "/restaurantes",
  "/terminos-del-servicio",
  "/tiendas",
];

const HTML_DIR = "webflow-export";
const ASSET_DIR = "public/assets";

const assetUrls = new Set();
const cssUrls = new Set();

function abs(url, base = ORIGIN) {
  try {
    return new URL(url, base).href;
  } catch {
    return null;
  }
}

// Recolecta URLs de assets desde HTML.
function collectFromHtml(html) {
  // src / href de imágenes, css, js, video, etc.
  const attrRe = /(?:src|href)="([^"]+)"/g;
  let m;
  while ((m = attrRe.exec(html))) {
    const u = abs(m[1]);
    if (!u) continue;
    if (/website-files\.com|cloudfront\.net/.test(u)) {
      if (u.endsWith(".css")) cssUrls.add(u);
      else if (!u.endsWith(".html")) assetUrls.add(u);
    }
  }
  // srcset
  const srcsetRe = /srcset="([^"]+)"/g;
  while ((m = srcsetRe.exec(html))) {
    for (const part of m[1].split(",")) {
      const u = abs(part.trim().split(/\s+/)[0]);
      if (u && /website-files\.com|cloudfront\.net/.test(u)) assetUrls.add(u);
    }
  }
  // url() dentro de <style> inline (background-image, etc.)
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/g;
  while ((m = styleRe.exec(html))) collectFromCss(m[1], ORIGIN);
  // URLs de imágenes hardcodeadas dentro de <script> (datos de carruseles)
  const scriptRe = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = scriptRe.exec(html))) {
    for (const um of m[1].matchAll(
      /https?:\/\/[^"'\s)]+\.(?:png|jpe?g|gif|svg|webp)/gi
    )) {
      if (/website-files\.com|cloudfront\.net/.test(um[0])) assetUrls.add(um[0]);
    }
  }
}

// Recolecta url() desde CSS (fuentes / imágenes de fondo).
function collectFromCss(css, base) {
  // Soporta url('a (1).png'), url("..."), url(...) — paréntesis dentro del
  // nombre solo si está entre comillas (group 1); sin comillas, sin paréntesis.
  const re = /url\(\s*(?:(['"])(.*?)\1|([^)'"]+))\s*\)/g;
  let m;
  while ((m = re.exec(css))) {
    const raw = (m[2] ?? m[3] ?? "").trim();
    if (!raw || raw.startsWith("data:")) continue;
    const u = abs(raw, base);
    if (u && /website-files\.com|cloudfront\.net/.test(u)) assetUrls.add(u);
  }
}

function filenameFor(url) {
  const { pathname } = new URL(url);
  return pathname.split("/").filter(Boolean).pop() || "asset";
}

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(HTML_DIR, { recursive: true });
  await mkdir(ASSET_DIR, { recursive: true });

  // 1) Páginas
  for (const p of PAGES) {
    const url = ORIGIN + p;
    try {
      const html = (await fetchBuf(url)).toString("utf8");
      const name = p === "/" ? "index" : p.replace(/^\//, "").replace(/\//g, "_");
      await writeFile(join(HTML_DIR, `${name}.html`), html);
      collectFromHtml(html);
      console.log(`page  ✓ ${p} (${html.length} bytes)`);
    } catch (e) {
      console.log(`page  ✗ ${p} — ${e.message}`);
    }
  }

  // 2) CSS (y sus url() internos)
  for (const url of cssUrls) {
    try {
      const css = (await fetchBuf(url)).toString("utf8");
      await writeFile(join(ASSET_DIR, filenameFor(url)), css);
      collectFromCss(css, url);
      console.log(`css   ✓ ${filenameFor(url)}`);
    } catch (e) {
      console.log(`css   ✗ ${url} — ${e.message}`);
    }
  }

  // 3) Assets (imágenes, fuentes, js, video)
  const seen = new Set();
  for (const url of assetUrls) {
    const name = filenameFor(url);
    if (seen.has(name)) continue;
    seen.add(name);
    try {
      const buf = await fetchBuf(url);
      await writeFile(join(ASSET_DIR, name), buf);
      console.log(`asset ✓ ${name} (${buf.length} bytes)`);
    } catch (e) {
      console.log(`asset ✗ ${url} — ${e.message}`);
    }
  }

  console.log(
    `\nListo. Páginas en ${HTML_DIR}/, assets en ${ASSET_DIR}/ (${seen.size} archivos).`
  );
}

main();
