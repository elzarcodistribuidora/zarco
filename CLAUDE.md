@AGENTS.md

# El Zarco — Web (migración de Webflow → Next.js / Vercel)

Distribuidora de abarrotes B2B. El sitio estaba 100% en Webflow (con mucho
código custom embebido) y se migró a **Next.js (App Router, TypeScript)** para
desplegar en **Vercel**. Es **un solo proyecto**: sitio público + portal de
clientes.

Decisiones tomadas con el dueño (junio 2026):
- Framework: **Next.js** (mejor para el portal dinámico).
- Un solo proyecto (público + portal juntos).
- Prioridad: **"primero conectar todo como estaba (paridad), luego mejoras"**.

---

## Arquitectura

```
src/
├── app/
│   ├── layout.tsx                  Layout raíz neutro (sin CSS framework)
│   ├── globals.css                 Tailwind (solo lo usa el portal)
│   ├── (marketing)/                SITIO PÚBLICO (reconstrucción fiel de Webflow)
│   │   ├── layout.tsx              Carga Inter + webflow-shared.css + SmoothScroll
│   │   ├── [[...slug]]/page.tsx    Renderiza cada página desde src/webflow/<slug>.json
│   │   ├── PageScripts.tsx         Re-ejecuta los <script> inline de Webflow
│   │   ├── SmoothScroll.tsx        Lenis (scroll suave) en todo el público
│   │   └── marketing.css           CSS de Lenis
│   ├── portal/                     PORTAL DE CLIENTES (React + Tailwind)
│   │   ├── layout.tsx              Importa globals.css (Tailwind) + Inter
│   │   ├── page.tsx                Server Component: auth + fetch (sesión + catálogo)
│   │   ├── PortalShell.tsx         Cliente: estado del carrito, header, envío, repetir
│   │   ├── Catalog.tsx             Cliente: búsqueda, filtros, orden, paginación, añadir
│   │   ├── CartDrawer.tsx          Cliente: carrito lateral, cantidades, total, envío
│   │   ├── History.tsx             Cliente: historial + botón "Repetir pedido"
│   │   ├── actions.ts              Server Actions: sendOrder, saveCart, signOutAction
│   │   ├── format.ts               Helper de moneda MXN
│   │   └── login/page.tsx          "Entrar con Google" (Server Action signIn)
│   ├── api/auth/[...nextauth]/     Endpoint de Auth.js
├── proxy.ts                        Protege /portal (Next 16: middleware → proxy)
├── auth.ts                         Config Auth.js (Google)
├── lib/matriz.ts                   Conector al backend (Apps Script)
├── components/
│   ├── Preloader.tsx               Preloader logo + barra (catálogo y portal)
│   └── preloader.css
└── webflow/                        Datos generados: <slug>.json (css+body+js)
```

---

## Sitio público — cómo funciona la reconstrucción fiel

Webflow **no exporta ZIP** con el plan actual (solo acceso Editor), y el sitio
sigue publicado en `https://el-zarco.webflow.io`. En vez de rehacer el diseño,
se **reusa el HTML/CSS/JS de Webflow** y se sirve dentro de Next:

1. `scripts/mirror-webflow.mjs` (`npm run mirror`) descarga las 14 páginas y
   todos los assets (imágenes en atributos, `srcset`, `url()` de CSS inline y
   URLs hardcodeadas dentro de `<script>` — p.ej. fotos de productos de los
   carruseles). HTML → `webflow-export/`, assets → `public/assets/`.
2. `scripts/optimize-images.mjs` (`npm run optimize`) convierte todas las
   imágenes a **WebP** (con `sharp`, tope de ancho 2000px; el GIF → WebP
   animado) y **borra los originales**. Resultado: ~65MB → ~5.8MB (-92%).
