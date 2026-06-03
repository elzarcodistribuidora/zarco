"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "./Toaster";
import { IconTrash } from "./icons";
import type { ActionState } from "../actions";

const INITIAL: ActionState = { ok: false, idle: true };

// Form independiente con un botón de eliminar (papelera) + confirmación nativa
// + toast de feedback. Se usa como HERMANO de <RowForm> (los <form> no se
// anidan), así el flash verde de guardado de la fila no se ve afectado.
export function DeleteForm({
  action,
  id,
  confirmMessage,
  deletedMessage = "Eliminado",
  title = "Eliminar",
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  id: string | number;
  confirmMessage: string;
  deletedMessage?: string;
  title?: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL);
  const toast = useToast();

  useEffect(() => {
    if (state.idle) return; // estado inicial, no notificar
    if (state.ok) toast(deletedMessage, "success");
    else if (state.error) toast(state.error, "error");
  }, [state, deletedMessage, toast]);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className="flex shrink-0 items-center"
    >
      <input type="hidden" name="id" value={id} />
      <DeleteButton title={title} />
    </form>
  );
}

function DeleteButton({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      title={title}
      aria-label={title}
      className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-3 text-slate-400 outline-none transition-all duration-150 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500/30 active:scale-[0.97] disabled:cursor-progress disabled:opacity-90"
    >
      {pending ? (
        <span
          className="admin-spin h-[18px] w-[18px] rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        <IconTrash width={18} height={18} />
      )}
    </button>
  );
}
