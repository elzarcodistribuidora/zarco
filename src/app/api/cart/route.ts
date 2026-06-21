// Carrito en la nube (savedCart) en Supabase. Reemplaza al ?action=syncCart.
// Body del catálogo: { action:"syncCart", email, cart: "<stringified [[id,obj],...]>" }.
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

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

  let items: unknown = [];
  try {
    const body = await request.json();
    // `cart` puede venir como string (JSON) o ya como arreglo.
    items =
      typeof body.cart === "string"
        ? JSON.parse(body.cart || "[]")
        : (body.cart ?? body.items ?? []);
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
