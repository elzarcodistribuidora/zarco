// Refresco de sesión de Supabase para el Proxy (antes "middleware" en Next ≤15).
// Lee/renueva los tokens en cookies y protege las rutas privadas.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // IMPORTANTE: no metas código entre createServerClient y getUser()
  // (getUser valida el token contra Supabase y refresca la sesión).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Solo /admin exige sesión. /perfil y /catalogo solo refrescan la sesión
  // (son públicos: el invitado los ve con su prompt de login).
  if (path.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // El rol admin se valida además en el layout de /admin (defensa en profundidad).
  return response;
}
