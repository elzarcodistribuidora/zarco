"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Login del portal con Google (Supabase Auth). Registro abierto: cualquiera
// entra con su Google y queda como "Cliente Nuevo" (lo crea el trigger en la DB).
export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createClient();
    const next =
      new URLSearchParams(window.location.search).get("next") || "/perfil";

    // Pedimos la URL de OAuth pero NO redirigimos: la abrimos en un popup.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&popup=1`,
        skipBrowserRedirect: true,
      },
    });
    if (error || !data?.url) {
      setLoading(false);
      alert("No se pudo iniciar sesión. Intenta de nuevo.");
      return;
    }

    // Ventana emergente centrada.
    const w = 480;
    const h = 640;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      data.url,
      "zarco-login",
      `width=${w},height=${h},left=${left},top=${top}`
    );

    // Si el navegador bloquea el popup → redirect normal (respaldo).
    if (!popup) {
      window.location.href = data.url;
      return;
    }

    // Cuando el popup termina, avisa por postMessage → vamos al perfil.
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data !== "zarco-auth-done")
        return;
      window.removeEventListener("message", onMessage);
      clearInterval(timer);
      try {
        popup.close();
      } catch {}
      window.location.href = next;
    };
    window.addEventListener("message", onMessage);

    // Si cierran el popup sin terminar, reactiva el botón.
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", onMessage);
        setLoading(false);
      }
    }, 500);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#0A2240] p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
            Portal de clientes
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Entra con tu cuenta de Google para ver tu catálogo, precios y
            pedidos.
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
            />
          </svg>
          {loading ? "Conectando…" : "Entrar con Google"}
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Al entrar aceptas los términos del servicio de El Zarco.
        </p>
      </div>
    </main>
  );
}
