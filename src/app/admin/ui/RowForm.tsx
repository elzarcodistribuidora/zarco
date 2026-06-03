"use client";

import { useActionState, useEffect, useRef } from "react";
import { useToast } from "./Toaster";
import type { ActionState } from "../actions";

const INITIAL: ActionState = { ok: false, idle: true };

// Envuelve un <form> con server action y le añade feedback:
// - toast "Guardado" / error,
// - flash verde sutil en la fila al guardar.
// Funciona con cualquier server action de firma (prevState, formData) => ActionState.
export function RowForm({
  action,
  children,
  className = "",
  style,
  savedMessage = "Guardado",
  flash = true,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  savedMessage?: string;
  flash?: boolean;
}) {
  const [state, formAction] = useActionState(action, INITIAL);
  const toast = useToast();
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.idle) return; // estado inicial, no notificar
    if (state.ok) {
      toast(savedMessage, "success");
      if (flash && ref.current) {
        const el = ref.current;
        el.classList.remove("admin-flash");
        void el.offsetWidth; // fuerza reflow para reiniciar la animación
        el.classList.add("admin-flash");
      }
    } else if (state.error) {
      toast(state.error, "error");
    }
    // Re-dispara en cada submit porque useActionState devuelve un objeto nuevo.
  }, [state, savedMessage, flash, toast]);

  return (
    <form ref={ref} action={formAction} className={className} style={style}>
      {children}
    </form>
  );
}
