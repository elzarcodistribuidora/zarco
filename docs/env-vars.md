# Variables de entorno (`.env.local`; también en Vercel)

- `NEXT_PUBLIC_SUPABASE_URL` — **sin** `/rest/v1/` ni diagonal final
  (`https://gekuyrjsehwsyorqyuxc.supabase.co`). Un sufijo mal puesto da el error
  "No API key found".
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/publishable key (se incrusta en el
  build → al cambiarla hay que **redeploy**).
- `SUPABASE_SERVICE_ROLE_KEY` — service-role (solo servidor; `/api/quote`, imports).
- `APPS_SCRIPT_TOKEN` — ahora es el **secreto del webhook** `/api/revalidate`.
- `NEXT_PUBLIC_SITE_URL` — URL pública (SEO/OG/sitemap).

(Se retiraron las envs legacy `AUTH_*` y `APPS_SCRIPT_URL` junto con Auth.js y
`lib/matriz.ts`. **Quítalas también en Vercel** si siguen ahí.)
