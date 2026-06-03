import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Configuración de autenticación (Auth.js v5) con Google.
 *
 * Registro ABIERTO: cualquiera puede entrar con su cuenta de Google y queda
 * como "Cliente Nuevo" en la Matriz (ve catálogo + su cuenta para pedir). El
 * objetivo es vender, así que no se restringe a clientes ya registrados.
 * Sigue siendo login por usuario (cada quien ve su propia cuenta/historial).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/portal/login",
  },
  callbacks: {
    // Protege /portal desde el middleware: requiere sesión iniciada.
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
