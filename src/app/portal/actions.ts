"use server";

// Server Actions del portal. TODO se ejecuta en el servidor y el email SIEMPRE
// sale de la sesión verificada (Auth.js), nunca de un parámetro del cliente.
// Esto cierra el hueco del portal viejo (que confiaba en localStorage).

import { auth, signOut } from "@/auth";
import {
  getUserSession,
  saveOrder,
  syncCart,
  type CartItem,
} from "@/lib/matriz";

const WHATSAPP_NUMERO = "522298477440";
const mxn = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export type SendOrderResult =
  | { ok: true; folio: string; waUrl: string }
  | { ok: false; error: string };

/**
 * Registra el pedido en la Matriz (saveOrder) y devuelve el folio + el link de
 * WhatsApp prellenado para abrir hacia el número de la matriz. El cliente abre
 * ese link; el registro en Sheets ya quedó hecho aquí.
 */
export async function sendOrder(items: CartItem[]): Promise<SendOrderResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return { ok: false, error: "Sesión no válida. Vuelve a iniciar sesión." };
  if (!Array.isArray(items) || items.length === 0)
    return { ok: false, error: "Tu requisición está vacía." };

  // Identidad del cliente desde la Matriz (no del cliente), con fallbacks.
  let nombre = session.user?.name ?? "Cliente";
  let clientId = "CLI-NUEVO";
  try {
    const s = await getUserSession(email);
    if (s.userData?.nombre) nombre = s.userData.nombre;
    if (s.userData?.id) clientId = s.userData.id;
  } catch {
    /* usamos los fallbacks */
  }

  let total = 0;
  let resumen = "";
  let msg =
    `Hola Matriz El Zarco, soy *${nombre}* (${email}).\n\n` +
    `Solicito la cotización formal de la siguiente requisición armada en el Portal B2B:\n\n`;

  for (const it of items) {
    const qty = Math.max(1, Math.floor(Number(it.qty) || 1));
    const price = Number(it.price) || 0;
    const lineTotal = price * qty;
    total += lineTotal;
    resumen += `${qty}x ${it.name} (${it.code}), `;
    msg += `🔸 ${qty}x ${it.name} (Cod: ${it.code}) - $${mxn.format(lineTotal)}\n`;
  }
  resumen = resumen.slice(0, -2);
  msg += `\n*TOTAL ESTIMADO:* $${mxn.format(total)} MXN\n\nQuedo a la espera de la confirmación operativa.`;

  let folio = "";
  try {
    const r = await saveOrder({ clientId, negocio: nombre, email, resumen, total });
    if (r?.folio) folio = String(r.folio);
  } catch {
    return { ok: false, error: "No se pudo registrar el pedido en la Matriz." };
  }

  if (folio) {
    msg = msg.replace(
      "Solicito la cotización",
      `*REQUISICIÓN ${folio}*\n\nSolicito la cotización`
    );
  }

  // Pedido enviado → vaciamos el carrito guardado en la nube.
  try {
    await syncCart(email, "[]");
  } catch {
    /* no crítico */
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
  return { ok: true, folio: folio || "—", waUrl };
}

/** Cierra la sesión y manda al inicio del sitio público. */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/** Guarda (sincroniza) el carrito del cliente en la nube. */
export async function saveCart(items: CartItem[]): Promise<{ ok: boolean }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false };
  try {
    await syncCart(email, JSON.stringify(items));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
