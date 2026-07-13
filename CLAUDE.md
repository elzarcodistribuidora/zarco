@AGENTS.md

# El Zarco — Web (Webflow → Next.js / Vercel, con backend en Supabase)

Distribuidora de abarrotes B2B. El sitio estaba 100% en Webflow (con mucho
código custom embebido) y se migró a **Next.js (App Router, TypeScript)** sobre
**Vercel**. Es **un solo proyecto**: sitio público + portal de clientes + panel
admin.

Historia en dos fases:
1. **Migración Webflow → Next** (jun 2026): reconstrucción fiel del sitio
   público; el backend seguía siendo un **Google Apps Script** sobre Google
   Sheets (paridad primero).
2. **Migración del backend → Supabase** (dic 2026): se reemplazó el Apps Script
   por **Supabase (Postgres + Auth)**, con **panel admin** para editar (ya no se
   usa Google Sheets). El Apps Script quedó **retirado** (nada lo llama).

---

## Arquitectura

```
src/
├── app/
│   ├── layout.tsx                  Layout raíz neutro (sin CSS framework)
│   ├── globals.css                 Tailwind (portal + admin)
│   ├── (marketing)/                SITIO PÚBLICO (reconstrucción fiel de Webflow)
│   │   ├── layout.tsx              Inter + webflow-shared.css + SmoothScroll
│   │   ├── [[...slug]]/page.tsx    Renderiza src/webflow/<slug>.json (incl. /perfil, /catalogo, /contacto)
│   │   ├── PageScripts.tsx         Re-ejecuta los <script> de Webflow + PUENTE con Supabase Auth
│   │   ├── SmoothScroll.tsx        Lenis (scroll suave)
│   │   └── marketing.css
│   ├── portal/
│   │   ├── layout.tsx              Tailwind + Inter
│   │   └── login/page.tsx          Login Google (popup); pantalla de respaldo
│   ├── admin/                      PANEL ADMIN (solo rol admin)
│   │   ├── layout.tsx              Guard de rol admin + nav
│   │   ├── actions.ts              Server Actions (editar producto/cliente/pedido/cotización)
│   │   ├── page.tsx                Dashboard (conteos)
│   │   └── productos/ clientes/ pedidos/ cotizaciones/   CRUD por tabla
│   ├── auth/
│   │   ├── callback/route.ts       Intercambia el código OAuth → sesión (cookies)
│   │   ├── signout/route.ts        Cierra sesión
│   │   └── done/page.tsx           Cierra el popup de login y avisa al opener
│   ├── api/
│   │   ├── inventory/route.ts      Catálogo desde Supabase (cacheado, tag "inventory")
│   │   ├── revalidate/route.ts     Webhook (token) → revalidateTag("inventory","max")
│   │   ├── me/route.ts             Identidad de la sesión (para el JS de Webflow)
│   │   ├── session/route.ts        userData + history + savedCart (RLS)
│   │   ├── order/route.ts          Guarda pedido (EXIGE login) → pedidos + pedido_items
│   │   ├── cart/route.ts           Carrito en la nube (savedCart)
│   │   └── quote/route.ts          Lead del form de contacto (SIN login, service-role)
│   ├── sitemap.ts robots.ts manifest.ts
├── proxy.ts                        Next 16 "middleware": refresca sesión Supabase + protege /admin
├── lib/
│   ├── supabase/server.ts          Cliente con cookies (Server Components / route handlers)
│   ├── supabase/client.ts          Cliente de navegador
│   ├── supabase/admin.ts           Cliente service-role (BYPASS RLS, solo servidor)
│   ├── supabase/middleware.ts      updateSession() para el proxy
│   ├── supabase/types.ts           Tipos generados del esquema
│   └── db.ts                       getInventory() (Supabase, unstable_cache tag "inventory")
├── components/Preloader.tsx        Preloader logo + barra (solo /catalogo)
└── webflow/<slug>.json             Datos generados (css + body + js + meta)
scripts/
├── mirror-webflow.mjs              npm run mirror   (baja el sitio de Webflow)
├── optimize-images.mjs             npm run optimize (imágenes → WebP)
├── build-pages.mjs                 npm run build:pages (genera src/webflow/*.json)
└── import-to-supabase.mjs          Importó los productos una vez (dev tool)
```

`.mcp.json` conecta el **MCP de Supabase** (proyecto `gekuyrjsehwsyorqyuxc`) para
correr migraciones/SQL desde el editor.

---

## Sitio público — reconstrucción fiel de Webflow

Webflow **no exporta ZIP** (solo acceso Editor) y el sitio sigue publicado en
`https://el-zarco.webflow.io`. En vez de rehacer el diseño, se **reusa el
HTML/CSS/JS de Webflow** dentro de Next:

