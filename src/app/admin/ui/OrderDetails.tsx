"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getPedidoItems } from "../actions";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function OrderDetailsButton({ pedidoId, folio }: { pedidoId: string, folio: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:bg-slate-100 hover:text-[#0A2240] active:scale-95"
      >
        <span>Detalles</span>
        <svg className="transition-transform group-hover:translate-x-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {isOpen && <OrderDetailsModal pedidoId={pedidoId} folio={folio} onClose={() => setIsOpen(false)} />}
    </>
  );
}

function OrderDetailsModal({ pedidoId, folio, onClose }: { pedidoId: string; folio: string; onClose: () => void }) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    getPedidoItems(pedidoId).then((res) => {
      if (res.ok) {
        setData(res);
      }
      setLoading(false);
    });
  }, [pedidoId]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
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
        className={`relative flex h-full w-full max-w-lg flex-col overflow-hidden bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#0A2240]">Pedido {folio}</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Desglose detallado de la compra.
            </p>
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
          {loading ? (
            <div className="flex h-40 items-center justify-center text-slate-400">
              <svg className="h-6 w-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
          ) : !data || !data.items || data.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
              No hay productos registrados en este pedido.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
                <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Datos del Cliente</div>
                <div className="text-sm font-semibold text-[#0A2240]">{data.pedido?.email}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Fecha: {new Date(data.pedido?.fecha).toLocaleString("es-MX")}
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Artículos</div>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-900/[0.02]">
                  {data.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-[#0A2240]">
                          {item.cantidad}x
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0A2240]">{item.nombre}</div>
                          <div className="text-xs text-slate-500">{item.codigo || "Sin código"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#0A2240]">
                          {mxn.format(Number(item.precio) * Number(item.cantidad))}
                        </div>
                        <div className="text-xs text-slate-500">
                          {mxn.format(Number(item.precio))} c/u
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <span className="font-bold text-[#0A2240]">Total del Pedido</span>
                <span className="text-xl font-black tracking-tight text-[#0A2240]">
                  {mxn.format(Number(data.pedido?.total))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
