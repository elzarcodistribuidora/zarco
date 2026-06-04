// Datos del portal del cliente para el dashboard React de /perfil.
// Un solo round-trip: identidad + KPIs + producto estrella + historial CON
// items (para el detalle expandible y "repetir pedido") + carrito guardado.
// El email/cliente sale de la SESIÓN verificada (RLS), nunca del cliente.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic"; // depende de la sesión (cookies)

type ItemRow = {
  pedido_id: string;
  codigo: string | null;
  nombre: string | null;
  precio: number | null;
  cantidad: number;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { authenticated: false, registered: false },
      { status: 401 }
    );
  }

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nombre, email, estatus, nivel, role, created_at")
    .eq("auth_user_id", user.id)
    .single();

  if (!cliente) {
    // Sesión válida pero el trigger aún no creó el cliente (caso raro).
    return NextResponse.json({ authenticated: true, registered: false });
  }

  const [{ data: pedidos }, { data: carrito }] = await Promise.all([
    supabase
      .from("pedidos")
      .select("id, folio, fecha, total, status, resumen")
      .eq("cliente_id", cliente.id)
      .order("fecha", { ascending: false })
      .limit(50),
    supabase
      .from("carritos")
      .select("items")
      .eq("cliente_id", cliente.id)
      .maybeSingle(),
  ]);

  const pedidoList = pedidos ?? [];
  const pedidoIds = pedidoList.map((p) => p.id);

  // Items de todos los pedidos en una sola consulta → se agrupan por pedido
  // (detalle) y se agregan (producto estrella / más comprados).
  const itemsByPedido = new Map<string, ItemRow[]>();
  const topMap = new Map<
    string,
    { codigo: string | null; nombre: string; cantidad: number; veces: number }
  >();

  if (pedidoIds.length) {
    const { data: items } = await supabase
      .from("pedido_items")
      .select("pedido_id, codigo, nombre, precio, cantidad")
      .in("pedido_id", pedidoIds);

    for (const it of (items ?? []) as ItemRow[]) {
      const list = itemsByPedido.get(it.pedido_id) ?? [];
      list.push(it);
      itemsByPedido.set(it.pedido_id, list);

      const nombre = it.nombre ?? it.codigo ?? "Producto";
      const key = it.codigo ?? nombre;
      const cur = topMap.get(key) ?? {
        codigo: it.codigo,
        nombre,
        cantidad: 0,
        veces: 0,
      };
      cur.cantidad += it.cantidad;
      cur.veces += 1;
      topMap.set(key, cur);
    }
  }

  // KPIs: gasto/órdenes del mes en curso + totales históricos.
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth();
  let gastoMes = 0;
  let ordenesMes = 0;
  let gastoTotal = 0;
  for (const p of pedidoList) {
    const total = Number(p.total) || 0;
    gastoTotal += total;
    const d = new Date(p.fecha);
    if (d.getFullYear() === yr && d.getMonth() === mo) {
      gastoMes += total;
      ordenesMes += 1;
    }
  }

  const history = pedidoList.map((p) => ({
    folio: p.folio,
    fechaISO: p.fecha,
    fecha: new Date(p.fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    total: Number(p.total) || 0,
    status: p.status,
    resumen: p.resumen ?? "",
    items: (itemsByPedido.get(p.id) ?? []).map((it) => ({
      codigo: it.codigo,
      nombre: it.nombre ?? it.codigo ?? "Producto",
      precio: it.precio == null ? null : Number(it.precio),
      cantidad: it.cantidad,
    })),
  }));

  const topProductos = [...topMap.values()]
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const savedCartCount = Array.isArray(carrito?.items)
    ? (carrito!.items as unknown[]).length
    : 0;

  return NextResponse.json({
    authenticated: true,
    registered: true,
    user: {
      nombre: cliente.nombre,
      email: cliente.email,
      estatus: cliente.estatus,
      nivel: cliente.nivel,
      role: cliente.role,
      isAdmin: cliente.role === "admin",
      esSocio: cliente.estatus !== "Cliente Nuevo",
      memberSince: cliente.created_at,
    },
    kpis: {
      gastoMes,
      ordenesMes,
      gastoTotal,
      totalPedidos: pedidoList.length,
    },
    topProductos,
    history,
    savedCartCount,
  });
}
