// Layout del portal de clientes (y base para /admin): carga Tailwind + Inter.
// El sitio público (marketing) NO usa este layout (trae su propio CSS de Webflow).
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal de clientes — El Zarco",
  robots: { index: false, follow: false }, // privado: no indexar
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${inter.className} antialiased`}>{children}</div>
  );
}
