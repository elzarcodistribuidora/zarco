"use client";

import { useEffect } from "react";

// Página que se abre dentro del popup de login: avisa a la ventana principal
// que la sesión quedó lista y se cierra sola. Si no es popup, manda al perfil.
export default function AuthDone() {
  useEffect(() => {
    try {
      window.opener?.postMessage("zarco-auth-done", window.location.origin);
    } catch {}
    window.close();
    // Respaldo: si no era popup (no cerró), redirige.
    const t = setTimeout(() => {
      window.location.href = "/perfil";
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        color: "#0A2240",
      }}
    >
      <p>Listo ✓ Ya puedes cerrar esta ventana.</p>
    </main>
  );
}
