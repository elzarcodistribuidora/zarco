// Guarda un pedido en Supabase (reemplaza al ?action=saveOrder del Apps Script).
// El email/cliente sale de la SESIÓN (no del body) → seguro. Devuelve el mismo
// shape que esperaba el catálogo: { status: "Success", folio }.
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

type Item = { codigo: string; nombre: string; cantidad: number };

// resumen viene como "2x Nombre (ZRC-405), 3x Otro (ZRC-1112)".
function parseResumen(resumen: string): Item[] {
  const items: Item[] = [];
  for (const part of String(resumen).split(",")) {
    const m = part.trim().match(/^(\d+)\s*x\s+(.*?)\s+\(([^)]+)\)\s*$/i);
    if (!m) continue;
    items.push({ cantidad: parseInt(m[1], 10), nombre: m[2].trim(), codigo: m[3].trim() });
  }
  return items;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ status: "Error", error: "No autenticado" }, { status: 401 });
  }

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, email")
    .eq("auth_user_id", user.id)
    .single();
  if (!cliente) {
    return NextResponse.json({ status: "Error", error: "Sin cliente" }, { status: 400 });
  }

  let body: { resumen?: string; total?: number };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const resumen = String(body.resumen ?? "").trim();
  const total = Number(body.total) || 0;
  const items = parseResumen(resumen);

  // Folio único legible.
  const folio = `ZRC-${Date.now().toString().slice(-7)}`;

  const { data: pedido, error: pedidoErr } = await supabase
    .from("pedidos")
    .insert({
      folio,
      cliente_id: cliente.id,
      email: cliente.email, // de la sesión, no del cliente
      total,
      status: "Procesando",
      resumen,
    })
    .select("id, folio")
    .single();
  if (pedidoErr || !pedido) {
    return NextResponse.json(
      { status: "Error", error: pedidoErr?.message ?? "No se pudo crear el pedido" },
      { status: 500 }
    );
  }

  // Precio actual por código (snapshot al momento del pedido).
  if (items.length) {
    const codigos = items.map((i) => i.codigo);
    const { data: precios } = await supabase
      .from("productos")
      .select("codigo, precio_final")
      .in("codigo", codigos);
    const precioPorCodigo = new Map(
      (precios ?? []).map((p) => [p.codigo, Number(p.precio_final)])
    );

    await supabase.from("pedido_items").insert(
      items.map((i) => ({
        pedido_id: pedido.id,
        codigo: precioPorCodigo.has(i.codigo) ? i.codigo : null,
        nombre: i.nombre,
        precio: precioPorCodigo.get(i.codigo) ?? null,
        cantidad: i.cantidad,
      }))
    );
  }

  return NextResponse.json({ status: "Success", folio: pedido.folio });
}
