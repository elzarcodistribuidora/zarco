import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { IconBox, IconUsers, IconTruck, IconInbox, IconChevron } from "./ui/icons";

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
    { label: "Productos", value: productos.count ?? 0, sub: `${activos.count ?? 0} activos para web`, href: "/admin/productos", Icon: IconBox },
    { label: "Clientes", value: clientes.count ?? 0, sub: "registrados", href: "/admin/clientes", Icon: IconUsers },
    { label: "Pedidos", value: pedidos.count ?? 0, sub: "totales", href: "/admin/pedidos", Icon: IconTruck },
    { label: "Cotizaciones", value: cotizaciones.count ?? 0, sub: `${cotizPend.count ?? 0} sin atender`, href: "/admin/cotizaciones", Icon: IconInbox, alert: (cotizPend.count ?? 0) > 0 },
  ];

  return (
    <>
      <div className="admin-enter">
        <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
          Panel de administración
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Edita el catálogo, precios y clientes. Los cambios de catálogo se
          reflejan en el sitio al instante.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            style={{ "--i": i + 1 } as React.CSSProperties}
            className="admin-enter group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#0A2240]/30 hover:shadow-lg hover:shadow-slate-900/5"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-[#0A2240] transition-colors duration-200 group-hover:bg-[#0A2240] group-hover:text-white">
                <c.Icon width={22} height={22} />
              </span>
              {c.alert ? (
                <span className="relative flex h-2.5 w-2.5" title="Hay cotizaciones sin atender">
                  <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-[#A81200] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#A81200]" />
                </span>
              ) : (
                <IconChevron
                  width={18}
                  height={18}
                  className="text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0A2240]"
                />
              )}
            </div>
            <div className="mt-4 text-4xl font-black tabular-nums text-[#0A2240]">
              {c.value}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {c.label}
            </div>
            <div className="mt-0.5 text-sm text-slate-500">{c.sub}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
