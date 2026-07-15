"use client";

import { useCallback, useEffect, useState } from "react";

export type ZarcoUser = {
  name?: string;
  email?: string;
  picture?: string;
  role?: string;
};

// Sesión del sitio público: consulta /api/me (la fuente de verdad, RLS) y
// hace login/logout con el mismo flujo de popup de Google que ya usa
// PageScripts.tsx para las páginas todavía basadas en Webflow.
export function useZarcoAuth() {
  const [user, setUser] = useState<ZarcoUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/me");
      const { user } = await r.json();
      setUser(user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const next = window.location.pathname;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&popup=1`,
        skipBrowserRedirect: true,
      },
    });
    if (error || !data?.url) {
      window.location.href = "/portal/login";
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
      window.location.href = data.url;
      return;
    }
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data !== "zarco-auth-done")
        return;
      window.removeEventListener("message", onMsg);
      try {
        popup.close();
      } catch {}
      window.location.reload();
    };
    window.addEventListener("message", onMsg);
  }, []);

  const logout = useCallback(() => {
    const f = document.createElement("form");
    f.method = "post";
    f.action = "/auth/signout";
    document.body.appendChild(f);
    f.submit();
  }, []);

  return { user, loading, login, logout };
}
