// Next.js 16 renombró "Middleware" → "Proxy" (misma funcionalidad).
// Supabase Auth: refresca la sesión y protege /admin.
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
