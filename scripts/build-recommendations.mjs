// Genera las recomendaciones del catálogo (cross-sell "complemento" + upsell
// "similar") y las guarda en la tabla public.recomendaciones de Supabase.
//
// Sin historial de compras, la "inteligencia" viene de un grafo de pares de
// arquetipos (scripts/recs-config.mjs): clasifica cada producto por su nombre y
// cruza con qué arquetipos combinan. Es determinista y re-ejecutable.
//
// Uso:
//   node --env-file=.env.local scripts/build-recommendations.mjs
//   npm run build:recs
//
// Requiere: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";
import {
  normalize,
  clasificar,
  COMPLEMENTOS,
  MAX_COMPLEMENTO,
  MAX_SIMILAR,
} from "./recs-config.mjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(i * n, i * n + n)
  );

// Palabras que no distinguen una variedad (unidades, presentaciones, conectores).
const STOP = new Set([
  "de", "la", "el", "los", "las", "con", "y", "en", "para", "al", "del", "sin",
  "kg", "g", "gr", "grs", "ml", "lt", "l", "pz", "pza", "pzas", "pieza", "piezas",
  "caja", "kilo", "kilos", "bolsa", "cubeta", "charola", "lata", "frasco", "pack",
  "mayoreo", "presentacion", "tira", "paquete", "rebanado", "rebanada",
]);

function tokens(nombre) {
  return normalize(nombre)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 2 && !STOP.has(t) && !/^\d+$/.test(t));
}

async function main() {
  console.log("→ Leyendo productos activos…");
  const productos = [];
  // Paginado defensivo por si crecen más allá del límite por request.
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("productos")
      .select("codigo, nombre_web, marca, categoria, precio_final")
      .eq("web", true)
      .order("codigo")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    productos.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  console.log(`  ${productos.length} productos`);

  // Enriquecer cada producto con su arquetipo y tokens significativos.
  const items = productos.map((p) => ({
    ...p,
    tipo: clasificar(p.nombre_web),
    toks: tokens(p.nombre_web),
    precio: Number(p.precio_final) || 0,
  }));

  // Índice arquetipo → productos.
  const porTipo = new Map();
  for (const it of items) {
    if (!it.tipo) continue;
    if (!porTipo.has(it.tipo)) porTipo.set(it.tipo, []);
    porTipo.get(it.tipo).push(it);
  }
  // Índice categoría → productos (fallback para similares sin arquetipo).
  const porCat = new Map();
  for (const it of items) {
    const c = it.categoria || "—";
    if (!porCat.has(c)) porCat.set(c, []);
    porCat.get(c).push(it);
  }

  const sinTipo = items.filter((i) => !i.tipo).length;
  console.log(
    `  arquetipos: ${porTipo.size} · productos sin clasificar: ${sinTipo}`
  );

  const filas = [];

  for (const it of items) {
    // --- SIMILARES (upsell): mismo arquetipo (o misma categoría), ---
    //     ordenados por traslape de tokens; prefiere otra marca.
    const propio = normalize(it.nombre_web);
    const universo = (porTipo.get(it.tipo) || porCat.get(it.categoria || "—") || [])
      .filter((o) => o.codigo !== it.codigo);
    const vistosSim = new Set([propio]); // evita repetir el mismo nombre
    const similares = universo
      .map((o) => {
        const compartidos = o.toks.filter((t) => it.toks.includes(t)).length;
        const otraMarca = (o.marca || "") !== (it.marca || "") ? 1 : 0;
        return { o, score: compartidos * 10 + otraMarca };
      })
      .filter((x) => (it.tipo ? true : x.score >= 10)) // sin arquetipo: exige token común
      .sort(
        (a, b) =>
          b.score - a.score ||
          Math.abs(a.o.precio - it.precio) - Math.abs(b.o.precio - it.precio) ||
          a.o.codigo.localeCompare(b.o.codigo)
      )
      .filter((x) => {
        const k = normalize(x.o.nombre_web);
        if (vistosSim.has(k)) return false;
        vistosSim.add(k);
        return true;
      })
      .slice(0, MAX_SIMILAR)
      .map((x) => x.o.codigo);

    similares.forEach((rec, i) =>
      filas.push({ codigo: it.codigo, rec_codigo: rec, tipo: "similar", rank: i })
    );

    // --- COMPLEMENTOS (cross-sell): productos de arquetipos que combinan, ---
    //     en round-robin para diversificar tipos y marcas.
    const objetivos = COMPLEMENTOS[it.tipo] || [];
    if (objetivos.length) {
      const colas = objetivos.map((t) =>
        (porTipo.get(t) || [])
          .slice()
          // orden estable y "variado": por marca y luego nombre.
          .sort(
            (a, b) =>
              (a.marca || "").localeCompare(b.marca || "") ||
              a.codigo.localeCompare(b.codigo)
          )
      );
      const complementos = [];
      const marcasUsadas = new Set();
      const nombresVistos = new Set(); // evita complementos con nombre repetido
      let avance = true;
      for (let pos = 0; complementos.length < MAX_COMPLEMENTO && avance; pos++) {
        avance = false;
        for (const cola of colas) {
          if (complementos.length >= MAX_COMPLEMENTO) break;
          // primera pasada: marca nueva; segundas: rellena.
          let pick = null;
          for (let k = pos; k < cola.length; k++) {
            const cand = cola[k];
            if (cand.codigo === it.codigo) continue;
            if (nombresVistos.has(normalize(cand.nombre_web))) continue;
            if (pos === 0 && marcasUsadas.has(cand.marca)) continue;
            pick = cand;
            break;
          }
          if (pick) {
            avance = true;
            complementos.push(pick.codigo);
            marcasUsadas.add(pick.marca);
            nombresVistos.add(normalize(pick.nombre_web));
          }
        }
      }
      complementos
        .slice(0, MAX_COMPLEMENTO)
        .forEach((rec, i) =>
          filas.push({
            codigo: it.codigo,
            rec_codigo: rec,
            tipo: "complemento",
            rank: i,
          })
        );
    }
  }

  console.log(`→ Generadas ${filas.length} filas de recomendación.`);

  console.log("→ Limpiando tabla recomendaciones…");
  const { error: delErr } = await db
    .from("recomendaciones")
    .delete()
    .neq("codigo", "__none__");
  if (delErr) throw new Error(`delete: ${delErr.message}`);

  console.log("→ Insertando…");
  let n = 0;
  for (const lote of chunk(filas, 500)) {
    const { error } = await db.from("recomendaciones").insert(lote);
    if (error) throw new Error(`insert: ${error.message}`);
    n += lote.length;
    process.stdout.write(`\r  ${n}/${filas.length}`);
  }
  console.log("\n✓ Listo.");
  console.log(
    "  Para refrescar el catálogo en vivo: corre POST /api/revalidate?token=… o redeploy."
  );
}

main().catch((e) => {
  console.error("\n✗ Error:", e.message);
  process.exit(1);
});
