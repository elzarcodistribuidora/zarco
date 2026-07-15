import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Páginas públicas indexables. /perfil (portal de clientes) queda fuera a propósito.
const SLUGS = [
  "index",
  "aviso-de-privacidad",
  "terminos-del-servicio",
  "cremeria",
  "embutidos",
  "abarrotes-basicos",
  "cafeterias",
  "restaurantes",
  "tiendas",
  "guias-de-negocio",
  "contacto",
  "nosotros",
  "delicatessen",
  "catalogo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return SLUGS.map((s) => ({
    url: s === "index" ? SITE : `${SITE}/${s}`,
    changeFrequency: "weekly",
    priority: s === "index" ? 1 : 0.8,
  }));
}
