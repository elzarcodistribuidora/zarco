@AGENTS.md

# El Zarco — Web (Next.js / Vercel, backend en Supabase)

Distribuidora de abarrotes B2B. Es **un solo proyecto**: sitio público + portal
de clientes + panel admin, sobre **Next.js (App Router, TypeScript)** en
**Vercel**.

Historia en tres fases:
1. **Migración Webflow → Next** (jun 2026): reconstrucción fiel del sitio
   público como blobs de HTML/CSS/JS de Webflow (paridad primero); backend
   todavía en Google Apps Script.
2. **Migración del backend → Supabase** (dic 2026): Apps Script/Sheets
   reemplazado por **Supabase (Postgres + Auth)** + panel admin.
3. **Migración del sitio público a JSX + Tailwind** (jul 2026): las 15 páginas
   públicas dejaron de ser blobs de Webflow y pasaron a ser componentes React
   reales con una librería de componentes compartidos.

## Documentación

- [`docs/architecture.md`](docs/architecture.md) — estructura de carpetas, estado del pipeline legacy de Webflow.
- [`docs/marketing-site.md`](docs/marketing-site.md) — el sitio público: componentes compartidos, catálogo, delicatessen, decisiones de Tailwind.
- [`docs/backend-supabase.md`](docs/backend-supabase.md) — tablas, RLS, auth, rutas `/api/*`, ISR del catálogo.
- [`docs/admin.md`](docs/admin.md) — panel admin.
- [`docs/seo-perf.md`](docs/seo-perf.md) — SEO, sitemap, preloader, scroll.
- [`docs/env-vars.md`](docs/env-vars.md) — variables de entorno.
- [`docs/comandos.md`](docs/comandos.md) — comandos de desarrollo y build.
- [`docs/changelog.md`](docs/changelog.md) — mejoras ya hechas (histórico).
- [`docs/todo.md`](docs/todo.md) — pendientes / siguientes pasos.

@docs/architecture.md
@docs/marketing-site.md
@docs/backend-supabase.md
@docs/admin.md
@docs/seo-perf.md
@docs/env-vars.md
@docs/comandos.md
@docs/changelog.md
@docs/todo.md