1. `mirror-webflow.mjs` (`npm run mirror`) baja las 14 páginas + assets
   (imágenes en atributos, `srcset`, `url()` de CSS y URLs hardcodeadas en
   `<script>`). HTML → `webflow-export/`, assets → `public/assets/`.
2. `optimize-images.mjs` (`npm run optimize`) → todo a **WebP** (sharp, tope
   2000px; GIF → WebP animado) y borra originales (~65MB → ~5.8MB, -92%).
3. `build-pages.mjs` (`npm run build:pages`):
   - Renombra assets a nombres seguros y reescribe URLs del CDN de Webflow →
     `/assets/...` (.webp cuando existe).
   - Extrae de cada página el **CSS inline**, el **body** y los **scripts**.
   - **`rewriteApi`** — repunta el JS de Webflow del backend viejo a las rutas
     Next (Supabase): `getInventory`→`/api/inventory`, `getUserSession`→
     `/api/session`, `saveOrder`→`/api/order`, `syncCart`→`/api/cart`; y
     **desactiva el login GIS viejo** (`setTimeout(initGoogleAuthGlobal,500)`→
     `void 0`). En **`contacto`** el pedido va a `/api/quote` (lead sin login).
   - Limpia el body (quita `<style>` duplicados + basura embebida de Webflow).
   - Escribe `src/webflow/<slug>.json` = `{ slug, css, body, bodyClass, js, meta }`.
4. `[[...slug]]/page.tsx` lo renderiza (SSG): `<style>` + `dangerouslySetInnerHTML`
   del body + `<PageScripts>`.

Detalles:
- Páginas usan **Inter** + `webflow-shared.css` (NO Tailwind, para no chocar).
- Links internos = `<a href>` normales → **recarga completa** entre páginas.
- Carruseles: `onclick="scrollCarousel(...)"` global.

### Para re-bajar el sitio si cambia en Webflow
```bash
npm run mirror && npm run optimize && npm run build:pages
```
(El orden importa: `optimize` antes de `build:pages` para apuntar a `.webp`.)

---

## Backend: Supabase (Postgres + Auth)

El portal viejo de Webflow corría client-side contra un **Google Apps Script**
sobre Sheets, con login **Google Identity Services + localStorage** (inseguro:
cualquiera leía pedidos de cualquier email). Se migró a Supabase.

### Tablas (esquema `public`, todas con RLS)
- `productos` — `codigo` (PK), `nombre_web`, `marca`, `categoria`,
  `unidad_medida`, `precio_final`, `web` (activo para web).
- `clientes` — `id`, `auth_user_id` (→ `auth.users`), `email`, `nombre`,
  `estatus`, `nivel`, `role` (`cliente`|`admin`).
- `pedidos` — `folio`, `cliente_id`, `email`, `fecha`, `total`, `status`,
  `resumen`. `pedido_items` — líneas (`codigo`, `nombre`, `precio`, `cantidad`).
- `carritos` — `cliente_id` (PK), `items` jsonb (savedCart en la nube).
- `cotizaciones` — leads del form de contacto (`folio`, `negocio`, `email`,
  `mensaje`, `atendido`).

### Seguridad (RLS)
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

### Auth (Supabase, Google)
- `@supabase/ssr` con sesión en cookies. `lib/supabase/{server,client,admin}.ts`.
- **Login = popup de Google** (`signInWithOAuth` con `skipBrowserRedirect` +
  `window.open`). El callback (`/auth/callback`) intercambia el código; en modo
  popup manda a `/auth/done`, que avisa al opener y cierra la ventana.
- `proxy.ts` (Next 16 renombró *middleware* → **proxy**) refresca la sesión y
  **solo protege `/admin`**. `/perfil` y `/catalogo` son públicos (el invitado
  ve su prompt de login).
- **Requisito de config (Supabase Dashboard → Auth → URL Configuration):**
  Site URL = dominio prod; Redirect URLs = `https://DOMINIO/**` y
  `http://localhost:3000/**`. En Google Cloud: JS origins (localhost + supabase
  + dominio) y redirect URI `https://gekuyrjsehwsyorqyuxc.supabase.co/auth/v1/callback`.

### El "puente" (catálogo/perfil/contacto siguen siendo páginas Webflow)
No se reconstruyeron en React: su JS se repunta (build-pages) a las rutas Next
y `PageScripts.tsx` hace de puente:
- Antes de correr los scripts, consulta `/api/me` y siembra
  `localStorage.zarcoUser` (lo que el JS de Webflow espera) si hay sesión.
- El navbar (`.auth-trigger`, p.ej. `#desktopUserBtn`): **sin sesión** abre el
  popup de Google directo; **con sesión** abre un menú flotante (Ir a perfil /
  Cerrar sesión). El login GIS viejo quedó inerte.
- En `/perfil`, si el usuario es admin, inyecta un botón flotante **"⚙ Panel
  admin"** (abajo a la izquierda) → `/admin`.
