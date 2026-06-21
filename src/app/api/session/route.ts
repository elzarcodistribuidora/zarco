// Sesión del cliente (userData + history + savedCart) desde Supabase.
// Reemplaza al ?action=getUserSession del Apps Script. El email sale de la
// sesión verificada (RLS), nunca del cliente → cierra el hueco viejo.
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { userData: null, history: [], savedCart: "[]" },
      { status: 401 }
    );
  }

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nombre, estatus, nivel")
    .eq("auth_user_id", user.id)
    .single();

  if (!cliente) {
    return NextResponse.json({ userData: null, history: [], savedCart: "[]" });
  }

  const [{ data: pedidos }, { data: carrito }] = await Promise.all([
    supabase
      .from("pedidos")
      .select("folio, fecha, total, status, resumen")
      .eq("cliente_id", cliente.id)
      .order("fecha", { ascending: false })
      .limit(50),
    supabase
      .from("carritos")
      .select("items")
      .eq("cliente_id", cliente.id)
      .maybeSingle(),
  ]);

  const history = (pedidos ?? []).map((p) => ({
    folio: p.folio,
    date: new Date(p.fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    total: Number(p.total).toFixed(2),
    status: p.status,
    resumen: p.resumen ?? "",
  }));

  return NextResponse.json({
    userData: {
      // El perfil muestra "Cliente Nuevo" si id === "CLI-NUEVO", si no "Socio Comercial".
      id: cliente.estatus === "Cliente Nuevo" ? "CLI-NUEVO" : cliente.id,
      nombre: cliente.nombre,
      estatus: cliente.estatus,
      nivel: cliente.nivel,
    },
    history,
    savedCart: JSON.stringify(carrito?.items ?? []),
  });
}
