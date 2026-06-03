// Next.js 16 renombró "Middleware" → "Proxy" (misma funcionalidad).
// Auth.js v5 expone `auth` como handler compatible: protege /portal usando el
// callback `authorized` de src/auth.ts (sin sesión → redirige a /portal/login).
export { auth as proxy } from "@/auth";

export const config = {
  // Solo corre en el portal. /portal/login queda permitido por el callback.
  matcher: ["/portal/:path*"],
};
