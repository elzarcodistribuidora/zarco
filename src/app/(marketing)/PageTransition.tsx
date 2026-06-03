"use client";

import { useEffect } from "react";

/**
 * Transición suave entre páginas del sitio público.
 *
 * Las páginas de Webflow navegan con recarga COMPLETA (links `<a href>`
 * normales), lo que produce un parpadeo blanco al cambiar de página. Aquí:
 *  - La página entra con un fade-in (clase `wf-page-in` en marketing.css, que
 *    arranca antes del primer paint vía la animación CSS → tapa el flash).
 *  - Al picar un link interno se hace fade-out (clase `wf-leaving`) y recién
 *    entonces se navega → el cambio se siente como un cross-fade, no un corte.
 *
 * Se respeta `prefers-reduced-motion`: si está activo, no intercepta nada.
 */
export default function PageTransition() {
  useEffect(() => {
    const root = document.documentElement;
    // Al volver con el caché de "atrás/adelante" (bfcache) la página puede
    // quedar congelada en fade-out: lo limpiamos al mostrarse.
    const onShow = () => root.classList.remove("wf-leaving");
    window.addEventListener("pageshow", onShow);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return () => window.removeEventListener("pageshow", onShow);

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      )
        return;
      // El icono de login/perfil lo maneja PageScripts (popup/menú): no tocar.
      if (a.closest(".auth-trigger")) return;

      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      // Misma página (ancla o recarga): que el navegador haga lo suyo.
      if (url.pathname === location.pathname && url.search === location.search)
        return;

      e.preventDefault();
      root.classList.add("wf-leaving");
      window.setTimeout(() => {
        location.href = url.href;
      }, 200);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  return null;
}
