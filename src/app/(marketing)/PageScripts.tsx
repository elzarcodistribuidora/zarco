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
    // Login de Webflow (modal Google Identity Services). El script
    // initGoogleAuthGlobal reintenta hasta que GIS esté disponible.
    if (!document.querySelector('script[src*="gsi/client"]')) {
      const gsi = document.createElement("script");
      gsi.src = "https://accounts.google.com/gsi/client";
      gsi.async = true;
      gsi.defer = true;
      document.head.appendChild(gsi);
    }

    const injected: HTMLScriptElement[] = [];
    for (const code of js) {
      const el = document.createElement("script");
      el.textContent = code;
      el.dataset.wfPage = "1";
      document.body.appendChild(el);
      injected.push(el);
    }
    document.dispatchEvent(new Event("DOMContentLoaded"));

    return () => injected.forEach((el) => el.remove());
  }, [js]);

  return null;
}
