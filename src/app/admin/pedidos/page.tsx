import { createClient } from "@/lib/supabase/server";
import { updatePedidoStatus } from "../actions";
import { RowForm } from "../ui/RowForm";
import { SaveButton } from "../ui/SaveButton";

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

export default async function PedidosAdmin() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id, folio, email, fecha, total, status, resumen")
    .order("fecha", { ascending: false })
    .limit(300);

  const rows = pedidos ?? [];

  return (
    <>
      <div className="admin-enter">
        <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
          Pedidos
        </h1>
        <p className="mt-1 text-sm text-slate-500">{rows.length} pedidos</p>
      </div>

      {/* Encabezado de columnas: solo en escritorio. En móvil cada pedido es
          una tarjeta apilada para que nada se corte. */}
      <div className="mt-6 space-y-2">
        <div
          className="admin-enter hidden gap-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[110px_minmax(0,1fr)_100px_110px_240px] md:items-center"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <span>Folio</span>
          <span>Cliente</span>
          <span>Fecha</span>
          <span className="text-right">Total</span>
          <span>Estatus</span>
        </div>

        {rows.map((p, i) => (
          <div
            key={p.id}
            style={{ "--i": Math.min(i + 2, 12) } as React.CSSProperties}
            className="admin-enter grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.06] md:grid-cols-[110px_minmax(0,1fr)_100px_110px_240px] md:items-start md:gap-3 md:rounded-xl md:py-3"
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
              <div className="break-words">{p.email}</div>
              {p.resumen && (
                <div className="mt-1 text-xs text-slate-400">{p.resumen}</div>
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
              <div className="mb-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    STATUS_STYLE[p.status] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <RowForm
                action={updatePedidoStatus}
                savedMessage={`Pedido ${p.folio} actualizado`}
                className="flex gap-2"
              >
                <input type="hidden" name="id" value={p.id} />
                <select
                  name="status"
                  defaultValue={p.status}
                  className="flex-1 cursor-pointer rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15 md:flex-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <SaveButton className="px-3 py-1.5 text-xs" />
              </RowForm>
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
