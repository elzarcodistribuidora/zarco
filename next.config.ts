import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // El catálogo vive en /catalogo, pero los clientes lo buscan en
      // /productos. Esto hace que /productos muestre el catálogo SIN cambiar
      // la dirección (y /catalogo sigue funcionando para los links internos).
      { source: "/productos", destination: "/catalogo" },
    ];
  },
};

export default nextConfig;
