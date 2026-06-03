import { createClient } from "@/lib/supabase/server";
import { toggleCotizacionAtendida } from "../actions";

export default async function CotizacionesAdmin() {
  const supabase = await createClient();
  const { data: cotizaciones } = await supabase
    .from("cotizaciones")
    .select("id, folio, negocio, email, mensaje, atendido, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  const rows = cotizaciones ?? [];
  const pendientes = rows.filter((c) => !c.atendido).length;

  return (
    <>
      <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
        Cotizaciones / Leads
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {rows.length} en total · {pendientes} sin atender · vienen del formulario
        de contacto (prospectos sin cuenta).
      </p>

      <div className="mt-6 space-y-3">
        {rows.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl border p-4 ${
              c.atendido
                ? "border-slate-200 bg-white opacity-70"
                : "border-[#A81200]/30 bg-[#A81200]/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#0A2240]">
                    {c.folio}
                  </span>
                  {!c.atendido && (
                    <span className="rounded-full bg-[#A81200] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Nuevo
                    </span>
                  )}
                </div>
                <div className="mt-1 font-semibold text-slate-800">
                  {c.negocio ?? "—"}
                </div>
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="text-sm text-[#0A2240] underline"
                  >
                    {c.email}
                  </a>
                )}
                {c.mensaje && (
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    {c.mensaje}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-slate-400">
                  {new Date(c.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <form action={toggleCotizacionAtendida}>
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    type="hidden"
                    name="atendido"
                    value={(!c.atendido).toString()}
                  />
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[#0A2240] hover:text-white">
                    {c.atendido ? "Marcar pendiente" : "Marcar atendido"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
            Aún no hay cotizaciones de contacto.
          </p>
        )}
      </div>
    </>
  );
}
