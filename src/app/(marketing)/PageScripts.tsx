"use client";

import { useEffect } from "react";

/**
 * Re-ejecuta los scripts inline de la página de Webflow (slider, carruseles,
 * navbar, reveals) y hace de PUENTE con Supabase Auth (se retiró el login GIS):
 *  - Consulta /api/me y siembra `localStorage.zarcoUser` antes de correr los
 *    scripts, para que el JS de Webflow reconozca la sesión.
 *  - El icono de login/perfil del navbar (`.auth-trigger`) ya NO abre el modal
 *    viejo: si NO hay sesión abre el popup de Google directo; si SÍ hay, abre un
 *    menú chiquito (Ir a perfil / Cerrar sesión). Sin pantalla azul.
 */
export default function PageScripts({ js }: { js: string[] }) {
  useEffect(() => {
    let cancelled = false;
    const injected: HTMLScriptElement[] = [];

    const isLoggedIn = () => !!localStorage.getItem("zarcoUser");

    function signOut() {
      const f = document.createElement("form");
      f.method = "post";
      f.action = "/auth/signout";
      document.body.appendChild(f);
      f.submit();
    }

    async function googleLogin() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const next = location.pathname;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}&popup=1`,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data?.url) {
        location.href = "/portal/login";
        return;
      }
      const w = 480;
      const h = 640;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(
        data.url,
        "zarco-login",
        `width=${w},height=${h},left=${left},top=${top}`
      );
      if (!popup) {
        location.href = data.url;
        return;
      }
      const onMsg = (e: MessageEvent) => {
        if (e.origin !== location.origin || e.data !== "zarco-auth-done") return;
        window.removeEventListener("message", onMsg);
        try {
          popup.close();
        } catch {}
        location.reload(); // recarga: ya con sesión (navbar muestra perfil)
      };
      window.addEventListener("message", onMsg);
    }

    function closeMenu() {
      document.getElementById("zarco-profile-menu")?.remove();
    }

    function showProfileMenu(anchor: HTMLElement) {
      if (document.getElementById("zarco-profile-menu")) {
        closeMenu();
        return; // toggle
      }
      const r = anchor.getBoundingClientRect();
      const menu = document.createElement("div");
      menu.id = "zarco-profile-menu";
      menu.style.cssText = [
        "position:fixed",
        `top:${Math.round(r.bottom + 8)}px`,
        `right:${Math.round(Math.max(12, window.innerWidth - r.right))}px`,
        "z-index:100000",
        "background:#fff",
        "border-radius:14px",
        "box-shadow:0 14px 44px rgba(10,34,64,.20)",
        "border:1px solid #eef1f5",
        "padding:8px",
        "min-width:200px",
        "font:600 14px/1 Inter,system-ui,sans-serif",
      ].join(";");
      const itemCss =
        "display:block;width:100%;text-align:left;box-sizing:border-box;padding:11px 12px;border-radius:9px;color:#0A2240;text-decoration:none;background:none;border:none;cursor:pointer;font:inherit;";
      menu.innerHTML =
        `<a href="/perfil" style="${itemCss}">Ir a perfil</a>` +
        `<button data-act="logout" style="${itemCss}color:#A81200;">Cerrar sesión</button>`;
      document.body.appendChild(menu);
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest) return;

      // Cerrar sesión (botón del menú o cualquier logout viejo).
      if (
        target.closest(
          ".global-logout-btn, #btnLogoutGlobal, #btnPortalLogout, [data-act='logout']"
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        signOut();
        return;
      }

      // Icono de login / perfil del navbar.
      const trigger = target.closest(".auth-trigger") as HTMLElement | null;
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        if (isLoggedIn()) showProfileMenu(trigger);
        else googleLogin();
        return;
      }

      // Click fuera del menú → cerrarlo.
      if (!target.closest("#zarco-profile-menu")) closeMenu();
    };
    document.addEventListener("click", onClick, true);

    async function run() {
      try {
        const r = await fetch("/api/me");
        const { user } = await r.json();
        if (user) {
          localStorage.setItem("zarcoUser", JSON.stringify(user));
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
