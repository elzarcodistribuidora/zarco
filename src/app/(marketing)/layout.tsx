import { Suspense } from "react";
import "./marketing-tailwind.css";
import "./marketing.css";
import SmoothScroll from "./SmoothScroll";
import PageTransition from "./PageTransition";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Activa las animaciones (clase `wf-anim` en <html>) ANTES del primer
          paint, salvo que el usuario pida menos movimiento. Hacerlo aquí (y no
          en un efecto) evita el parpadeo de "aparece → se esconde → entra". */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)" +
            "document.documentElement.classList.add('wf-anim')}catch(e){}",
        }}
      />
      {/* Fuente Inter (la del sitio original) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap"
      />
      {/* Scroll suave en todo el sitio. */}
      <SmoothScroll />
      <Suspense fallback={null}>
        <PageTransition />
      </Suspense>
      {children}
    </>
  );
}
