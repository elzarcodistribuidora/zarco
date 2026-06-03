import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUserSession } from "@/lib/matriz";

/**
 * Configuración de autenticación (Auth.js v5) con Google.
 *
 * Seguridad: SOLO los clientes registrados en CRM CLIENTES pueden entrar al
 * portal. Un email desconocido devuelve id "CLI-NUEVO" desde la Matriz y se
 * rechaza el acceso (antes, en Webflow, cualquiera entraba vía localStorage).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/portal/login",
  },
  callbacks: {
    // Solo deja entrar a clientes que existen en la Matriz (CRM CLIENTES).
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;
      try {
        const { userData } = await getUserSession(email);
        const esCliente = !!userData && userData.id !== "CLI-NUEVO";
        return esCliente ? true : "/portal/login?error=NoAutorizado";
      } catch {
        // Si la Matriz no responde, no arriesgamos: no se permite el acceso.
        return "/portal/login?error=Conexion";
      }
    },
    // Controla el acceso a /portal desde el middleware.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/portal/login");
      const isPortal = pathname.startsWith("/portal");
      if (isLogin) return true;
      if (isPortal) return !!auth?.user; // sin sesión => redirige a login
      return true;
    },
  },
});