3. `scripts/build-pages.mjs` (`npm run build:pages`):
   - Renombra los assets a nombres seguros (sin espacios/acentos/paréntesis).
   - Extrae de cada página: el **CSS inline**, el **body** y los **scripts**.
   - Reescribe todas las URLs del CDN de Webflow → `/assets/...` (self-hosted)
     y apunta a la versión **.webp** cuando existe.
   - Descarta: analytics (gtag), el motor viejo de `/perfil` (ocultaba el body
     y redirigía) y el **script puro de login viejo** (Google Identity Services
     + localStorage) — el login se unificó a Auth.js.
   - **Limpia el body**: quita los `<style>` (ya van en `css`, evita CSS
     duplicado) y la basura embebida por Webflow (un `<head>` con title/meta
     dentro del body + fragmentos `</body></html>`). Esto bajó el peso de los
     bodies ~49%.
   - Escribe `src/webflow/<slug>.json` = `{ slug, css, body, bodyClass, js, meta }`.
4. `[[...slug]]/page.tsx` lee ese JSON y lo renderiza (SSG, estático):
   - `<style>` con el CSS inline + `<div dangerouslySetInnerHTML>` con el body.
   - `PageScripts` reinyecta los `js` como `<script>` reales y dispara un
     `DOMContentLoaded` sintético (porque el HTML inyectado no ejecuta scripts,
     y los scripts originales envuelven su lógica en ese evento).

Detalles importantes:
- Las páginas usan **Inter** (Google Fonts) y `webflow-shared.css`. NO usan
  Tailwind (para que no choquen con el CSS de Webflow).
- Los links internos son `<a href>` normales → **recarga completa** entre
  páginas (no SPA). Por eso re-ejecutar scripts no causa redeclaraciones.
- Las flechas de los carruseles usan `onclick="scrollCarousel(...)"` global.
- **Login unificado:** el navbar ya no usa el login viejo (GIS + localStorage).
  `PageScripts.tsx` reemplaza los `.auth-trigger` para que manden a `/portal`
  (Auth.js) y quita los modales viejos (`#globalAuthModal`, `#globalProfileModal`).
- Algunas tarjetas (cremería, etc.) **no tienen imagen en el original** — eso
  es fiel, no es un bug.

### Para re-bajar el sitio si cambia en Webflow
```bash
npm run mirror && npm run optimize && npm run build:pages
```
(El orden importa: `optimize` debe correr antes de `build:pages` para que las
referencias apunten a `.webp`.)

---

## Portal de clientes y backend

**Hallazgo clave:** la "base de datos dinámica" del portal viejo ya es un
**Google Apps Script Web App** (sigue vivo) parado enfrente de Google Sheets
(`CRM CLIENTES` + `PEDIDOS WEB`). NO se migró (paridad primero). Endpoints:
- `?action=getInventory` → catálogo con `PRECIO FINAL`, código, categoría…
- `?action=getUserSession&email=` → `{ userData, history, savedCart }`
- `POST` JSON → guardar pedidos / carrito

`src/lib/matriz.ts` lo consume **desde el servidor** de Next (el email viene de
la sesión verificada, nunca del cliente). Esto **arregla un hueco de seguridad**
del portal viejo, que confiaba en `localStorage` (cualquiera podía leer pedidos
de cualquier email).

### Portal React (reconstruido, NO el cascarón de Webflow)

El portal viejo de Webflow (`/perfil`) tenía un motor JS de carrito/sesión que
dependía de `localStorage.zarcoUser` (el login viejo con Google Identity
Services). Al unificar a Auth.js ese login se quitó, así que el motor quedó roto
(creía que todos eran "Invitado"). Se decidió (junio 2026) **reconstruir todo el
portal en React/Tailwind**, desacoplado de Webflow:

- `portal/page.tsx` (Server Component): saca el email de la sesión, llama
  `getInventory()` + `getUserSession(email)` en paralelo y pasa los datos a
  `PortalShell`. Es `force-dynamic` (datos por cliente).
- `PortalShell.tsx` (cliente): dueño del estado del carrito (`Record<code,item>`).
  Header con perfil (nombre/estatus/id) + logout, tarjetas resumen, catálogo,
  historial, botón flotante y drawer. Sincroniza el carrito a la nube con
  `saveCart` (debounced 800ms).
- `Catalog.tsx`: búsqueda (nombre/código/marca), filtro por categoría y unidad,
  orden, paginación (24/pág) y añadir con cantidad. Mantiene `id="productBody"`.
