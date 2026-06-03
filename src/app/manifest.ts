import type { MetadataRoute } from "next";

// Manifest para Android / PWA. Los íconos se generan con
// `npm run build:favicons` (scripts/build-favicons.mjs).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "El Zarco — Distribuidora de abarrotes",
    short_name: "El Zarco",
    description: "Distribuidora de abarrotes por mayoreo",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0A2240",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
