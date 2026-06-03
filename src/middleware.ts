export { auth as middleware } from "@/auth";

// Protege solo el portal; el sitio público queda libre.
export const config = {
  matcher: ["/portal/:path*"],
};
