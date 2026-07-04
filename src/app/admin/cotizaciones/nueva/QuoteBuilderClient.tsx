"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CordProvider, CordBuilder } from "@flouviahq/elements/react";
import type { CreateQuoteResponse } from "@flouviahq/elements/react";

export function QuoteBuilderClient({ productos }: { productos: any[] }) {
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
    // Here you would push to PostHog, Segment, Datadog, etc.
  };

  return (
    <div className="admin-enter mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
            Nueva Cotización
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Construye la cotización usando Cord Elements (UI Componible).
          </p>
        </div>
        <Link
          href="/admin/cotizaciones"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>
      </div>

      <CordProvider 
        proxyUrl="/api/cord/create" 
        publishableKey="pk_test_12345" // Triggers Test Mode / Sandboxed environment
        appearance={{
          variables: {
            colorPrimary: '#A81200',
            colorText: '#0A2240',
            borderRadius: '16px',
            fontFamily: 'system-ui, sans-serif'
          }
        }}
        onAnalyticsEvent={handleAnalytics}
      >
        <CordBuilder 
          catalog={productos}
          onQuoteCreated={handleQuoteCreated}
        >
          {/* Composable UI Pattern */}
          <CordBuilder.Header className="bg-slate-50 p-6 rounded-xl border border-slate-200" />
          <CordBuilder.Items />
          
          <div className="flex justify-between items-end border-t border-slate-100 pt-6">
            <div className="text-sm text-slate-500 max-w-xs">
              <p className="font-semibold text-slate-700">🔒 Pago Seguro B2B</p>
              <p>Tu cliente podrá pagar esta cotización directamente con transferencia o tarjeta al ser aprobada.</p>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <CordBuilder.Summary />
              <CordBuilder.SubmitButton className="bg-[#A81200] hover:bg-red-800 text-white font-bold py-3 px-8 rounded-xl transition shadow-md" />
            </div>
          </div>
        </CordBuilder>
      </CordProvider>
    </div>
  );
}
