import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "El Zarco — Distribuidora de abarrotes por mayoreo",
    template: "%s",
  },
  description: "El Zarco — Distribuidora de abarrotes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Layout raíz neutro: cada sección (marketing / portal) trae su propio CSS.
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
