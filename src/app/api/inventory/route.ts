// Catálogo público desde Supabase (reemplaza el fetch directo al Apps Script).
// La data está cacheada en lib/db (tag "inventory") → respuestas ultrarrápidas;
// se refresca sola cada 5 min o al instante vía /api/revalidate.
import { NextResponse } from "next/server";
import { getInventory } from "@/lib/db";

export async function GET() {
  const data = await getInventory();
  return NextResponse.json(data);
}
