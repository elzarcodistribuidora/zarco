"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function updateProducto(formData: FormData) {
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
  if (error) throw new Error(`Producto: ${error.message}`);

  // El catálogo público se refresca al instante (mismo tag que /api/inventory).
  revalidateTag("inventory", "max");
  revalidatePath("/admin/productos");
}

export async function updateCliente(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));

  const role = String(formData.get("role"));
  const update = {
    nombre: String(formData.get("nombre") ?? "").trim() || null,
    estatus: String(formData.get("estatus") ?? "").trim() || "Cliente Nuevo",
    nivel: String(formData.get("nivel") ?? "").trim() || null,
    role: role === "admin" ? "admin" : "cliente",
  };

  const { error } = await supabase.from("clientes").update(update).eq("id", id);
  if (error) throw new Error(`Cliente: ${error.message}`);
  revalidatePath("/admin/clientes");
}

export async function updatePedidoStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status") ?? "").trim();

  const { error } = await supabase
    .from("pedidos")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`Pedido: ${error.message}`);
  revalidatePath("/admin/pedidos");
}
