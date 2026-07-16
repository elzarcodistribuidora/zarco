# Variables de entorno (`.env.local`; también en Vercel)

- `NEXT_PUBLIC_SUPABASE_URL` — **sin** `/rest/v1/` ni diagonal final
  (`https://gekuyrjsehwsyorqyuxc.supabase.co`). Un sufijo mal puesto da el error
  "No API key found".
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/publishable key (se incrusta en el
  build → al cambiarla hay que **redeploy**).
- `SUPABASE_SERVICE_ROLE_KEY` — service-role (solo servidor; `/api/quote`, imports).
- `APPS_SCRIPT_TOKEN` — secreto del webhook `/api/revalidate`. Se manda
  preferentemente como header `x-revalidate-token`; `?token=` en la query
  sigue aceptado por compatibilidad pero queda expuesto en logs de acceso.
- `CORD_SECRET_KEY` — API de pago de Flouvia/Cord, usada por
  `/api/cord/create` (panel admin, `requireAdmin()`). Sin esto, ese botón
  responde 500.
- `NEXT_PUBLIC_SITE_URL` — URL pública (SEO/OG/sitemap).

(Se retiraron las envs legacy `AUTH_*` y `APPS_SCRIPT_URL` junto con Auth.js y
`lib/matriz.ts` — `.env.example` ya no las documenta. **Quítalas también en
Vercel** si siguen ahí: pendiente de confirmar, ver `docs/todo.md`.)
