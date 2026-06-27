import { createClient } from "@/lib/supabase/server";
import { updatePedidoStatus } from "../actions";
import { RowForm } from "../ui/RowForm";
import { SaveButton } from "../ui/SaveButton";
import { ExportButton } from "../ui/ExportButton";
import { IconSearch } from "../ui/icons";

import { OrderDetailsButton } from "../ui/OrderDetails";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

// Color del badge de estatus según el estado del pedido.
const STATUS_STYLE: Record<string, string> = {
  Procesando: "bg-amber-100 text-amber-700",
  "En cola": "bg-slate-100 text-slate-600",
  "En ruta": "bg-blue-100 text-blue-700",
  Entregado: "bg-emerald-100 text-emerald-700",
  Cancelado: "bg-rose-100 text-rose-700",
};

const STATUSES = ["Procesando", "En cola", "En ruta", "Entregado", "Cancelado"];

export default async function PedidosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient();
  
  let query = supabase
    .from("pedidos")
    .select("id, folio, email, fecha, total, status, resumen", { count: "exact" })
    .order("fecha", { ascending: false })
    .limit(300);

  if (q) query = query.or(`folio.ilike.%${q}%,email.ilike.%${q}%`);
  if (status) query = query.eq("status", status);

  const { data: pedidos, count } = await query;
  const rows = pedidos ?? [];
  const total = count ?? 0;
  const hayFiltro = !!(q || status);

  return (
    <>
      <div className="admin-enter flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
            Pedidos
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {hayFiltro ? `${total} coinciden` : `${total} pedidos`}
          </p>
        </div>
        <ExportButton type="pedidos" />
      </div>

      <div className="admin-enter mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-slate-900/[0.02] border border-slate-100">
        <form className="flex w-full flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <IconSearch
              width={18}
              height={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Folio o correo..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
          >
            <option value="">Todos los estatus</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white outline-none transition-all duration-150 hover:bg-[#0c2c54] focus-visible:ring-2 focus-visible:ring-[#0A2240]/40 active:scale-[0.97]">
            Buscar
          </button>
          {hayFiltro && (
            <a
              href="/admin/pedidos"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-[#A81200]"
            >
              Limpiar
            </a>
          )}
        </form>
      </div>

      {/* Encabezado de columnas: solo en escritorio. En móvil cada pedido es
          una tarjeta apilada para que nada se corte. */}
      <div className="mt-6 space-y-2">
        <div
          className="admin-enter hidden gap-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[110px_minmax(0,1fr)_100px_110px_270px] md:items-center"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <span>Folio</span>
          <span>Cliente</span>
          <span>Fecha</span>
          <span className="text-right">Total</span>
          <span>Estatus y Acciones</span>
        </div>

        {rows.map((p, i) => (
          <div
            key={p.id}
            style={{ "--i": Math.min(i + 2, 12) } as React.CSSProperties}
            className="admin-enter grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.06] md:grid-cols-[110px_minmax(0,1fr)_100px_110px_270px] md:items-start md:gap-3 md:rounded-xl md:py-3"
          >
            <div className="flex items-center justify-between gap-2 md:block">
              <span className="font-mono text-xs font-semibold text-[#0A2240]">
                {p.folio}
              </span>
              <span className="font-semibold tabular-nums text-[#0A2240] md:hidden">
                {mxn.format(Number(p.total))}
              </span>
            </div>

            <div className="min-w-0 text-sm text-slate-600">
              <div className="break-words font-medium">{p.email}</div>
              {p.resumen && (
                <div className="mt-1 text-xs text-slate-400 line-clamp-1">{p.resumen}</div>
              )}
            </div>

            <div className="text-sm text-slate-500">
              <span className="mr-2 text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                Fecha
              </span>
              {new Date(p.fecha).toLocaleDateString("es-MX")}
            </div>

            <div className="hidden text-right font-semibold tabular-nums text-[#0A2240] md:block">
              {mxn.format(Number(p.total))}
            </div>

            <div>
              <div className="flex flex-col items-start gap-2.5">
                <RowForm
                  action={updatePedidoStatus}
                  savedMessage={`Pedido actualizado`}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={p.id} />
                  <div className="relative">
                    <select
                      name="status"
                      defaultValue={p.status}
                      className={`appearance-none cursor-pointer rounded-full py-1 pl-3 pr-7 text-[11px] font-bold uppercase tracking-wide outline-none ring-1 ring-inset ring-black/5 transition hover:brightness-95 focus:ring-2 focus:ring-black/20 ${
                        STATUS_STYLE[p.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-white font-medium text-slate-900 normal-case tracking-normal">
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                  <SaveButton 
                    variant="ghost" 
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-transparent bg-slate-100 p-0 text-slate-400 hover:bg-[#0A2240] hover:text-white"
                    pendingLabel=""
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </SaveButton>
                </RowForm>

                <OrderDetailsButton pedidoId={p.id} folio={p.folio} />
              </div>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
            Aún no hay pedidos.
          </p>
        )}
      </div>
    </>
  );
}
