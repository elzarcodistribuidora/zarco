import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { IconBox, IconUsers, IconTruck, IconInbox, IconChevron } from "./ui/icons";

export default async function AdminHome() {
  const supabase = await createClient();

  const [
    productos, activos, clientes, pedidos, cotizaciones, cotizPend, 
    lastPedidos, lastCotiz
  ] = await Promise.all([
      supabase.from("productos").select("*", { count: "exact", head: true }),
      supabase.from("productos").select("*", { count: "exact", head: true }).eq("web", true),
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true }),
      supabase.from("cotizaciones").select("*", { count: "exact", head: true }),
      supabase.from("cotizaciones").select("*", { count: "exact", head: true }).eq("atendido", false),
      supabase.from("pedidos").select("id, folio, email, total, status, fecha").order("fecha", { ascending: false }).limit(5),
      supabase.from("cotizaciones").select("id, folio, negocio, atendido").order("id", { ascending: false }).limit(5),
    ]);

  const cards = [
    { label: "Productos", value: productos.count ?? 0, sub: `${activos.count ?? 0} activos para web`, href: "/admin/productos", Icon: IconBox, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Clientes", value: clientes.count ?? 0, sub: "registrados", href: "/admin/clientes", Icon: IconUsers, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Pedidos", value: pedidos.count ?? 0, sub: "totales", href: "/admin/pedidos", Icon: IconTruck, bg: "bg-purple-50", color: "text-purple-600" },
    { label: "Cotizaciones", value: cotizaciones.count ?? 0, sub: `${cotizPend.count ?? 0} sin atender`, href: "/admin/cotizaciones", Icon: IconInbox, bg: "bg-amber-50", color: "text-amber-600", alert: (cotizPend.count ?? 0) > 0 },
  ];

  return (
    <>
      <div className="admin-enter flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0A2240]">
            Panel de control
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Resumen de tu operación al día de hoy.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            style={{ "--i": i + 1 } as React.CSSProperties}
            className="admin-enter group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0A2240]/20 hover:bg-white hover:shadow-xl hover:shadow-[#0A2240]/5"
          >
            <div className="flex items-center justify-between">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${c.bg} ${c.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <c.Icon width={24} height={24} />
              </span>
              {c.alert ? (
                <span className="relative flex h-3 w-3" title="Hay cotizaciones sin atender">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A81200] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#A81200]" />
                </span>
              ) : (
                <IconChevron
                  width={20}
                  height={20}
                  className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#0A2240]"
                />
              )}
            </div>
            <div className="mt-5 text-4xl font-black tabular-nums text-[#0A2240] tracking-tight">
              {c.value}
            </div>
            <div className="mt-1.5 text-sm font-bold uppercase tracking-wider text-slate-400">
              {c.label}
            </div>
            <div className="mt-1 text-sm font-medium text-slate-500">{c.sub}</div>
            
            {/* Hover subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-slate-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Últimos Pedidos */}
        <div className="admin-enter rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]" style={{ "--i": 5 } as React.CSSProperties}>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-[#0A2240]">Últimos Pedidos</h2>
            <Link href="/admin/pedidos" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-slate-100 p-2">
            {lastPedidos.data?.length ? lastPedidos.data.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-slate-50">
                <div>
                  <div className="font-mono text-sm font-bold text-[#0A2240]">{p.folio}</div>
                  <div className="text-xs text-slate-500">{p.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">${Number(p.total).toFixed(2)}</div>
                  <div className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    p.status === 'Completado' ? 'bg-emerald-100 text-emerald-700' :
                    p.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.status}
                  </div>
                </div>
              </div>
            )) : <div className="p-4 text-center text-sm text-slate-400">No hay pedidos recientes.</div>}
          </div>
        </div>

        {/* Últimas Cotizaciones */}
        <div className="admin-enter rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]" style={{ "--i": 6 } as React.CSSProperties}>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-[#0A2240]">Leads Recientes</h2>
            <Link href="/admin/cotizaciones" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-slate-100 p-2">
            {lastCotiz.data?.length ? lastCotiz.data.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-slate-50">
                <div>
                  <div className="font-mono text-sm font-bold text-[#0A2240]">{c.folio}</div>
                  <div className="text-sm font-medium text-slate-700">{c.negocio}</div>
                </div>
                <div>
                  {c.atendido ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">Atendido</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200/50 px-2 py-1 text-xs font-semibold text-amber-600">Pendiente</span>
                  )}
                </div>
              </div>
            )) : <div className="p-4 text-center text-sm text-slate-400">No hay cotizaciones recientes.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
