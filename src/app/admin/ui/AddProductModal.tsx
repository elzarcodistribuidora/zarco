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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0A2240]">Nuevo Producto</h2>
          <button 
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Código</label>
            <input 
              name="codigo" 
              required 
              placeholder="Ej. ZRC-1010"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/20"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Nombre</label>
            <input 
              name="nombre_web" 
              required 
              placeholder="Nombre del producto"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Categoría</label>
              <select 
                name="categoria"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/20"
              >
                <option value="">— Ninguna —</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Precio final</label>
              <input 
                name="precio_final" 
                type="number" 
                step="0.01" 
                min="0"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="chk-web"
              name="web" 
              defaultChecked 
              className="h-4 w-4 rounded border-slate-300 text-[#0A2240] focus:ring-[#0A2240]"
            />
            <label htmlFor="chk-web" className="text-sm text-slate-600">Mostrar en la web</label>
          </div>

          {state.error && !state.idle && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {state.error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c2c54] disabled:opacity-70"
            >
              {isPending ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
