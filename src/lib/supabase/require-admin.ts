import "server-only";
// Guard de rol admin para route handlers (`/api/*`).
//
// OJO: el proxy NO cubre esto. `lib/supabase/middleware.ts` filtra por
// `path.startsWith("/admin")`, y las rutas de API empiezan con `/api` — así que
// cada route handler bajo `/api/admin/*` (y cualquier otro que sea solo para
// admins) tiene que llamar a este guard por su cuenta.
//
// Los Server Actions de `admin/actions.ts` tienen su propio `requireAdmin()`
// basado en throw, porque ahí conviene el flujo de excepciones + ActionState.
import { createClient } from "./server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type AdminGuard =
  | { ok: true; supabase: SupabaseServerClient }
  | { ok: false; status: 401 | 403; error: string };

export async function requireAdmin(): Promise<AdminGuard> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, status: 401, error: "No autenticado" };
  }

  // El registro es abierto (trigger `handle_new_user`): tener sesión NO implica
  // ser admin. Hay que mirar el rol explícitamente.
  const { data: cliente } = await supabase
    .from("clientes")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (cliente?.role !== "admin") {
    return { ok: false, status: 403, error: "No autorizado" };
  }

  return { ok: true, supabase };
}
