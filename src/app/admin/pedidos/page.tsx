import { createClient } from "@/lib/supabase/server";
import { updatePedidoStatus } from "../actions";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

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
      <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
        Pedidos
      </h1>
      <p className="mt-1 text-sm text-slate-500">{rows.length} pedidos</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
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
              <tr key={p.id} className="align-top">
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
                <td className="px-4 py-3 text-right font-semibold text-[#0A2240]">
                  {mxn.format(Number(p.total))}
                </td>
                <td className="px-4 py-3">
                  <form action={updatePedidoStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <select
                      name="status"
                      defaultValue={p.status}
                      className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                    >
                      {["Procesando", "En cola", "En ruta", "Entregado", "Cancelado"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>
                    <button className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[#0A2240] hover:text-white">
                      Guardar
                    </button>
                  </form>
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
