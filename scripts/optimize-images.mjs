// Genera versiones WebP (más ligeras) de los assets de imagen.
// PNG/JPG -> WebP con tope de ancho; GIF animado -> WebP animado.
// Conserva los originales; build-pages reescribe las referencias a .webp.
// Uso: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const DIR = "public/assets";
const MAX_W = 2000; // tope de ancho para banners enormes (suficiente para retina)

const fmt = (n) => (n / 1024 / 1024).toFixed(2) + " MB";

async function main() {
  const files = await readdir(DIR);
  let before = 0;
  let after = 0;
  let count = 0;

  for (const f of files) {
    const ext = f.toLowerCase().split(".").pop();
    if (!["png", "jpg", "jpeg", "gif"].includes(ext)) continue;
    const src = join(DIR, f);
    const out = join(DIR, f.replace(/\.[^.]+$/, ".webp"));
    const srcSize = (await stat(src)).size;

    try {
      if (ext === "gif") {
        await sharp(src, { animated: true })
          .webp({ quality: 65, effort: 4 })
          .toFile(out);
      } else {
        await sharp(src)
          .resize({ width: MAX_W, withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toFile(out);
      }
      const outSize = (await stat(out)).size;
      await unlink(src); // borra el original; todo referencia el .webp
      before += srcSize;
      after += outSize;
      count++;
      const pct = Math.round((1 - outSize / srcSize) * 100);
      console.log(
        `✓ ${f}  ${fmt(srcSize)} → ${fmt(outSize)}  (-${pct}%)`
      );
    } catch (e) {
      console.log(`✗ ${f} — ${e.message}`);
    }
  }

  console.log(
    `\n${count} imágenes: ${fmt(before)} → ${fmt(after)}  ` +
      `(ahorro ${Math.round((1 - after / before) * 100)}%)`
  );
}

main();
