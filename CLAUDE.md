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
│   ├── portal/                     PORTAL DE CLIENTES (Tailwind)
│   │   ├── layout.tsx              Importa globals.css (Tailwind) + fuente
│   │   ├── page.tsx                Dashboard: nivel, estatus, pedidos, catálogo
│   │   └── login/page.tsx          "Entrar con Google"
│   ├── api/auth/[...nextauth]/     Endpoint de Auth.js
│   └── middleware.ts               Protege /portal (sin sesión → login)
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

**Auth + seguridad:** Auth.js v5 (`next-auth@beta`) con Google. Reutiliza el
OAuth client existente (`655792493975-…apps.googleusercontent.com`).
`middleware.ts` bloquea `/portal` sin sesión.
- **Acceso solo para clientes registrados:** el callback `signIn` (en
  `auth.ts`) consulta la Matriz y rechaza el login si el email no existe en
  `CRM CLIENTES` (id `CLI-NUEVO`) → redirige a `/portal/login?error=NoAutorizado`.
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
  - **/portal** → `<Preloader />`: los datos vienen del servidor (SSR), así que
    solo cubre la entrada y revela todo listo.
  - Las páginas estáticas (home, nosotros, categorías…) **no llevan preloader**.
- Todo respeta `prefers-reduced-motion`.

---

## Variables de entorno (`.env.local`, ver `.env.example`)

- `AUTH_SECRET` — ya generado.
- `AUTH_GOOGLE_ID` — el OAuth client existente (ya puesto).
- `AUTH_GOOGLE_SECRET` — **PENDIENTE** (sacarlo de Google Cloud, mismo client).
- `APPS_SCRIPT_URL` — backend Apps Script (ya puesto, vivo).
- `APPS_SCRIPT_TOKEN` — token compartido para blindar el Apps Script (opcional
  hasta que pegues el snippet en el script).
- `NEXT_PUBLIC_SITE_URL` — URL pública del sitio (SEO/sitemap/OG).

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

1. `AUTH_GOOGLE_SECRET` para dejar el login del portal 100% funcional.
2. Pegar el snippet del token en el Apps Script + poner `APPS_SCRIPT_TOKEN`
   para activar el blindaje del endpoint sensible.
3. **Deploy a Vercel** (instalar `vercel` CLI) + conectar el dominio propio
   (y poner `NEXT_PUBLIC_SITE_URL` con el dominio real).
4. Mejora futura: migrar el Google Sheet a una DB real (Supabase/Postgres) sin
   tocar el front (el portal ya está desacoplado vía `lib/matriz.ts`).

## Estado de las mejoras post-migración

- ✅ Imágenes optimizadas (WebP, -92%).
- ✅ Seguridad del portal (solo clientes + token del Apps Script).
- ✅ SEO por página (title/description/OG + sitemap + robots).
- ✅ Login unificado a Auth.js (se quitó el login viejo del navbar).
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
