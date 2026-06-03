"use client";

import Link from "next/link";

/**
 * Botón "Cargar más": navega a la misma página con un `n` mayor (cuántas filas
 * mostrar). Usa `scroll={false}` → la navegación es client-side (RSC) y agrega
 * filas SIN recargar, sin saltar el scroll y conservando lo que estés editando.
 */
export function LoadMore({
  q,
  next,
  restantes,
}: {
  q?: string;
  next: number;
  restantes: number;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("n", String(next));
  return (
    <div className="border-t border-slate-100 p-3 text-center">
      <Link
        href={`/admin/productos?${params.toString()}`}
        scroll={false}
        prefetch={false}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-[#0A2240] outline-none transition-all duration-150 hover:bg-slate-50 active:scale-[0.97]"
      >
        Cargar más
        <span className="text-xs font-normal text-slate-400">
          ({restantes} restantes)
        </span>
      </Link>
    </div>
  );
}
