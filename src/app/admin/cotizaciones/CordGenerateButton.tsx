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
      console.log("Enviando petición a /api/cord/create...");
      const res = await fetch("/api/cord/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, negocio, email, mensaje }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Respuesta del servidor:", res.status, data);

      if (!res.ok) {
        alert(`Fallo en el servidor (${res.status}): ${data.error || "Desconocido"} \n\n${JSON.stringify(data.details || data)}`);
        return;
      }

      if (data.token) {
        console.log("Redirigiendo a:", `/admin/cotizaciones/cord/${data.token}`);
        router.push(`/admin/cotizaciones/cord/${data.token}`);
      } else {
        alert(`La API respondió OK pero no devolvió un token. Respuesta: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      alert(`Error de red o JS: ${err.message}`);
      console.error("Error en handleGenerate:", err);
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
