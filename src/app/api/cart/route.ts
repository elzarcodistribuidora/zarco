// Carrito en la nube (savedCart) en Supabase. Reemplaza al ?action=syncCart.
// Body del catálogo: { action:"syncCart", email, cart: "<stringified [[id,obj],...]>" }.
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

// El carrito viaja como [[id, { name, price, qty }], …] (mismo formato que
// localStorage.zarcoCartObjects, ver useCatalogCart.ts).
type CartEntry = [string, { name: string; price: number; qty: number }];

const MAX_ENTRIES = 500; // el catálogo real ronda el millar de SKUs
const MAX_NAME = 200;

// Antes se guardaba en la columna jsonb lo que viniera en el body, sin mirarlo:
// cualquier usuario con sesión podía dejar megabytes de basura en `carritos`.
// Aquí se reconstruye la estructura desde cero y solo se conserva lo que
// encaja en la forma esperada.
//
// Los precios NO son sensibles a seguridad: son solo para pintar el carrito, y
// /api/order vuelve a cotizar contra la BD antes de guardar el pedido.
function normalizeCart(raw: unknown): CartEntry[] {
  if (!Array.isArray(raw)) return [];

  const out: CartEntry[] = [];
  for (const entry of raw.slice(0, MAX_ENTRIES)) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const [id, val] = entry as [unknown, unknown];
    const codigo = String(id ?? "").trim().slice(0, 100);
    if (!codigo || typeof val !== "object" || val === null) continue;

    const item = val as { name?: unknown; price?: unknown; qty?: unknown };
    const qty = Math.floor(Number(item.qty)) || 0;
    if (qty <= 0) continue;

    out.push([
      codigo,
      {
        name: String(item.name ?? "").trim().slice(0, MAX_NAME),
        price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
        qty,
      },
    ]);
  }
  return out;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ status: "Error" }, { status: 401 });
  }

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!cliente) return NextResponse.json({ status: "Error" }, { status: 400 });

  let items: CartEntry[] = [];
  try {
    const body = await request.json();
    // `cart` puede venir como string (JSON) o ya como arreglo.
    const raw =
      typeof body.cart === "string"
        ? JSON.parse(body.cart || "[]")
        : (body.cart ?? body.items ?? []);
    items = normalizeCart(raw);
  } catch {
    items = [];
  }

  const { error } = await supabase.from("carritos").upsert({
    cliente_id: cliente.id,
    items: items as never,
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ status: "Error", error: error.message }, { status: 500 });

  return NextResponse.json({ status: "Success" });
}
