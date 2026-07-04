"use client";

import { use, useEffect } from "react";
import { CordCotizador } from "@flouviahq/elements/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CotizacionCordPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  // En Next.js 15 (o App Router asíncrono), desenvolvimos params con `use` de React
  const unwrappedParams = use(params);
  const { token } = unwrappedParams;

  return (
    <div className="flex h-full min-h-[85vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm admin-enter">
      {/* Header interno */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-[#0A2240]">
            Cotizador B2B
          </h1>
          <p className="text-xs text-slate-500">
            Enviando token seguro a Cord...
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/cotizaciones"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Volver
          </Link>
          <button 
            onClick={() => window.open(`https://cord.flouvia.com/embed/${token}`, '_blank')}
            className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A2240]/90"
          >
            Abrir en pestaña nueva
          </button>
        </div>
      </div>

      {/* Embebido de Flouvia Cord */}
      <div className="flex-1 bg-slate-50 p-6">
        <div className="mx-auto h-full max-w-5xl rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
          <CordCotizador
            token={token}
            onApproved={(d: any) => {
              console.log("Cotización aprobada!", d);
              alert("¡Cotización aprobada exitosamente!");
            }}
            onRejected={(d: any) => {
              console.log("Cotización rechazada", d);
            }}
            onPay={(d: any) => {
              console.log("Iniciando pago", d);
            }}
          />
        </div>
      </div>
    </div>
  );
}
