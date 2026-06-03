"use client";

import { useEffect } from "react";

/**
 * Re-ejecuta los scripts inline de la página de Webflow (slider, carruseles,
 * navbar, reveals). El HTML se inyecta con dangerouslySetInnerHTML, que NO
 * ejecuta <script>, así que aquí los recreamos como elementos reales.
 *
 * Los scripts originales envuelven su lógica en addEventListener
 * ("DOMContentLoaded", ...). Como en este punto ese evento YA disparó, tras
 * inyectarlos lanzamos un DOMContentLoaded sintético para que corran.
 */
export default function PageScripts({ js }: { js: string[] }) {
  useEffect(() => {
    const injected: HTMLScriptElement[] = [];
    for (const code of js) {
      const el = document.createElement("script");
      el.textContent = code;
      el.dataset.wfPage = "1";
      document.body.appendChild(el);
      injected.push(el);
    }
    document.dispatchEvent(new Event("DOMContentLoaded"));

    // #4 — Login unificado: el navbar usa Auth.js (/portal), no el modal viejo
    // (Google Identity Services + localStorage). Clonar el botón quita los
    // listeners del script viejo; luego apunta a /portal. Se quitan los modales.
    const goPortal = (e: Event) => {
      e.preventDefault();
      window.location.href = "/portal";
    };
    document.querySelectorAll<HTMLElement>(".auth-trigger").forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      el.replaceWith(clone);
      clone.addEventListener("click", goPortal);
    });
    ["globalAuthModal", "globalProfileModal"].forEach((id) =>
      document.getElementById(id)?.remove()
    );

    return () => injected.forEach((el) => el.remove());
  }, [js]);

  return null;
}
