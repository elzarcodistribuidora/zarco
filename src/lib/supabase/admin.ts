import "server-only";
// Cliente Supabase con SERVICE ROLE: ¡BYPASSEA RLS!
// Úsalo SOLO en el servidor (route handlers, scripts de import, escrituras de sistema)
// y nunca lo expongas al navegador. No persiste sesión.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
