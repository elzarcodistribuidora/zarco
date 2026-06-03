"use client";

import { useEffect } from "react";

/**
 * Re-ejecuta los scripts inline de la página de Webflow (slider, carruseles,
 * navbar, reveals). El HTML se inyecta con dangerouslySetInnerHTML, que NO
 * ejecuta <script>, así que aquí los recreamos como elementos reales.
 *
 * Además hace de PUENTE con Supabase Auth (se retiró el login GIS viejo):
 *  - Antes de correr los scripts, consulta /api/me y siembra
 *    `localStorage.zarcoUser` para que el JS de Webflow (que lo lee) reconozca
 *    la sesión de Supabase.
 *  - Intercepta por delegación los botones viejos de login/logout y los manda a
 *    /portal/login y /auth/signout (robusto: no depende de cuándo se rendericen).
 */
export default function PageScripts({ js }: { js: string[] }) {
  useEffect(() => {
    let cancelled = false;
    const injected: HTMLScriptElement[] = [];

    // Puente de auth: login/logout viejos → Supabase.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest?.(
        ".auth-trigger, .global-logout-btn, #btnLogoutGlobal, #btnPortalLogout, #googleButtonContainer a"
      ) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();

      const isLogout = el.matches(
        ".global-logout-btn, #btnLogoutGlobal, #btnPortalLogout"
      );
      if (isLogout) {
        const f = document.createElement("form");
        f.method = "post";
        f.action = "/auth/signout";
        document.body.appendChild(f);
        f.submit();
        return;
      }
      const logged = !!localStorage.getItem("zarcoUser");
      window.location.href = logged
        ? "/perfil"
        : "/portal/login?next=" + encodeURIComponent(location.pathname);
    };
    document.addEventListener("click", onClick, true);

    async function run() {
      // Siembra la identidad de Supabase ANTES de correr los scripts de Webflow.
      try {
        const r = await fetch("/api/me");
        const { user } = await r.json();
        if (user) {
          localStorage.setItem("zarcoUser", JSON.stringify(user));
          // Botón "Panel admin" SOLO en /perfil y SOLO para admins.
          if (user.role === "admin" && location.pathname === "/perfil") {
            addAdminButton();
          }
        } else {
          localStorage.removeItem("zarcoUser");
        }
      } catch {
        /* sin red: corre como invitado */
      }
      if (cancelled) return;

      for (const code of js) {
        const el = document.createElement("script");
        el.textContent = code;
        el.dataset.wfPage = "1";
        document.body.appendChild(el);
        injected.push(el);
      }
      // Los scripts originales envuelven su lógica en DOMContentLoaded, que ya
      // disparó; lanzamos uno sintético para que corran.
      document.dispatchEvent(new Event("DOMContentLoaded"));
    }
    run();

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick, true);
      injected.forEach((el) => el.remove());
    };
  }, [js]);

  return null;
}

// Botón flotante "Panel admin" → /admin (inyectado solo para admins en /perfil).
function addAdminButton() {
  if (document.getElementById("zarco-admin-fab")) return;
  const a = document.createElement("a");
  a.id = "zarco-admin-fab";
  a.href = "/admin";
  a.textContent = "⚙ Panel admin";
  a.style.cssText = [
    "position:fixed",
    "left:20px",
    "bottom:20px",
    "z-index:99999",
    "background:#A81200",
    "color:#fff",
    "font:700 15px/1 Inter,system-ui,sans-serif",
    "padding:14px 22px",
    "border-radius:9999px",
    "box-shadow:0 10px 30px rgba(168,18,0,.35)",
    "text-decoration:none",
  ].join(";");
  document.body.appendChild(a);
}
