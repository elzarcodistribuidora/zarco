# Backend: Supabase (Postgres + Auth)

El portal viejo de Webflow corría client-side contra un **Google Apps Script**
sobre Sheets, con login **Google Identity Services + localStorage** (inseguro:
cualquiera leía pedidos de cualquier email). Se migró a Supabase.

## Tablas (esquema `public`, todas con RLS)
- `productos` — `codigo` (PK), `nombre_web`, `marca`, `categoria`,
  `unidad_medida`, `precio_final`, `web` (activo para web).
- `clientes` — `id`, `auth_user_id` (→ `auth.users`), `email`, `nombre`,
  `estatus`, `nivel`, `role` (`cliente`|`admin`).
- `pedidos` — `folio`, `cliente_id`, `email`, `fecha`, `total`, `status`,
  `resumen`. `pedido_items` — líneas (`codigo`, `nombre`, `precio`, `cantidad`).
- `carritos` — `cliente_id` (PK), `items` jsonb (savedCart en la nube).
- `cotizaciones` — leads del form de contacto (`folio`, `negocio`, `email`,
  `mensaje`, `atendido`).
- `recomendaciones` — cross-sell/upsell precalculado del catálogo (`codigo`,
  `rec_codigo`, `tipo`, `rank`). Ver `npm run build:recs`.

## Seguridad (RLS)
- Helpers en esquema **`private`** (NO expuesto por la API):
  `private.is_admin()`, `private.current_cliente_id()`, `private.es_email_admin()`.
- `productos`: lectura pública; escritura solo admin.
- `clientes`/`pedidos`/`pedido_items`/`carritos`: cada quien ve lo suyo; admin
  ve todo.
- `cotizaciones`: solo admin lee; las inserta el server con **service-role**.
- **Trigger `handle_new_user`**: al entrar con Google crea/enlaza el cliente
  (REGISTRO ABIERTO → "Cliente Nuevo"); si el email está en
  `private.es_email_admin()` queda `role=admin`.
- **Admins (por email):** `andrevalleo13@gmail.com` (dev) y
  `elzarcomayoreo@gmail.com` (negocio). Editar la lista en `private.es_email_admin()`.
- **`requireAdmin()` para route handlers** (`src/lib/supabase/require-admin.ts`,
  jul 2026): `proxy.ts` (ver Auth abajo) solo protege rutas que empiezan con
  `/admin` — las de `/api/*` NO pasan por ahí, así que cada route handler que
  debe ser solo-admin (`admin/export`, `admin/sync-prices`, `cord/create`)
  tiene que llamar a este guard por su cuenta (verifica sesión + `role=admin`
  contra `clientes`, igual que hace `layout.tsx` para las páginas de
  `/admin`). Antes de esto, `sync-prices` solo comprobaba que hubiera sesión
  (no que fuera admin) y `cord/create` no comprobaba nada — cualquier cliente
  logueado podía sobrescribir precios de todo el catálogo, y cualquiera en
  internet podía generar cotizaciones ilimitadas contra la API de pago de
  Flouvia (`CORD_SECRET_KEY`). Los Server Actions de `admin/actions.ts` usan
  su propio `requireAdmin()` basado en `throw` (conviene el flujo de
  excepciones + `ActionState`), no este helper.

## Auth (Supabase, Google)
- `@supabase/ssr` con sesión en cookies. `lib/supabase/{server,client,admin}.ts`.
- **Login = popup de Google** (`signInWithOAuth` con `skipBrowserRedirect` +
  `window.open`). El callback (`/auth/callback`) intercambia el código; en modo
  popup manda a `/auth/done`, que avisa al opener y cierra la ventana.
  Implementado hoy en `src/components/marketing/useZarcoAuth.ts` (hook de
  React) para todas las páginas ya migradas, y en `PageScripts.tsx` para
  `/perfil` (todavía legacy).
- `proxy.ts` (Next 16 renombró *middleware* → **proxy**) refresca la sesión y
  **solo protege `/admin`**. `/perfil` y `/catalogo` son públicos (el invitado
  ve su prompt de login).
