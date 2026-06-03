"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Estado que devuelven las acciones para alimentar useActionState en el cliente
// (toasts de "Guardado" / error). `idle` marca el estado inicial (no notificar).
export type ActionState = {
  ok: boolean;
  error?: string;
  idle?: boolean;
};

const ok = (): ActionState => ({ ok: true });
const fail = (error: string): ActionState => ({ ok: false, error });

// Garantiza que quien llama es admin (las RLS también lo exigen, esto es la
// primera barrera y da un error claro). Devuelve el cliente con la sesión.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data } = await supabase
    .from("clientes")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();
  if (data?.role !== "admin") throw new Error("No autorizado");
  return supabase;
}

export async function updateProducto(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const codigo = String(formData.get("codigo"));

    const precio_final = Number(formData.get("precio_final"));
    const update = {
      nombre_web: String(formData.get("nombre_web") ?? "").trim(),
      categoria: String(formData.get("categoria") ?? "").trim() || null,
      precio_final: Number.isFinite(precio_final) ? precio_final : 0,
      web: formData.get("web") === "on",
    };

    const { error } = await supabase
      .from("productos")
      .update(update)
      .eq("codigo", codigo);
    if (error) return fail(`No se pudo guardar: ${error.message}`);

    // El catálogo público se refresca al instante (mismo tag que /api/inventory).
    revalidateTag("inventory", "max");
    revalidatePath("/admin/productos");
    return ok();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function updateCliente(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const id = String(formData.get("id"));

    const role = String(formData.get("role"));
    const update = {
      nombre: String(formData.get("nombre") ?? "").trim() || null,
      estatus: String(formData.get("estatus") ?? "").trim() || "Cliente Nuevo",
      nivel: String(formData.get("nivel") ?? "").trim() || null,
      role: role === "admin" ? "admin" : "cliente",
    };

    const { error } = await supabase
      .from("clientes")
      .update(update)
      .eq("id", id);
    if (error) return fail(`No se pudo guardar: ${error.message}`);
    revalidatePath("/admin/clientes");
    return ok();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function deleteCliente(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const id = String(formData.get("id"));

    // Evita que un admin se borre a sí mismo (quedaría sin acceso al panel).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: self } = await supabase
        .from("clientes")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
      if (self && String(self.id) === id) {
        return fail("No puedes eliminar tu propia cuenta.");
      }
    }

    // FK seguras: pedidos.cliente_id → SET NULL (el pedido y su email quedan);
    // carritos.cliente_id → CASCADE (se borra el carrito guardado).
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) return fail(`No se pudo eliminar: ${error.message}`);
    revalidatePath("/admin/clientes");
    return ok();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function toggleCotizacionAtendida(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const id = Number(formData.get("id"));
    const atendido = formData.get("atendido") === "true";
    const { error } = await supabase
      .from("cotizaciones")
      .update({ atendido })
      .eq("id", id);
    if (error) return fail(`No se pudo guardar: ${error.message}`);
    revalidatePath("/admin/cotizaciones");
    return ok();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}

export async function updatePedidoStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await requireAdmin();
    const id = String(formData.get("id"));
    const status = String(formData.get("status") ?? "").trim();

    const { error } = await supabase
      .from("pedidos")
      .update({ status })
      .eq("id", id);
    if (error) return fail(`No se pudo guardar: ${error.message}`);
    revalidatePath("/admin/pedidos");
    return ok();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error desconocido");
  }
}
