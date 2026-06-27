"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { createProducto } from "../actions";

const CATEGORIAS = [
  { value: "Lacteos", label: "Lácteos" },
  { value: "Abarrotes", label: "Abarrotes" },
  { value: "Embutidos", label: "Embutidos" },
  { value: "Vinos Y Licores", label: "Vinos y Licores" },
  { value: "Sys", label: "Sys" },
];

import { createPortal } from "react-dom";

export function AddProductModal({ onClose }: { onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(createProducto, { idle: true, ok: false });
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state.ok) {
      handleClose();
    }
  }, [state.ok]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200); // match animation duration
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#0A2240]">Nuevo Producto</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">Agrega un artículo al catálogo.</p>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form ref={formRef} action={formAction} className="space-y-5" id="add-product-form">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Código (SKU)</label>
              <input 
                name="codigo" 
                required 
                placeholder="Ej. ZRC-1010"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#0A2240] focus:bg-white focus:ring-4 focus:ring-[#0A2240]/10 placeholder:text-[#98989D] placeholder:font-normal"
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Nombre Público</label>
              <input 
                name="nombre_web" 
                required 
                placeholder="Nombre del producto"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#0A2240] focus:bg-white focus:ring-4 focus:ring-[#0A2240]/10 placeholder:text-[#98989D] placeholder:font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Categoría</label>
                <select 
                  name="categoria"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#0A2240] focus:bg-white focus:ring-4 focus:ring-[#0A2240]/10 text-slate-700"
                >
                  <option value="" className="text-[#98989D]">— Ninguna —</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Precio Final</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">$</span>
                  <input 
                    name="precio_final" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-4 text-sm outline-none transition focus:border-[#0A2240] focus:bg-white focus:ring-4 focus:ring-[#0A2240]/10 placeholder:text-[#98989D] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
              <div>
                <label htmlFor="chk-web" className="block cursor-pointer text-sm font-bold text-[#0A2240]">Mostrar en la web</label>
                <p className="mt-0.5 text-xs font-medium text-slate-500">Si lo desactivas, solo el admin podrá verlo.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="chk-web"
                  name="web"
                  defaultChecked
                  className="peer sr-only"
                />
                <span className="h-7 w-12 rounded-full bg-[#E5E5EA] transition-colors duration-200 ease-out peer-checked:bg-[#007AFF] peer-focus-visible:ring-2 peer-focus-visible:ring-[#007AFF]/45 peer-focus-visible:ring-offset-1" />
                <span className="pointer-events-none absolute left-[2px] top-1/2 h-[24px] w-[24px] -translate-y-1/2 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] transition-transform duration-200 ease-out peer-checked:translate-x-5" />
              </label>
            </div>

            {state.error && !state.idle && (
              <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <div className="font-bold">Oops, hubo un problema</div>
                <div className="mt-0.5 opacity-90">{state.error}</div>
              </div>
            )}
          </form>
        </div>

        <div className="border-t border-slate-100 bg-white/50 px-6 py-5 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={handleClose}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="add-product-form"
            disabled={isPending}
            className="rounded-xl bg-[#0A2240] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0A2240]/20 transition hover:-translate-y-0.5 hover:bg-[#0c2c54] hover:shadow-[#0A2240]/30 disabled:pointer-events-none disabled:opacity-70"
          >
            {isPending ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
