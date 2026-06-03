"use client";

import { useEffect } from "react";
import Lenis from "lenis";

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
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