- `CartDrawer.tsx`: cantidades, total, barra de envío gratis (umbral $3000), y
  el botón de enviar.
- `History.tsx`: tabla FOLIO/FECHA/TOTAL/ESTATUS + **"Repetir pedido"** (parsea
  el `resumen` `"2x Nombre (CODE)"` y rearma el carrito con precios actuales).
- `actions.ts` (Server Actions):
  - `sendOrder(items)` — **envío seguro**: identidad y email salen de la sesión
    (no del cliente), registra en la Matriz (`saveOrder`), vacía el carrito en
    la nube y devuelve `{ folio, waUrl }`. El cliente abre WhatsApp prellenado
    al número de la matriz (`522298477440`). **Checkout dual** (Sheets + WhatsApp),
    igual que el negocio operaba.
  - `saveCart(items)` — sincroniza el carrito (`syncCart`).
  - `signOutAction()` — cierra sesión → `/`.
- `login/page.tsx`: botón "Entrar con Google" vía Server Action (`signIn`).
- `/perfil` ahora **redirige a `/portal`** (308, en `next.config.ts`).

**Auth + seguridad:** Auth.js v5 (`next-auth@beta`) con Google. Reutiliza el
OAuth client existente (`655792493975-…apps.googleusercontent.com`).
**`src/proxy.ts`** (Next 16 renombró *middleware* → *proxy*) bloquea `/portal`
sin sesión usando el callback `authorized` de `auth.ts`.
- **Registro abierto:** cualquiera entra con su Google y queda como "Cliente
  Nuevo" en la Matriz (el objetivo es vender). El proxy solo exige sesión
  iniciada para `/portal`; no hay lista blanca de clientes. (Si en el futuro se
  quisiera restringir, se reañade un callback `signIn` que valide el email
  contra `CRM CLIENTES`.)
- **Token del Apps Script:** `lib/matriz.ts` manda `?token=APPS_SCRIPT_TOKEN`.
  El Apps Script debe validar ese token para `getUserSession` y los POST
  (datos sensibles por cliente). `getInventory` (catálogo/precios) queda
  abierto porque el catálogo lo carga el navegador. **Snippet a pegar en el
  Apps Script** (Editor → arriba de `doGet`/`doPost`):
  ```js
  const TOKEN = "EL-MISMO-VALOR-DE-APPS_SCRIPT_TOKEN";
  function requiereToken(e, action) {
    const protegido = action === "getUserSession" || !action; // POST = sin action
    if (protegido && e.parameter.token !== TOKEN) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: "No autorizado" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    return null;
  }
  // En doGet(e):  const bloqueo = requiereToken(e, e.parameter.action); if (bloqueo) return bloqueo;
  // En doPost(e): const bloqueo = requiereToken(e, null);              if (bloqueo) return bloqueo;
  ```
  Mientras `APPS_SCRIPT_TOKEN` esté vacío, no se manda token y todo funciona
  como antes (actívalo cuando pegues el snippet).

## SEO

- `build-pages.mjs` extrae del `<head>` de Webflow el `title`, `description` y
  `og:image` de cada página → campo `meta` en el JSON.
- `[[...slug]]/page.tsx` los aplica con `generateMetadata` (title, description,
  Open Graph, Twitter card, canonical). `metadataBase` sale de
  `NEXT_PUBLIC_SITE_URL`.
- `app/sitemap.ts` y `app/robots.ts` generan `sitemap.xml` (las 13 páginas
  públicas, sin `/perfil`) y `robots.txt` (bloquea `/portal` y `/api`).

---

## Preloader + scroll suave (UX)

- **Scroll suave (Lenis):** en TODO el sitio público (`SmoothScroll.tsx`).
- **Preloader** (`src/components/Preloader.tsx`): logo del Zarco + barra de
  progreso 0→100% sobre fondo azul marino de marca (`#0A2240`, barra roja
  `#A81200`). Aparece **solo en las páginas que cargan datos**:
  - **/catalogo** → `<Preloader waitForSelector="#productBody" />`: la barra
    espera a que la tabla de productos tenga filas antes de revelar, para que el
    cliente vea el catálogo ya cargado y no espere a que aparezca.
  - **/portal** → SSR instantáneo (los datos vienen del servidor antes de
    renderizar), así que **no usa preloader**.
  - Las páginas estáticas (home, nosotros, categorías…) **no llevan preloader**.
