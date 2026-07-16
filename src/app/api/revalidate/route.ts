// Revalidación on-demand del catálogo. Lo dispara un webhook externo (o el
// panel admin) cuando cambia un precio/producto, para que /api/inventory
// refleje el cambio al instante sin esperar los 5 min del ISR.
//
// Llamada preferida:  POST /api/revalidate  con header  x-revalidate-token: …
// Compatibilidad:     POST /api/revalidate?token=…   (DEPRECADO, ver abajo)
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "crypto";

// Comparación en tiempo constante: un `!==` normal corta en el primer byte que
// difiere, así que el tiempo de respuesta filtra cuántos caracteres acertaste y
// permite adivinar el token byte a byte.
function tokenValido(recibido: string | null, esperado: string): boolean {
  if (!recibido) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  // timingSafeEqual exige buffers del mismo largo. Comparar el largo antes no
  // filtra nada útil: el secreto es el contenido, no cuánto mide.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const esperado = process.env.APPS_SCRIPT_TOKEN;
  if (!esperado) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const headerToken = request.headers.get("x-revalidate-token");
  const queryToken = new URL(request.url).searchParams.get("token");

  // El token en la query string queda escrito en los logs de acceso de Vercel,
  // en proxies intermedios y en el header Referer — por eso se prefiere el
  // header. Se sigue aceptando ?token= para no romper el webhook que ya está
  // configurado en producción (nada en este repo llama a esta ruta).
  // TODO: migrar ese webhook al header y borrar esta rama.
  if (!headerToken && queryToken) {
    console.warn(
      "[revalidate] token recibido por query string (deprecado): queda expuesto en logs. Migrar el webhook al header x-revalidate-token."
    );
  }

  if (!tokenValido(headerToken ?? queryToken, esperado)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  revalidateTag("inventory", "max"); // Next 16: 2º arg requerido (stale-while-revalidate)
  return NextResponse.json({ revalidated: true, tag: "inventory" });
}