- Las rutas `/api/*` leen el email de la **sesión verificada** (RLS), nunca del
  cliente → cierra el hueco de seguridad viejo. `/api/order` exige login;
  `/api/quote` (leads de prospectos) no.

### Catálogo cacheado + revalidación on-demand (ISR)
- `lib/db.ts` `getInventory()` lee `productos` (web=true) con `unstable_cache`
  (tag `inventory`, revalida 5 min) en la forma que espera el JS del catálogo.
- `/api/revalidate` (POST con `?token=APPS_SCRIPT_TOKEN`) llama
  `revalidateTag("inventory","max")` → el catálogo refleja cambios al instante.
  El panel admin lo dispara solo al editar un producto.

> Nota Next 16: `revalidateTag` requiere 2 args; `cookies()` es async; `use
> cache`/`cacheComponents` NO está activado (se usa `unstable_cache`).

---

## Panel admin (`/admin`)

Reemplaza la edición en Google Sheets. Doble barrera: el `layout.tsx` exige
`role=admin` y las RLS lo exigen otra vez. Los writes usan **la sesión del
admin** (no service-role). Vistas: dashboard (conteos), productos (precio/web/
nombre/categoría, con búsqueda), clientes (estatus/nivel/role), pedidos
(status), cotizaciones (leads, marcar atendido). Al editar un producto se
revalida el catálogo público.

---

## SEO

- `build-pages.mjs` extrae `title`/`description`/`og:image` del `<head>` →
  `meta`; `[[...slug]]/page.tsx` los aplica con `generateMetadata`.
  `metadataBase` ← `NEXT_PUBLIC_SITE_URL`.
- `app/sitemap.ts` (páginas públicas, excluye `/perfil`) y `app/robots.ts`
  (disallow `/portal`, `/api`). `/admin` y `/portal` además llevan `noindex` por
  metadata en sus layouts.

## Preloader + scroll suave

- Lenis (scroll suave) en todo el público (`SmoothScroll.tsx`).
- Preloader (logo + barra `#0A2240`/`#A81200`) **solo en `/catalogo`**
  (`waitForSelector="#productBody"`, espera a que cargue la tabla). Respeta
  `prefers-reduced-motion`.

---

## Variables de entorno (`.env.local`; también en Vercel)

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

---

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run start        # servir el build
npm run mirror       # re-descargar el sitio de Webflow
npm run optimize     # imágenes → WebP (ANTES de build:pages)
npm run build:pages  # regenerar src/webflow/*.json (aplica rewriteApi)
```

---

## Pendientes / siguientes pasos

1. **Apps Script:** ya nada lo llama; dejarlo sin publicar ~2 semanas como red
   de seguridad y luego borrarlo. El Google Sheet ya no es necesario.
2. Confirmar en producción el flujo logueado completo (login popup → /perfil →
   pedido → admin lo ve) y las Redirect URLs de Supabase. Quitar las envs
   `AUTH_*` / `APPS_SCRIPT_URL` también en Vercel.

## Mejoras ya hechas

- ✅ Imágenes WebP (-92%).
- ✅ Backend en **Supabase** (Postgres + Auth + RLS), Apps Script retirado.
- ✅ **Panel admin** (CRUD completo: visualización, edición y **creación** de productos; gestión de clientes/pedidos/cotizaciones) — reemplaza el Sheet.
- ✅ Seguridad real por fila (RLS): cada cliente solo ve lo suyo.
- ✅ Login con Google (popup) + menú de perfil flotante (sin pantalla azul).
- ✅ Captura de **leads** de prospectos (form de contacto → `/api/quote`).
- ✅ Catálogo cacheado (ISR) + revalidación on-demand al editar precios.
- ✅ SEO por página + sitemap + robots.
- ✅ **Rediseño Premium en Delicatessen**: Animación nativa en navbar, sección de charolas compacta y de lujo con **ilustraciones SVG a todo color**.
- ✅ **Banners WebP y Multi-Slider**: Conversión de todos los nuevos banners (escritorio y móvil) a formato WebP, inyección del motor de carrusel (slider) en Delicatessen, y sincronización cruzada de banners promocionales con la página de inicio.
- ✅ **Banner promocional en Home**: Inyección de banner adaptativo (escritorio/móvil) en la página principal, vinculado dinámicamente a la sección de charolas en Delicatessen, posicionado estratégicamente entre familias y líderes.
- ✅ **Fix de Navbars (Móvil y Transiciones)**: Se reestructuró `DelicatessenNavbar` para que sea idéntica en estructura y funcionalidad a la navbar normal en móvil (incluyendo el módulo de autenticación). Se solucionó un bug severo en `PageScripts.tsx` que acumulaba listeners de `DOMContentLoaded` en cada transición de ruta en Next.js, lo que impedía que el menú hamburguesa funcionara al cambiar de página.
