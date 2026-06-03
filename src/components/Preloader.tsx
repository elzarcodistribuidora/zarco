"use client";

import { useEffect, useRef, useState } from "react";
import "./preloader.css";

const LOGO = "/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp";
const MIN_MS = 700; // tiempo mínimo visible
const MAX_MS = 12000; // tope de seguridad: nunca se queda colgado

/**
 * Preloader de entrada: logo del Zarco + barra de progreso 0→100%.
 *
 * Se usa SOLO en páginas que cargan datos (catálogo y portal): la barra
 * sube hacia ~92% y solo llega a 100% cuando (a) la página terminó de
 * cargar, (b) pasó el mínimo y (c) —si se pasa `waitForSelector`— ese
 * contenedor ya tiene contenido (los productos ya se renderizaron). Así
 * el cliente ve todo listo de inmediato, sin esperar a que aparezca.
 */
export default function Preloader({
  waitForSelector,
}: {
  waitForSelector?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("zarco-loading");

    const finish = () => {
      setHidden(true);
      window.setTimeout(
        () => document.documentElement.classList.remove("zarco-loading"),
        200
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    let p = 0;
    let raf = 0;
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);

    const contentReady = () => {
      if (!waitForSelector) return true;
      const el = document.querySelector(waitForSelector);
      return !!el && el.children.length > 0;
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = loaded && elapsed > MIN_MS && contentReady();
      const target =
        ready || elapsed > MAX_MS ? 100 : Math.min(92, (elapsed / 1600) * 92);
      p += (target - p) * 0.08;
      if (target === 100 && p > 99.3) p = 100;
      if (barRef.current) barRef.current.style.width = `${p}%`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(p)}%`;
      if (p >= 100) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      document.documentElement.classList.remove("zarco-loading");
    };
  }, [waitForSelector]);

  return (
    <div
      className={`zarco-preloader${hidden ? " is-hidden" : ""}`}
      aria-hidden={hidden}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="zarco-preloader__logo" src={LOGO} alt="El Zarco" />
      <div className="zarco-preloader__track">
        <div ref={barRef} className="zarco-preloader__bar" />
      </div>
      <span ref={pctRef} className="zarco-preloader__pct">
        0%
      </span>
    </div>
  );
}
