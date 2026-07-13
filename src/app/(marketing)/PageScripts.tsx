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
    console.log("PageScripts effect ran"); let cancelled = false;
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
      const m = document.getElementById("zarco-profile-menu");
      if (!m) return;
      m.style.pointerEvents = "none";
      m.animate(
        [
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(-6px) scale(.97)" },
        ],
        { duration: 120, easing: "ease-in", fill: "forwards" }
      ).onfinish = () => m.remove();
    }

    // CSS de hover/estilos (no se puede inline) — se inyecta una sola vez.
    function ensureMenuStyles() {
      if (document.getElementById("zarco-profile-menu-css")) return;
      const s = document.createElement("style");
      s.id = "zarco-profile-menu-css";
      s.textContent = `
        #zarco-profile-menu .zpm-item{display:flex;align-items:center;gap:11px;width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;color:#eaf0f7;text-decoration:none;background:none;border:none;cursor:pointer;font:600 14px/1.1 Inter,system-ui,sans-serif;text-align:left;transition:background .15s ease,color .15s ease;}
        #zarco-profile-menu .zpm-item:hover{background:rgba(255,255,255,.08);}
        #zarco-profile-menu .zpm-item svg{flex:0 0 auto;opacity:.85;}
        #zarco-profile-menu .zpm-logout{color:#ff8a7a;}
        #zarco-profile-menu .zpm-logout:hover{background:rgba(168,18,0,.22);color:#ffb3a8;}
      `;
      document.head.appendChild(s);
    }

    function showProfileMenu(anchor: HTMLElement) {
      if (document.getElementById("zarco-profile-menu")) {
        closeMenu();
        return; // toggle
      }
      ensureMenuStyles();

      let u: { name?: string; email?: string; picture?: string; role?: string } =
        {};
      try {
        u = JSON.parse(localStorage.getItem("zarcoUser") || "{}");
      } catch {}
      const name = (u.name || u.email || "Mi cuenta").toString();
      const email = (u.email || "").toString();
      const initial = (name.trim()[0] || "U").toUpperCase();
      const esc = (t: string) =>
        t.replace(/[&<>"']/g, (c) =>
          c === "&"
            ? "&amp;"
            : c === "<"
            ? "&lt;"
            : c === ">"
            ? "&gt;"
            : c === '"'
            ? "&quot;"
            : "&#39;"
        );

      const r = anchor.getBoundingClientRect();
      const menu = document.createElement("div");
      menu.id = "zarco-profile-menu";
      menu.style.cssText = [
        "position:fixed",
        `top:${Math.round(r.bottom + 10)}px`,
        `right:${Math.round(Math.max(12, window.innerWidth - r.right))}px`,
        "z-index:100000",
        "background:linear-gradient(180deg,#0d2a4e 0%,#0A2240 100%)",
        "border-radius:16px",
        "box-shadow:0 18px 50px rgba(5,18,38,.55)",
        "border:1px solid rgba(255,255,255,.10)",
        "padding:7px",
        "min-width:248px",
        "overflow:hidden",
      ].join(";");

      const avatar = u.picture
        ? `<img src="${esc(u.picture)}" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:1px solid rgba(255,255,255,.18);" referrerpolicy="no-referrer">`
        : `<span style="width:42px;height:42px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:#A81200;color:#fff;font:700 18px/1 Inter,system-ui,sans-serif;">${esc(
            initial
          )}</span>`;

      const header =
        `<div style="display:flex;align-items:center;gap:11px;padding:12px 12px 13px;">` +
        avatar +
        `<div style="min-width:0;">` +
        `<div style="font:700 14px/1.2 Inter,system-ui,sans-serif;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;">${esc(
          name
        )}</div>` +
        (email
          ? `<div style="font:500 12px/1.3 Inter,system-ui,sans-serif;color:#9bb2cc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;margin-top:2px;">${esc(
              email
            )}</div>`
          : "") +
        `</div></div>` +
        `<div style="height:1px;background:rgba(255,255,255,.10);margin:0 4px 6px;"></div>`;

      const icoPerfil =
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
      const icoAdmin =
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';
      const icoSalir =
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

      menu.innerHTML =
        header +
        `<a href="/perfil" class="zpm-item">${icoPerfil}<span>Ir a perfil</span></a>` +
        (u.role === "admin"
          ? `<a href="/admin" class="zpm-item">${icoAdmin}<span>Panel admin</span></a>`
          : "") +
        `<button data-act="logout" class="zpm-item zpm-logout">${icoSalir}<span>Cerrar sesión</span></button>`;

      document.body.appendChild(menu);
      menu.animate(
        [
          { opacity: 0, transform: "translateY(-8px) scale(.97)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 160, easing: "cubic-bezier(.16,1,.3,1)" }
      );
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

      const initEvent = "zarco-init-" + Date.now() + "-" + Math.random().toString(36).substring(2);
      for (const code of js) {
        const el = document.createElement("script");
        const trimmed = code.trimStart();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          // JSON-LD structured data — must NOT be executed as JavaScript.
          el.type = "application/ld+json";
          el.textContent = code;
        } else {
          // Replace DOMContentLoaded with our unique event so old listeners don't re-trigger
          let safeCode = code.replace(/['"\`]DOMContentLoaded['"\`]/g, `"${initEvent}"`);
          // Wrap in IIFE to isolate scope
          el.textContent = `(function(){${safeCode}\n})();`;
        }
        el.dataset.wfPage = "1";
        document.body.appendChild(el);
        injected.push(el);
      }
      document.dispatchEvent(new Event(initEvent));
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
