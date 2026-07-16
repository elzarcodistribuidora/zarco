// Guarda un pedido en Supabase (reemplaza al ?action=saveOrder del Apps Script).
// El email/cliente sale de la SESIÓN (no del body) → seguro. Devuelve el mismo
// shape que esperaba el catálogo: { status: "Success", folio }.
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { generateFolio, PG_UNIQUE_VIOLATION } from "@/lib/folio";

type Item = { codigo: string; nombre: string; cantidad: number };

const MAX_ITEMS = 200;
const MAX_CANTIDAD = 10_000;

// Fallback para clientes que solo mandan `resumen` como texto
// ("2x Nombre (ZRC-405), 3x Otro (ZRC-1112)").
//
// Es frágil por diseño: parte por comas, así que cualquier producto cuyo
// nombre_web traiga una coma rompe el parseo y ese renglón se pierde. Por eso
// el catálogo manda `items` estructurado (ver normalizeItems) y esto quedó
// solo como red para pedidos que lleguen con el contrato viejo.
function parseResumen(resumen: string): Item[] {
  const items: Item[] = [];
  for (const part of String(resumen).split(",")) {
    const m = part.trim().match(/^(\d+)\s*x\s+(.*?)\s+\(([^)]+)\)\s*$/i);
    if (!m) continue;
    items.push({ cantidad: parseInt(m[1], 10), nombre: m[2].trim(), codigo: m[3].trim() });
  }
  return items;
}

// `items` del body es entrada no confiable: solo se toman codigo/nombre/cantidad,
// y el precio SIEMPRE sale de la BD (ver POST) — nunca del cliente.
function normalizeItems(body: { items?: unknown; resumen?: string }): Item[] {
  const raw = body.items;
  if (!Array.isArray(raw)) return parseResumen(String(body.resumen ?? ""));

  return raw
    .slice(0, MAX_ITEMS)
    .map((i) => {
      const it = i as { codigo?: unknown; nombre?: unknown; cantidad?: unknown };
      return {
        codigo: String(it?.codigo ?? "").trim(),
        nombre: String(it?.nombre ?? "").trim(),
        cantidad: Math.floor(Number(it?.cantidad)) || 0,
      };
    })
    .filter((i) => i.codigo && i.cantidad > 0 && i.cantidad <= MAX_CANTIDAD);
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

  let body: { resumen?: string; items?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  // El resumen es texto libre del cliente y acaba en el panel admin y en el
  // CSV de /api/admin/export → se acota.
  const resumen = String(body.resumen ?? "").trim().slice(0, 5000);
  const items = normalizeItems(body);

  // Precio actual por código (snapshot al momento del pedido). Se consulta
  // ANTES de crear el pedido porque el total lo cotiza el servidor: antes se
  // guardaba `body.total` tal cual, así que cualquiera podía mandar un pedido
  // de $0.01 con un carrito lleno.
  let precioPorCodigo = new Map<string, number>();
  if (items.length) {
    const { data: precios } = await supabase
      .from("productos")
      .select("codigo, precio_final")
      .in("codigo", items.map((i) => i.codigo));
    precioPorCodigo = new Map(
      (precios ?? []).map((p) => [p.codigo, Number(p.precio_final)])
    );
  }

  const total = Math.round(
    items.reduce(
      (sum, i) => sum + (precioPorCodigo.get(i.codigo) ?? 0) * i.cantidad,
      0
    ) * 100
  ) / 100;

  // Folio único legible. Se reintenta si la BD rechaza el folio por duplicado
  // (solo aplica si `folio` tiene restricción única); con el generador nuevo es
  // prácticamente imposible, pero un reintento barato evita perder el pedido.
  let pedido: { id: string; folio: string } | null = null;
  let pedidoErr: { message: string; code?: string } | null = null;
  for (let intento = 0; intento < 3; intento++) {
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        folio: generateFolio("ZRC"),
        cliente_id: cliente.id,
        email: cliente.email, // de la sesión, no del cliente
        total,
        status: "Procesando",
        resumen,
      })
      .select("id, folio")
      .single();

    if (!error && data) {
      pedido = data;
      break;
    }
    pedidoErr = error;
    if (error?.code !== PG_UNIQUE_VIOLATION) break; // otro error: no insistir
  }

  if (!pedido) {
    return NextResponse.json(
      { status: "Error", error: pedidoErr?.message ?? "No se pudo crear el pedido" },
      { status: 500 }
    );
  }

  if (items.length) {
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

  return NextResponse.json({ status: "Success", folio: pedido.folio, total });
}
