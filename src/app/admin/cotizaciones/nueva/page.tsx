"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaCotizacionCordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createBlankQuote() {
      try {
        const res = await fetch("/api/cord/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            negocio: "Nueva Cotización",
            email: "",
            mensaje: "Cotización en blanco generada desde el panel"
          }),
        });

        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
          setError(`Error API: ${data.error} - ${JSON.stringify(data.details)}`);
          return;
        }

        if (data.token) {
          router.replace(`/admin/cotizaciones/cord/${data.token}`);
        } else {
          setError("La API no devolvió un token válido.");
        }
      } catch (err: any) {
        setError(`Error JS: ${err.message}`);
      }
    }

    createBlankQuote();
  }, [router]);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm admin-enter">
      {error ? (
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-red-600">Ocurrió un error</h2>
          <p className="max-w-md text-sm text-slate-600">{error}</p>
          <button onClick={() => router.push("/admin/cotizaciones")} className="mt-4 rounded-lg bg-slate-100 px-4 py-2 font-medium">Volver</button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0A2240]"></div>
          <h2 className="text-lg font-bold text-[#0A2240]">Creando cotización en blanco...</h2>
          <p className="text-sm text-slate-500">Preparando Cord Elements para ti.</p>
        </div>
      )}
    </div>
  );
}
