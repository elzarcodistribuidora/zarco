"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CordGenerateButton({ 
  leadId, 
  negocio, 
  email, 
  mensaje 
}: { 
  leadId: string | number, 
  negocio?: string | null, 
  email?: string | null, 
  mensaje?: string | null 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/cord/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, negocio, email, mensaje }),
      });

      if (!res.ok) {
        throw new Error("Error al generar cotización. Verifica la configuración de la API.");
      }

      const data = await res.json();
      if (data.token) {
        // Redirigir a la vista de la cotización
        router.push(`/admin/cotizaciones/cord/${data.token}`);
      } else {
        alert("La API no devolvió un token válido.");
      }
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        loading
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-[#0A2240] text-white hover:bg-[#0A2240]/90 shadow-sm"
      }`}
    >
      {loading ? "Generando..." : "Crear en Cord"}
    </button>
  );
}
