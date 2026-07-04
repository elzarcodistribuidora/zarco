"use client";

import Link from "next/link";

export default function NuevaCotizacionCordPage() {
  return (
    <div className="flex h-full min-h-[85vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm admin-enter">
      {/* Header interno */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-[#0A2240]">
            Crear Cotización
          </h1>
          <p className="text-xs text-slate-500">
            Usando el creador oficial de Cord
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/cotizaciones"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Volver a Leads
          </Link>
          <button 
            onClick={() => window.open('https://cord.flouvia.com/app/cotizaciones/nueva', '_blank')}
            className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A2240]/90"
          >
            Abrir en pestaña nueva
          </button>
        </div>
      </div>

      {/* Embebido del creador oficial de Flouvia Cord */}
      <div className="flex-1 bg-slate-50">
        <iframe 
          src="https://cord.flouvia.com/app/cotizaciones/nueva" 
          className="h-full w-full border-none"
          title="Creador de Cotizaciones Cord"
          allow="clipboard-write; clipboard-read"
        />
      </div>
    </div>
  );
}
