"use client";

import { useFormStatus } from "react-dom";

type Variant = "primary" | "subtle" | "ghost";

const VARIANTS: Record<Variant, string> = {
  // Azul marino de marca.
  primary:
    "bg-[#0A2240] text-white hover:bg-[#0c2c54] focus-visible:ring-[#0A2240]/40",
  // Gris que se vuelve marino al hover (patrón actual del admin).
  subtle:
    "bg-slate-100 text-slate-700 hover:bg-[#0A2240] hover:text-white focus-visible:ring-[#0A2240]/30",
  // Solo borde.
  ghost:
    "border border-slate-200 text-slate-700 hover:bg-[#0A2240] hover:text-white focus-visible:ring-[#0A2240]/30",
};

export function SaveButton({
  children = "Guardar",
  pendingLabel = "Guardando…",
  variant = "subtle",
  className = "",
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
  variant?: Variant;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold outline-none transition-all duration-150 focus-visible:ring-2 active:scale-[0.97] disabled:cursor-progress disabled:opacity-90 ${VARIANTS[variant]} ${className}`}
    >
      {pending && (
        <span
          className="admin-spin h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