- Todo respeta `prefers-reduced-motion`.

---

## Variables de entorno (`.env.local`, ver `.env.example`)

- `AUTH_SECRET` — ya generado.
- `AUTH_GOOGLE_ID` — el OAuth client existente (ya puesto).
- `AUTH_GOOGLE_SECRET` — ✅ ya puesto (Google Cloud, mismo client).
- `APPS_SCRIPT_URL` — backend Apps Script (ya puesto, vivo).
- `APPS_SCRIPT_TOKEN` — token compartido para blindar el Apps Script (opcional
  hasta que pegues el snippet en el script).
- `NEXT_PUBLIC_SITE_URL` — URL pública del sitio (SEO/sitemap/OG).

> Estas variables también deben estar cargadas en **Vercel** (Project Settings →
> Environment Variables), y `NEXT_PUBLIC_SITE_URL` con el dominio real. Agrega el
> redirect URI de Google del dominio: `https://TU-DOMINIO/api/auth/callback/google`.

---

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run start        # servir el build
npm run mirror       # re-descargar el sitio de Webflow
npm run optimize     # convertir imágenes a WebP (corre ANTES de build:pages)
npm run build:pages  # regenerar src/webflow/*.json
```

---

## Pendientes / siguientes pasos

1. ✅ `AUTH_GOOGLE_SECRET` puesto (login del portal funcional).
2. ✅ Deploy a Vercel + dominio propio conectado.
3. Pegar el snippet del token en el Apps Script + poner `APPS_SCRIPT_TOKEN`
   (en `.env.local` y en Vercel) para activar el blindaje del endpoint sensible.
   Ahora que los POST de pedidos (`saveOrder`/`syncCart`) viajan por aquí, esto
   deja de ser opcional. (`getInventory` sigue abierto: lo lee el navegador.)
4. **Catálogo público (`/catalogo` de Webflow):** su motor de carrito viejo
   sigue ahí pero **roto** (depende del `localStorage.zarcoUser` eliminado). El
   carrito/pedidos reales ahora viven en `/portal`. Falta decidir: dejar
   `/catalogo` como vitrina pública (SEO) y mandar el "enviar pedido" a `/portal`,
   o redirigir `/catalogo` → `/portal`. No bloquea, pero su botón de enviar abre
   un modal muerto.
5. Mejora futura: migrar el Google Sheet a una DB real (Supabase/Postgres) sin
   tocar el front (el portal ya está desacoplado vía `lib/matriz.ts`).

## Estado de las mejoras post-migración

- ✅ Imágenes optimizadas (WebP, -92%).
- ✅ Seguridad del portal (registro abierto por Google + token del Apps Script).
- ✅ SEO por página (title/description/OG + sitemap + robots).
- ✅ Login unificado a Auth.js (se quitó el login viejo del navbar).
- ✅ **Portal de clientes reconstruido en React/Tailwind** (perfil, catálogo con
  carrito, historial, repetir pedido). Checkout dual (Sheets + WhatsApp) con
  envío **server-side** (email de la sesión). `/portal` protegido por `proxy.ts`.
- ✅ Body limpiado (-49%): se quitó CSS duplicado y basura embebida de Webflow.
- ⏳ Alt text de imágenes / nombres descriptivos: el alt importa más que el
  nombre de archivo; los `<img>` conservan el alt de Webflow. Renombrar los
  105 assets daría un beneficio marginal y riesgo de colisiones, así que no se
  hizo (los nombres ya incluyen hash único + descriptor).
- ⏳ Nav/footer en componentes React compartidos: el `<nav>` y el `<footer>`
  son byte-idénticos entre páginas, PERO el export de Webflow los intercala con
  basura por página (drawer móvil, floats de WhatsApp, meta embebido), así que
  una extracción automática es riesgosa. Recomendado hacerlo como **rebuild
  manual** de un `<SiteHeader>`/`<SiteFooter>` en React (path B), cuando se
  quiera invertir en ello — no bloquea nada.
