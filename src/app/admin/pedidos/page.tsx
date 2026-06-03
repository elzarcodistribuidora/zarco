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

      <div
        className="admin-enter mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Folio</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr
                key={p.id}
                className="align-top transition-colors hover:bg-slate-50/70"
              >
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0A2240]">
                  {p.folio}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{p.email}</div>
                  {p.resumen && (
                    <div className="mt-1 max-w-md text-xs text-slate-400">
                      {p.resumen}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(p.fecha).toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#0A2240]">
                  {mxn.format(Number(p.total))}
                </td>
                <td className="px-4 py-3">
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
                      className="cursor-pointer rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <SaveButton className="px-3 py-1.5 text-xs" />
                  </RowForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-400">
            Aún no hay pedidos.
          </p>
        )}
      </div>
    </>
  );
}
