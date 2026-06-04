"use client";

import type { Pedido } from "@/lib/matriz";
import { mxn } from "./format";

// El Sheet puede devolver las claves en inglés o español; las leemos tolerante.
function field(p: Pedido, ...keys: string[]): string {
  const o = p as unknown as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && String(v).trim() !== "")
      return String(v);
  }
  return "";
}

function formatTotal(p: Pedido): string {
  const raw = (p as unknown as Record<string, unknown>).total ?? p.total;
  if (typeof raw === "number") return mxn(raw);
  const s = String(raw ?? "").trim();
  if (!s) return "—";
  // Si ya viene con símbolo, lo dejamos; si es numérico, lo formateamos.
  const num = Number(s.replace(/[^0-9.-]+/g, ""));
  return s.includes("$") ? s : Number.isFinite(num) && num > 0 ? mxn(num) : s;
}

export default function History({
  history,
  onRepeat,
}: {
  history: Pedido[];
  onRepeat: (p: Pedido) => void;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-black text-brand-navy">Historial operativo</h2>

      {history.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Aún no tienes pedidos registrados. Arma tu primera requisición desde el
          catálogo.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3 font-bold">Folio</th>
                <th className="py-2 pr-3 font-bold">Fecha</th>
                <th className="py-2 pr-3 font-bold">Total</th>
                <th className="py-2 pr-3 font-bold">Estatus</th>
                <th className="py-2 font-bold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((p, i) => {
                const folio = field(p, "folio", "Folio", "FOLIO") || `#${i + 1}`;
                const fecha = field(p, "date", "fecha", "Fecha", "FECHA") || "—";
                const estatus =
                  field(p, "status", "estatus", "Estatus", "ESTATUS") ||
                  "Procesando";
                const resumen = field(p, "resumen", "Resumen", "RESUMEN");
                return (
                  <tr key={`${folio}-${i}`} className="align-top">
                    <td className="py-3 pr-3 font-bold text-brand-navy">
                      {folio}
                    </td>
                    <td className="py-3 pr-3 text-slate-500">{fecha}</td>
                    <td className="py-3 pr-3 font-semibold text-slate-700">
                      {formatTotal(p)}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                        {estatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => onRepeat(p)}
                        disabled={!resumen}
                        className="rounded-lg border border-brand-navy px-3 py-1.5 text-xs font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        title={
                          resumen
                            ? "Cargar estos productos a tu requisición"
                            : "Sin detalle para repetir"
                        }
                      >
                        Repetir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
