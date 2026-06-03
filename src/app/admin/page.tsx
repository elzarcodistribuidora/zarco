import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = await createClient();

  const [productos, activos, clientes, pedidos, cotizaciones, cotizPend] =
    await Promise.all([
      supabase.from("productos").select("*", { count: "exact", head: true }),
      supabase.from("productos").select("*", { count: "exact", head: true }).eq("web", true),
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true }),
      supabase.from("cotizaciones").select("*", { count: "exact", head: true }),
      supabase.from("cotizaciones").select("*", { count: "exact", head: true }).eq("atendido", false),
    ]);

  const cards = [
    { label: "Productos", value: productos.count ?? 0, sub: `${activos.count ?? 0} activos para web`, href: "/admin/productos" },
    { label: "Clientes", value: clientes.count ?? 0, sub: "registrados", href: "/admin/clientes" },
    { label: "Pedidos", value: pedidos.count ?? 0, sub: "totales", href: "/admin/pedidos" },
    { label: "Cotizaciones", value: cotizaciones.count ?? 0, sub: `${cotizPend.count ?? 0} sin atender`, href: "/admin/cotizaciones" },
  ];

  return (
    <>
      <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
        Panel de administración
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Edita el catálogo, precios y clientes. Los cambios de catálogo se
        reflejan en el sitio al instante.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#0A2240] hover:shadow-sm"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {c.label}
            </div>
            <div className="mt-2 text-4xl font-black text-[#0A2240]">
              {c.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{c.sub}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
