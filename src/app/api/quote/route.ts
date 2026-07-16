// Captura de leads / cotizaciones del formulario de contacto — SIN login.
// Inserta con service-role (bypass RLS); solo el admin las lee en /admin/cotizaciones.
// Devuelve { status, folio } para que el form de contacto muestre el folio.
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { checkBotId } from "botid/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateFolio } from "@/lib/folio";

// Recorta para evitar abuso/spam con payloads enormes.
const clip = (v: unknown, max: number) =>
  String(v ?? "").trim().slice(0, max) || null;

export async function POST(request: Request) {
  // Único endpoint sin sesión que escribe con service-role → es el blanco
  // natural de spam. BotID filtra el envío automatizado; el volumétrico lo
  // cubren las reglas de rate limit del WAF (ver docs/backend-supabase.md).
  // Las rutas protegidas se declaran en src/instrumentation-client.ts: si esta
  // ruta cambia de path, hay que actualizarlo allá o el check falla siempre.
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json(
      { status: "Error", error: "Acceso denegado" },
      { status: 403 }
    );
  }

  let body: { negocio?: string; email?: string; resumen?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const negocio = clip(body.negocio, 200);
  const email = clip(body.email, 200);
  const mensaje = clip(body.resumen, 2000);

  // Necesitamos al menos algo de contenido para registrar el lead.
  if (!negocio && !mensaje) {
    return NextResponse.json({ status: "Error", error: "Datos insuficientes" }, { status: 400 });
  }

  const folio = generateFolio("COT");

  const db = createAdminClient();
  const { error } = await db
    .from("cotizaciones")
    .insert({ folio, negocio, email, mensaje });

  if (error) {
    return NextResponse.json({ status: "Error", error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "Success", folio });
}