- **`/portal/login`** (`src/app/portal/login/page.tsx`, jul 2026): pantalla de
  login rediseñada como split screen — panel izquierdo navy (`1fr`, oculto en
  móvil) con el logo real de El Zarco, degradado + resplandores decorativos y
  tagline editorial, separado del panel derecho blanco (`2fr`, el botón
  "Entrar con Google", sin tarjeta) por una línea roja Zarco (`border-r-4
  border-[#A81200]`). Solo cambió el layout visual — el flujo de popup de
  Google (`signInWithGoogle`) no se tocó.
- **Requisito de config (Supabase Dashboard → Auth → URL Configuration):**
  Site URL = dominio prod; Redirect URLs = `https://DOMINIO/**` y
  `http://localhost:3000/**`. En Google Cloud: JS origins (localhost + supabase
  + dominio) y redirect URI `https://gekuyrjsehwsyorqyuxc.supabase.co/auth/v1/callback`.

## Rutas `/api/*`
- `inventory/route.ts` — Catálogo desde Supabase (cacheado, tag "inventory").
- `revalidate/route.ts` — Webhook (token) → `revalidateTag("inventory","max")`.
- `me/route.ts` — Identidad de la sesión (la consume `useZarcoAuth`/navbar).
- `session/route.ts` — `userData` + `history` + `savedCart` (RLS).
- `portal/route.ts` — Datos del dashboard de `/perfil` en un solo round-trip
  (identidad + KPIs + producto estrella + historial con items + carrito
  guardado); cliente sale de la sesión, nunca del body.
- `order/route.ts` — Guarda pedido (EXIGE login) → `pedidos` + `pedido_items`.
  El **total lo cotiza el servidor** contra `productos.precio_final` (snapshot
  al momento del pedido) — el cliente manda `items` (código/nombre/cantidad,
  acotado a `MAX_ITEMS`/`MAX_CANTIDAD`), nunca el total ni el precio; antes se
  guardaba `body.total` tal cual, así que cualquiera podía mandar un pedido de
  $0.01 con el carrito lleno. `resumen` (texto libre, va al CSV de
  `admin/export` y al panel) se acota a 5000 caracteres.
- `cart/route.ts` — Carrito en la nube (`savedCart`).
- `quote/route.ts` — Lead del form de contacto (SIN login, service-role).
- `admin/sync-prices/route.ts` — Actualización masiva de precios desde el CSV
  del panel (`UploadPricesCSV.tsx`). Requiere `requireAdmin()`; valida cada
  fila (código no vacío, precio finito ≥ 0) antes de escribir, detecta updates
  que no afectaron ninguna fila (código inexistente) vía `.select()` en vez de
  asumir éxito, y revalida `"inventory"` si algo se escribió.
- `admin/export/route.ts` — Export a CSV (productos/clientes/pedidos/etc.)
  desde el panel. Requiere `requireAdmin()`; escapa celdas que empiezan con
  `=`/`+`/`-`/`@` (inyección de fórmulas de Excel/Sheets — varias columnas son
  texto libre del usuario, ej. `pedidos.resumen`).
- `cord/create/route.ts` — Genera una cotización con Flouvia (Cord) desde el
  panel. Requiere `requireAdmin()` (gasta `CORD_SECRET_KEY` contra una API de
  pago de terceros).

Todas leen el email de la **sesión verificada** (cookies/RLS), nunca del
body/cliente → cierra el hueco de seguridad que tenía el Apps Script viejo.

## Catálogo cacheado + revalidación on-demand (ISR)
- `lib/db.ts` `getInventory()` lee `productos` (web=true) con `unstable_cache`
  (tag `inventory`, revalida 5 min), más las recomendaciones precalculadas
  (`recs_comp`/`recs_sim`) que consume `CatalogRecs.tsx`.
- `/api/revalidate` (POST con `?token=APPS_SCRIPT_TOKEN`) llama
  `revalidateTag("inventory","max")` → el catálogo refleja cambios al instante.
  El panel admin lo dispara solo al editar un producto.

> Nota Next 16: `revalidateTag` requiere 2 args; `cookies()` es async; `use
> cache`/`cacheComponents` NO está activado (se usa `unstable_cache`).
