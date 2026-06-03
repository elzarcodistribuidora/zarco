"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { IconCheck, IconAlert } from "./icons";

type ToastKind = "success" | "error";
type Toast = { id: number; message: string; kind: ToastKind; leaving?: boolean };

type ToastApi = (message: string, kind?: ToastKind) => void;

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => {
    // Marca como saliente para animar, luego desmonta.
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  }, []);

  const show = useCallback<ToastApi>(
    (message, kind = "success") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => remove(id), 3000);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            onClick={() => remove(t.id)}
            className={`pointer-events-auto flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg shadow-slate-900/10 ${
              t.leaving ? "admin-toast-out" : "admin-toast-in"
            } ${
              t.kind === "success"
                ? "border-emerald-200 text-slate-800"
                : "border-rose-200 text-slate-800"
            }`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                t.kind === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {t.kind === "success" ? (
                <IconCheck width={16} height={16} />
              ) : (
                <IconAlert width={16} height={16} />
              )}
            </span>
            <span className="min-w-0 flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
