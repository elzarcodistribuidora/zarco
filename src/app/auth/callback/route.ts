// Callback de OAuth: Google → Supabase → aquí. Intercambia el código por la
// sesión (cookies) y manda al destino (?next=) o al portal.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/perfil";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/perfil"}`);
    }
  }

  return NextResponse.redirect(`${origin}/portal/login?error=auth`);
}
