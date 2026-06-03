// Revalidación on-demand del catálogo. Lo dispara el Apps Script (o el panel
// admin) cuando cambia un precio/producto, para que /api/inventory refleje el
// cambio al instante sin esperar los 5 min del ISR.
//
// Llamada esperada:  POST /api/revalidate?token=APPS_SCRIPT_TOKEN
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!process.env.APPS_SCRIPT_TOKEN || token !== process.env.APPS_SCRIPT_TOKEN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  revalidateTag("inventory", "max"); // Next 16: 2º arg requerido (stale-while-revalidate)
  return NextResponse.json({ revalidated: true, tag: "inventory" });
}
