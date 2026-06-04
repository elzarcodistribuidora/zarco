"use client";

import type { CartItem } from "@/lib/matriz";
import { mxn } from "./format";

const FREE_SHIPPING = 3000;

export default function CartDrawer({
  open,
  onClose,
  items,
  total,
  sending,
  onSetQty,
  onRemove,
  onClear,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  sending: boolean;
  onSetQty: (code: string, qty: number) => void;
  onRemove: (code: string) => void;
  onClear: () => void;
  onSend: () => void;
}) {
  const falta = Math.max(0, FREE_SHIPPING - total);
  const pct = Math.min(100, (total / FREE_SHIPPING) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-brand-navy px-5 py-4 text-white">
          <h2 className="text-lg font-black">Mi requisición</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-white/70 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Barra de envío gratis */}
        <div className="border-b border-slate-100 px-5 py-3">
          {falta > 0 ? (
            <p className="text-xs text-slate-500">
              Te faltan{" "}
              <span className="font-bold text-brand-red">{mxn(falta)}</span> para
              envío sin costo
            </p>
          ) : (
            <p className="text-xs font-bold text-green-600">
              ✓ Calificas para envío sin costo
            </p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-red transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              Tu requisición está vacía.
              <br />
              Agrega productos desde el catálogo.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.code}
                  className="rounded-xl border border-slate-100 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {it.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {it.code} · {mxn(it.price)} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(it.code)}
                      className="text-xs font-bold text-slate-400 hover:text-brand-red"
                      aria-label="Quitar"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSetQty(it.code, it.qty - 1)}
                        className="h-7 w-7 rounded-lg border border-slate-200 font-bold text-brand-navy"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) =>
                          onSetQty(it.code, parseInt(e.target.value) || 0)
                        }
                        className="w-14 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm outline-none focus:border-brand-navy"
                      />
                      <button
                        onClick={() => onSetQty(it.code, it.qty + 1)}
                        className="h-7 w-7 rounded-lg border border-slate-200 font-bold text-brand-navy"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-black text-brand-navy">
                      {mxn(it.price * it.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              Total estimado
            </span>
            <span className="text-2xl font-black text-brand-navy">
              {mxn(total)}
            </span>
          </div>
          <button
            onClick={onSend}
            disabled={items.length === 0 || sending}
            className="mt-3 w-full rounded-xl bg-brand-red py-3.5 font-bold text-white transition hover:brightness-110 disabled:opacity-40"
          >
            {sending ? "Registrando…" : "Enviar pedido por WhatsApp"}
          </button>
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="mt-2 w-full py-2 text-xs font-bold text-slate-400 hover:text-brand-red"
            >
              Vaciar requisición
            </button>
          )}
          <p className="mt-2 text-center text-[11px] leading-tight text-slate-400">
            Se registra en la Matriz y se abre WhatsApp con tu pedido listo para
            confirmar.
          </p>
        </div>
      </aside>
    </>
  );
}
