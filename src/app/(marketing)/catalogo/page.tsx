import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import CatalogApp from "@/components/marketing/catalog/CatalogApp";
import CatalogRecs from "../CatalogRecs";

export const metadata: Metadata = {
  title: "Catálogo de Insumos y Alimentos por Mayoreo 2026 | El Zarco",
  description:
    "Explora nuestro catálogo B2B 2026. Lácteos, abarrotes y embutidos con precios por volumen. Todo lo que tu cocina o tienda necesita, aquí.",
  alternates: { canonical: "/catalogo" },
};

export default function CatalogoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F7F9] pt-[var(--navbar-h)] pb-16">
        <Reveal>
          <header className="mb-8 w-full overflow-hidden">
            <picture>
              <source media="(max-width: 768px)" srcSet="/assets/69a8edd0e44665f84828bc77_BANNER-4-MOVIL.webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/69a8edc79c630de5740cff33_BANNER-4.webp"
                alt="Catálogo B2B - El Zarco Mayoreo"
                className="block w-full"
              />
            </picture>
          </header>
        </Reveal>
        <CatalogApp />
      </main>
      <CatalogRecs />
      <Footer />
    </>
  );
}
