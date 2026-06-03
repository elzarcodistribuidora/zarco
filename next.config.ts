import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // El "perfil" viejo de Webflow ahora es el portal React de clientes.
      { source: "/perfil", destination: "/portal", permanent: true },
    ];
  },
};

export default nextConfig;
