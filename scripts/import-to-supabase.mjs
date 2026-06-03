// Importa datos del backend actual (Apps Script / Google Sheets) a Supabase.
// Idempotente: usa upsert por llave primaria, así que se puede re-correr sin duplicar.
//
// Uso:
//   node --env-file=.env.local scripts/import-to-supabase.mjs            # todo lo disponible
//   node --env-file=.env.local scripts/import-to-supabase.mjs productos  # solo una sección
//
// Requiere en el entorno: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APPS_SCRIPT_URL.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!APPS_SCRIPT_URL) {
  console.error("Falta APPS_SCRIPT_URL.");
  process.exit(1);
}

// Service role: bypassa RLS (es un import de sistema).
const db = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(i * n, i * n + n)
  );

async function importProductos() {
  console.log("→ Descargando inventario del Apps Script…");
  const res = await fetch(`${APPS_SCRIPT_URL}?action=getInventory`);
  if (!res.ok) throw new Error(`getInventory ${res.status}`);
  const raw = await res.json();
  const arr = Array.isArray(raw) ? raw : [];
  console.log(`  recibidos: ${arr.length} renglones`);

  // Mapea columnas del Sheet → tabla productos. Dedup por código (PK); ignora vacíos.
  const seen = new Set();
  const rows = [];
  for (const p of arr) {
    const codigo = String(p["CODIGO"] ?? "").trim();
    if (!codigo || seen.has(codigo)) continue;
    seen.add(codigo);
    rows.push({
      codigo,
      nombre_web: String(p["NOMBRE PARA WEB"] ?? "").trim() || codigo,
      marca: (String(p["MARCA"] ?? "").trim() || null),
      categoria: (String(p["CATEGORIA"] ?? "").trim() || null),
      unidad_medida: (String(p["UNIDAD DE MEDIDA"] ?? "").trim() || null),
      precio_final: Number(p["PRECIO FINAL"]) || 0,
      web: String(p["WEB"] ?? "").toLowerCase().includes("activ"),
    });
  }
  console.log(`  a insertar (únicos): ${rows.length}`);

  let done = 0;
  for (const batch of chunk(rows, 500)) {
    const { error } = await db
      .from("productos")
      .upsert(batch, { onConflict: "codigo" });
    if (error) throw new Error(`upsert productos: ${error.message}`);
    done += batch.length;
    console.log(`  upsert ${done}/${rows.length}`);
  }

  const activos = rows.filter((r) => r.web).length;
  console.log(`✓ productos: ${rows.length} (activos para web: ${activos})`);
}

const SECTIONS = { productos: importProductos };

const which = process.argv.slice(2);
const toRun = which.length ? which : Object.keys(SECTIONS);

for (const name of toRun) {
  const fn = SECTIONS[name];
  if (!fn) {
    console.error(`Sección desconocida: ${name}. Opciones: ${Object.keys(SECTIONS).join(", ")}`);
    process.exit(1);
  }
  await fn();
}
console.log("Listo.");
