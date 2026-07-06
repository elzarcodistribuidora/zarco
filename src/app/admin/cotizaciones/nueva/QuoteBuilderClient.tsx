"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
// @ts-ignore - The types in @flouviahq/elements/react are not yet updated to export CordProvider
import { CordProvider, CordBuilder } from "@flouviahq/elements/react";
// @ts-ignore
import type { CreateQuoteResponse } from "@flouviahq/elements/react";

export function QuoteBuilderClient({ productos, clientes }: { productos: any[], clientes: any[] }) {
  const router = useRouter();

  const handleQuoteCreated = (data: CreateQuoteResponse) => {
    if (data.token) {
      router.push(`/admin/cotizaciones/cord/${data.token}`);
    } else {
      alert("No se recibió token");
    }
  };

  const handleAnalytics = (event: string, payload: any) => {
    console.log(`[Cord Telemetry] ${event}`, payload);
  };

  return (
    <div className="admin-enter mx-auto max-w-5xl space-y-8 pb-12">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A81200]/10 text-[#A81200]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#0A2240]">
              Nueva Cotización
            </h1>
          </div>
          <p className="text-sm text-slate-500 max-w-xl">
            Construye una propuesta comercial estructurada usando Cord Elements.
            El cliente podrá aprobarla y pagarla directamente desde el enlace seguro.
          </p>
        </div>
        <Link
          href="/admin/cotizaciones"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 hover:text-slate-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancelar
        </Link>
      </div>

      {/* Main Builder Card - Super Premium Glassmorphism / Shadow */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#A81200] via-red-600 to-orange-500" />

        <div className="p-8 sm:p-10">
          <CordProvider
            proxyUrl="/api/cord/create"
            publishableKey="pk_test_12345"
            appearance={{
              variables: {
                colorPrimary: '#A81200',
                colorText: '#0A2240',
                borderRadius: '12px',
                fontFamily: 'Outfit, system-ui, sans-serif'
              },
              fonts: [
                { cssSrc: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap' }
              ]
            }}
            onAnalyticsEvent={handleAnalytics}
          >
            <CordBuilder
              catalog={productos}
              clients={clientes}
              onQuoteCreated={handleQuoteCreated}
            >
              {/* Top Section: Client & Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex items-center gap-2 text-[#0A2240]">
                    <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="font-bold text-lg">Información del Cliente</h3>
                  </div>
                  <CordBuilder.Header className="m-0" />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex items-center gap-2 text-[#0A2240]">
                    <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-bold text-lg">Configuración B2B</h3>
                  </div>
                  <CordBuilder.Config className="m-0" />
                </div>
              </div>

              {/* Middle Section: Items Table */}
              <div className="mb-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
                  <h3 className="font-bold text-lg text-[#0A2240]">Partidas de la Cotización</h3>
                  <p className="text-xs text-slate-500 mt-1">Agrega productos desde tu catálogo de El Zarco</p>
                </div>
                <div className="p-6">
                  <CordBuilder.Items />
                </div>
              </div>

              {/* Bottom Section: Notes & Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                <div>
                  <h3 className="font-bold text-lg text-[#0A2240] mb-4">Notas Adicionales</h3>
                  <CordBuilder.Notes className="w-full" />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-center">
                  <CordBuilder.Summary />
                </div>
              </div>

              {/* Footer Checkout Action */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 rounded-2xl bg-[#0A2240] p-8 text-white shadow-xl shadow-[#0A2240]/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Generación Segura</h4>
                    <p className="text-sm text-slate-300">Enlace criptográfico listo para pago con transferencia o tarjeta.</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <CordBuilder.SubmitButton className="w-full sm:w-auto bg-[#A81200] hover:bg-red-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-red-900/50 hover:-translate-y-1 transform flex items-center justify-center gap-2 text-lg">
                    Generar Cotización
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </CordBuilder.SubmitButton>
                </div>
              </div>

            </CordBuilder>
          </CordProvider>
        </div>
      </div>
    </div>
  );
}
