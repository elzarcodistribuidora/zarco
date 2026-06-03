// Identidad del usuario logueado (sesión Supabase) para el JS del catálogo/perfil.
// Reemplaza al login GIS: el navegador llama esto en vez de leer localStorage.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ user: null });

  const { data: cliente } = await supabase
    .from("clientes")
    .select("nombre, email, role")
    .eq("auth_user_id", user.id)
    .single();

  return NextResponse.json({
    user: {
      email: cliente?.email ?? user.email,
      name: cliente?.nombre ?? user.email,
      picture:
        (user.user_metadata?.avatar_url as string) ??
        (user.user_metadata?.picture as string) ??
        "",
      role: cliente?.role ?? "cliente",
    },
  });
}
