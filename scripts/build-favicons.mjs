// Genera todos los favicons del sitio a partir de un logo maestro.
// Fuente: scripts/favicon-master.png (logo del Zarco, 512x512, con alpha).
// Cubre TODAS las modalidades:
//   - Pestaña del navegador (claro/oscuro): favicon.ico (16/32/48) + icon.png
//   - iPhone/iPad (pantalla de inicio): apple-icon.png 180x180 con fondo sólido
//     (iOS no respeta transparencia: la pinta de negro), recortado por iOS.
//   - Android / PWA (manifest): icon 192 y 512 transparentes + uno "maskable"
//     (fondo de marca y zona segura) para que no se recorte mal.
// Uso: node scripts/build-favicons.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const MASTER = "scripts/favicon-master.png";
const APP = "src/app";
const PUB = "public";

const NAVY = "#0A2240"; // azul marino de marca
const WHITE = "#ffffff";

// Redimensiona el logo a un cuadrado transparente de tamaño dado.
const square = (size) =>
  sharp(MASTER)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });

// Logo sobre un fondo sólido (para iOS) o con zona segura (maskable Android).
// padding = fracción del lienzo que queda libre por lado (0.12 = 12%).
async function onBackground(size, bg, padding) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(MASTER)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png();
}

// Empaqueta varios PNG en un .ico (los navegadores modernos leen PNG dentro de ICO).
function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: 1 = ícono
  header.writeUInt16LE(count, 4);

  const entries = [];
  const images = [];
  let offset = 6 + count * 16;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // ancho (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // alto
    entry.writeUInt8(0, 2); // colores en paleta
    entry.writeUInt8(0, 3); // reservado
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por pixel
    entry.writeUInt32LE(data.length, 8); // tamaño de la imagen
    entry.writeUInt32LE(offset, 12); // offset
    offset += data.length;
    entries.push(entry);
    images.push(data);
  }
  return Buffer.concat([header, ...entries, ...images]);
}

async function main() {
  // favicon.ico multi-resolución (16/32/48) — pestañas del navegador.
  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map(async (size) => ({
      size,
      data: await square(size).png().toBuffer(),
    }))
  );
  await writeFile(`${APP}/favicon.ico`, buildIco(icoPngs));
  console.log("✓ src/app/favicon.ico (16/32/48)");

  // icon.png — Next.js lo expone como <link rel="icon"> en alta resolución.
  await square(512).png().toFile(`${APP}/icon.png`);
  console.log("✓ src/app/icon.png (512)");

  // apple-icon.png — pantalla de inicio iOS. Fondo blanco (sin transparencia).
  await (await onBackground(180, WHITE, 0.1)).toFile(`${APP}/apple-icon.png`);
  console.log("✓ src/app/apple-icon.png (180, fondo blanco)");

  // Íconos del manifest (Android / PWA), servidos desde /public.
  await square(192).png().toFile(`${PUB}/icon-192.png`);
  await square(512).png().toFile(`${PUB}/icon-512.png`);
  // Maskable: fondo de marca + zona segura para que Android no recorte el logo.
  await (await onBackground(512, NAVY, 0.18)).toFile(`${PUB}/icon-maskable-512.png`);
  console.log("✓ public/icon-192.png, icon-512.png, icon-maskable-512.png");

  console.log("\nListo. Recuerda: src/app/manifest.ts enlaza los íconos de /public.");
}

main();
