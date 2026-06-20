// Next.js 16 renombró "Middleware" → "Proxy" (misma funcionalidad).
// Supabase Auth: refresca la sesión y protege /admin.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Ahora el proxy (middleware) corre en todas las rutas públicas y privadas.
  // Esto garantiza que la sesión de Supabase se refresque siempre (evita desconexiones al navegar en el Inicio).
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - assets (webflow static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)"
  ],
};
