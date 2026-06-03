// Next.js 16 renombró "Middleware" → "Proxy" (misma funcionalidad).
// Migrado a Supabase Auth: refresca la sesión y protege /portal y /admin.
// (Auth.js / next-auth queda inerte; se retira en la limpieza final.)
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // /admin: protegido. /perfil, /catalogo, /productos, /portal/login: solo
  // refrescan la sesión de Supabase (no se protegen).
  matcher: ["/admin/:path*", "/portal/:path*", "/perfil", "/catalogo", "/productos"],
};
