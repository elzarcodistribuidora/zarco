import { createClient } from "@/lib/supabase/server";
import { toggleCotizacionAtendida } from "../actions";
import { RowForm } from "../ui/RowForm";
import { SaveButton } from "../ui/SaveButton";
import { CordGenerateButton } from "./CordGenerateButton";
import Link from "next/link";

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
              Cotizaciones / Leads
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {rows.length} en total · {pendientes} sin atender · vienen del
              formulario de contacto (prospectos sin cuenta).
            </p>
          </div>
          <Link
            href="/admin/cotizaciones/nueva"
            className="inline-flex flex-none items-center justify-center rounded-xl bg-[#0A2240] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#A81200] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A81200] focus:ring-offset-2"
          >
            + Nueva Cotización
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((c, i) => (
          <div
            key={c.id}
            style={{ "--i": Math.min(i + 1, 12) } as React.CSSProperties}
            className={`admin-enter rounded-2xl border p-4 transition-all duration-200 ${
              c.atendido
                ? "border-slate-200 bg-white opacity-70 hover:opacity-100"
                : "border-[#A81200]/30 bg-[#A81200]/[0.04] shadow-sm shadow-[#A81200]/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#0A2240]">
                    {c.folio}
                  </span>
                  {!c.atendido && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#A81200] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
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
                    className="text-sm text-[#0A2240] underline-offset-2 transition hover:text-[#A81200] hover:underline"
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
                <CordGenerateButton 
                  leadId={c.id} 
                  negocio={c.negocio} 
                  email={c.email} 
                  mensaje={c.mensaje} 
                />
                <RowForm
                  action={toggleCotizacionAtendida}
                  savedMessage={
                    c.atendido
                      ? `${c.folio} marcado pendiente`
                      : `${c.folio} marcado atendido`
                  }
                  flash={false}
                >
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    type="hidden"
                    name="atendido"
                    value={(!c.atendido).toString()}
                  />
                  <SaveButton variant="ghost" className="px-3 py-1.5 text-xs">
                    {c.atendido ? "Marcar pendiente" : "Marcar atendido"}
                  </SaveButton>
                </RowForm>
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
