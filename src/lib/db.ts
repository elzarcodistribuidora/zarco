// Conector a Supabase (reemplaza a lib/matriz.ts → Apps Script).
// Mantiene firmas equivalentes para que el front cambie lo mínimo.
// El catálogo lo consume vía /api/inventory (lectura pública, cacheada con ISR).
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente público SIN cookies → la lectura del catálogo es cacheable (ISR).
// productos tiene RLS de lectura pública, así que la anon key basta.
function publicClient() {
  return createClient<Database>(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Forma EXACTA que espera el JS del catálogo de Webflow (nombres del Sheet).
// (El catálogo pasa las llaves a MAYÚSCULAS y lee CODIGO / NOMBRE PARA WEB /
//  CATEGORIA / UNIDAD DE MEDIDA / PRECIO FINAL.)
export type InventoryRow = {
  CODIGO: string;
  "NOMBRE PARA WEB": string;
  MARCA: string | null;
  CATEGORIA: string | null;
  "UNIDAD DE MEDIDA": string | null;
  "PRECIO FINAL": number;
  WEB: string;
};

async function fetchInventory(): Promise<InventoryRow[]> {
  const db = publicClient();
  const { data, error } = await db
    .from("productos")
    .select("codigo, nombre_web, marca, categoria, unidad_medida, precio_final, web")
    .eq("web", true)
    .order("categoria", { ascending: true })
    .order("nombre_web", { ascending: true })
    .limit(5000);
  if (error) throw new Error(`getInventory: ${error.message}`);

  return (data ?? []).map((p) => ({
    CODIGO: p.codigo,
    "NOMBRE PARA WEB": p.nombre_web,
    MARCA: p.marca,
    CATEGORIA: p.categoria,
    "UNIDAD DE MEDIDA": p.unidad_medida,
    "PRECIO FINAL": Number(p.precio_final),
    WEB: p.web ? "Activado" : "",
  }));
}

/**
 * Catálogo / inventario activo para web, cacheado con el tag "inventory".
 * Se revalida cada 5 min o al instante vía POST /api/revalidate (webhook del
 * Apps Script / admin cuando cambia un precio).
 */
export const getInventory = unstable_cache(fetchInventory, ["inventory"], {
  tags: ["inventory"],
  revalidate: 300,
});
