import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

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

// BotID necesita sus propios rewrites de proxy para que el script de detección
// se sirva desde nuestro dominio (ver src/instrumentation-client.ts).
export default withBotId(nextConfig);
