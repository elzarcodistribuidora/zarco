"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    /** Instancia activa de Lenis, expuesta para scrolls programáticos (ver TrayBuilder.tsx). */
    __lenis?: Lenis;
  }
}

/**
 * Scroll suave con inercia (Lenis) en todo el sitio público.
 * Respeta "prefers-reduced-motion". El scroll nativo de los carruseles
 * horizontales no se ve afectado (Lenis solo suaviza el scroll vertical).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // lerp más alto = el scroll "alcanza" más rápido al puntero = se siente
      // ágil pero sigue suave (0.1 se sentía flotante/lento). 0 = pesado,
      // 1 = instantáneo.
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1.05, // cada giro de rueda avanza un pelín más
      touchMultiplier: 1.6, // gesto táctil con más recorrido
      // Lenis secuestra el scroll de TODA la ventana. Sin esto, al abrir un
      // panel con scroll propio (carrito lateral, drawer móvil, menús
      // flotantes) la rueda/el gesto movía la página de fondo y el contenido
      // interno "no bajaba". Devolviendo true aquí, Lenis ignora el evento y
      // deja que el overflow nativo del panel scrollee. Cubre el carrito del
      // catálogo (#cartDrawer / .cart-body), el drawer móvil y cualquier
      // elemento marcado con data-lenis-prevent.
      prevent: (node) =>
        !!node.closest(
          "#cartDrawer, .cart-drawer, #mobile-drawer, [data-lenis-prevent]"
        ),
    });

    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);

  return null;
}
