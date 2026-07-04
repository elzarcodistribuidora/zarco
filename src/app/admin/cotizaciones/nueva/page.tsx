"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Item {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
}

export default function NuevaCotizacionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [items, setItems] = useState<Item[]>([
    { descripcion: "", cantidad: 1, precio_unitario: 0 },
  ]);

  const subtotal = items.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleAddItem = () => {
    setItems([...items, { descripcion: "", cantidad: 1, precio_unitario: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.descripcion)) {
      alert("Todos los artículos deben tener una descripción.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cord/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          negocio: cliente,
          email,
          mensaje,
          items,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(`Error al crear: ${data.error} \n\n ${JSON.stringify(data.details)}`);
        return;
      }

      if (data.token) {
        router.push(`/admin/cotizaciones/cord/${data.token}`);
      } else {
        alert("No se recibió token");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-enter mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
            Nueva Cotización
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Construye la cotización y envíala a Cord para aprobación.
          </p>
        </div>
        <Link
          href="/admin/cotizaciones"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del Cliente */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[#0A2240]">Datos del Cliente</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nombre / Empresa</label>
              <input
                type="text"
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#A81200] focus:outline-none focus:ring-1 focus:ring-[#A81200]"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email (Opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#A81200] focus:outline-none focus:ring-1 focus:ring-[#A81200]"
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Notas / Mensaje (Opcional)</label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#A81200] focus:outline-none focus:ring-1 focus:ring-[#A81200]"
                placeholder="Notas internas..."
              />
            </div>
          </div>
        </div>

        {/* Partidas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0A2240]">Artículos (Partidas)</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm font-semibold text-[#A81200] transition hover:text-[#0A2240]"
            >
              + Agregar Artículo
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-wrap items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Descripción</label>
                  <input
                    type="text"
                    required
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(idx, "descripcion", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#A81200] focus:outline-none"
                    placeholder="Extintor ABC 4.5kg"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Cant.</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(idx, "cantidad", Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#A81200] focus:outline-none"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">P. Unitario ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={item.precio_unitario}
                    onChange={(e) => handleItemChange(idx, "precio_unitario", Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#A81200] focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-1 h-full pt-6">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="rounded p-2 text-slate-400 hover:bg-slate-200 hover:text-red-600 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-end border-t border-slate-100 pt-4">
            <div className="w-full max-w-xs space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (16%):</span>
                <span className="font-medium">${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-[#0A2240]">
                <span>Total:</span>
                <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-xl px-8 py-3 font-bold text-white shadow-md transition ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#A81200] hover:bg-[#A81200]/90"
            }`}
          >
            {loading ? "Generando y abriendo Cord..." : "Generar Cotización B2B"}
          </button>
        </div>
      </form>
    </div>
  );
}
