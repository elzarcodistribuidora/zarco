# Sitio público — de blobs de Webflow a JSX + Tailwind

## Historia

Webflow **no exporta ZIP** (solo acceso Editor), así que la primera migración
(jun 2026) "clonó" el sitio: cada página se bajaba como HTML/CSS/JS crudo y se
guardaba en `src/webflow/<slug>.json` (`{ slug, css, body, bodyClass, js, meta }`),
renderizado por un catch-all `[[...slug]]/page.tsx` con `dangerouslySetInnerHTML`
+ re-inyección de los `<script>` originales (`PageScripts.tsx`). Esto priorizó
paridad visual rápida, pero tenía un costo alto: no había JSX (imposible editar
un botón sin tocar un string de HTML dentro de JSON), y cada ajuste puntual
terminaba como un script de Node de un solo uso que hacía *regex* sobre el JSON.

**(jul 2026): migración completa a JSX + Tailwind real.** Las 15 páginas
públicas se reescribieron como componentes React de verdad, reusando una
librería de componentes compartidos. El catch-all `[[...slug]]/page.tsx`
**se eliminó** — cada página es su propia carpeta/ruta. `src/webflow/` y todo
el pipeline (`mirror`/`optimize`/`build:pages`) ya no existen, y tampoco queda
nada de HTML/CSS crudo de Webflow en ningún componente (ver
`docs/architecture.md`) — lo único que sigue siendo global a propósito es
`marketing.css` (Lenis + transición entre páginas).

## Por qué Tailwind sin preflight

`src/app/(marketing)/marketing-tailwind.css` importa **solo las utilidades**
de Tailwind (`tailwindcss/theme.css` + `tailwindcss/utilities.css`), sin el
preflight (reset). Esto se decidió cuando todavía quedaban páginas Webflow
crudas en el sitio, para que el reset global de Tailwind no les rompiera el
CSS. Ahora que las 15 páginas ya son JSX, ese riesgo ya no existe, pero no se
volvió a importar el preflight completo — en su lugar se agregaron resets
puntuales según hicieron falta:

```css
a { text-decoration: none; color: inherit; }   /* el navegador subraya <a> por defecto */
button { appearance: none; border: 0; background: none; padding: 0; ... }  /* botones nativos */
```

Si aparecen más elementos con estilos nativos del navegador (inputs, selects,
etc.), el patrón es agregar el reset puntual aquí, no reactivar el preflight
completo.

También hay tokens de marca en el `@theme inline` de ese archivo:
`brand-navy`, `brand-navy-light`, `brand-red`, `brand-red-dark`, `brand-green`
(los mismos hex que usaba el CSS de Webflow: `#0A2240`, `#16365C`, `#A81200`,
`#7A0A00`, `#25D366`).

## Componentes compartidos (`src/components/marketing/`)

- **`Navbar.tsx`** — navbar completo (desktop + drawer móvil + dropdown de
  productos). Se esconde al bajar scroll y reaparece encogido al subir hasta
  llegar arriba del todo (`hidden`/`scrolled` en `useState`), y mide su propia
  altura real con `ResizeObserver`, publicándola como variable CSS
  `--navbar-h` — así cada página compensa el espacio exacto
  (`pt-[var(--navbar-h)]`) sin adivinar píxeles. El dropdown de "Productos" se
  posiciona `absolute` contra la barra inferior del navbar (que es `relative`
  y full-width) — **importante**: ningún elemento intermedio entre el
  dropdown y esa barra debe tener su propio `relative`, o el dropdown se
  centra mal. `DelicatessenNavbar.tsx` es una copia recoloreada de este mismo
  componente (gris oxford + rojo), no un navbar aparte.
- **`Footer.tsx`** — footer compartido (columnas de links, contacto, WhatsApp
  flotante). `DelicatessenFooter.tsx` es la misma copia recoloreada. La barra
  inferior tiene 2 filas (jul 2026): copyright + "Powered by Flouvia" en la
  fila principal, y "Términos de Servicio"/"Aviso de Privacidad" en una fila
  propia debajo, centrados y en texto más chico (antes vivían pegados al
  copyright a la izquierda).
- **`WhatsappCTA.tsx`** — banner de cierre delgado y full-width que va
  siempre pegado justo arriba del `Footer` (pregunta a la izquierda, botón
  pill con flecha en círculo a la derecha, enlaza a `/contacto`). Variantes
  de color: `navy` (resto del sitio, acento rojo) y `red` (Delicatessen,
  acento gris).
- **`AuthMenu.tsx`** (`DesktopAuthTrigger`, `MobileAuthBlock`) + `useZarcoAuth.ts`
  — sesión del sitio público. Mismo flujo de popup de Google que ya usaba
  `PageScripts.tsx` (`signInWithOAuth` + `skipBrowserRedirect` + `window.open`),
  pero como hook de React (`useState`) en vez de manipulación directa del DOM.
- **`Reveal.tsx`** — reemplaza el `IntersectionObserver` + clase `.reveal` de
  los scripts inline de Webflow; fade + slide-up la primera vez que el
  elemento entra en pantalla.
- **`SectorPage.tsx`** + **`ProductCarousel.tsx`** — template compartido para
  las 6 páginas de sector/categoría (`cremeria`, `embutidos`,
  `abarrotes-basicos`, `cafeterias`, `restaurantes`, `tiendas`): hero banner
  a todo el ancho, subnav de anclas como **píldora flotante** (cápsula blanca
  con sombra, sección activa en rojo Zarco sólido), N carruseles de
  productos (datos **hardcodeados**, no vienen del catálogo real — así
  estaban en el Webflow original) que se extienden a todo lo ancho de la
  pantalla (solo el título/flechas quedan en el contenedor de `90%`), sección
  de beneficios editorial (número grande `01/02/03` en rojo tenue de fondo,
  sin íconos SVG) y `WhatsappCTA`. Fondo blanco puro. Cada página solo aporta
  sus datos (`hero`, `subnavLinks`, `carousels`, `benefits`, `cta`).
- **`HeroSlider.tsx`** — slider de banners con autoplay + flechas + dots
  (usado en Home, Delicatessen).
- **`Marquee.tsx`** — carrusel infinito de logos de marcas (Home, Nosotros).
- **`GuideAccordion.tsx`** — lista editorial de artículos (`/guias-de-negocio`),
  **sin tarjetas**: separador superior + línea entre filas, número grande como
  índice (navy/rojo sólido al abrir, nunca en opacidad baja — feedback
  explícito del usuario), categoría + título, toggle circular `+`/`×`. Entrada
  escalonada con GSAP (`useGSAP` + `ScrollTrigger`, ver más abajo). Los CTA de
  cada guía (`<a class="zarco-action-link">`, embebidos en `contentHtml`) se
  interceptan por delegación de eventos: registran un lead en `/api/quote`
  (aparece en `/admin/cotizaciones` igual que el form de `/contacto`) y abren
  WhatsApp con un mensaje personalizado con el título de la guía, en vez de
  mandar directo a `wa.me` sin registro ni contexto.
- **`FaqAccordion.tsx`** — acordeón de preguntas frecuentes (`/nosotros`):
  número en badge circular (tinte rojo → rojo sólido al abrir), pregunta en
  negrita navy, toggle `+`/`×`, sombra/borde con tinte rojo solo en el item
  abierto. Entrada escalonada con GSAP al hacer scroll.
- **`ContactForm.tsx`** — formulario de `/contacto`: arma el mismo request a
  `/api/quote` que antes hacía el script inline, y abre WhatsApp con el
  resumen (mismo contrato de negocio, sin cambios funcionales pese al
  rediseño). Inputs con ícono inline + foco en rojo Zarco (anillo +
  borde), selector de zona de entrega como `<select>` nativo restilizado
  (ícono de pin + chevron custom — se probó como grupo de píldoras
  seleccionables pero el usuario prefirió el dropdown de siempre). Validación
  **custom** en vez de la nativa del navegador: `noValidate` en el `<form>` +
  estado `errors` que pinta borde rojo y un mensaje propio bajo el campo — el
  tooltip nativo de "Completa este campo" se montaba encima del `<label>` y se
  veía mal. Entrada escalonada con GSAP.
- **`LegalPage.tsx`** — layout compartido de `/aviso-de-privacidad` y
  `/terminos-del-servicio`: hero (sin badge/pill, se quitó jul 2026) + sidebar
  de anclas genuinamente `sticky` (`lg:self-start`, sin envolver en `Reveal`
  para no romper el `position: sticky`, mismo issue que `/guias-de-negocio`)
  + secciones editoriales sin tarjetas — número grande `01/02/03` en rojo
  tenue de fondo, separador fino (`border-t`) entre secciones en vez de caja
  con borde/sombra, `scroll-mt` en cada `id` para que el anchor scroll no
  quede tapado por el navbar fijo. `LegalSection` ya no tiene campo `icon`
  (se quitaron los SVG genéricos de ambas páginas). Los items de cada sección
  son una lista con guion rojo (`—`) en vez de check verde sobre caja gris.
- **`catalog/`** — el motor del catálogo (`/catalogo`), ver más abajo.

## El catálogo (`/catalogo`)

Es la página con más lógica funcional real: búsqueda, orden, filtro por
categoría/unidad, paginación (25 por página), carrito con cantidades,
sincronización en la nube y checkout por WhatsApp. Se reescribió completa en
React manteniendo el mismo contrato de negocio que el script original.

### Rediseño visual "estilo Zarco" (jul 2026)

El catálogo funcionaba bien pero se veía genérico (tabla plana, filtros en
cajas simples, sin el lenguaje visual navy/rojo del resto del sitio). Se
rediseñó por partes, todo dentro de `CatalogApp.tsx`:

- **Barra de filtros**: tarjeta blanca (`rounded-[28px]`) con el buscador en
  su propio campo redondeado, los selects de orden/unidad con caption y
  punto rojo encima (mismo patrón que un formulario editorial), y las
  píldoras de categoría con la activa en navy sólido — se probó primero una
  versión con la tarjeta completa en degradado navy oscuro (más "wow" pero
  el usuario prefirió volver a la base blanca y pulirla desde ahí en vez de
  quedarse con el navy).
- **Tabla**: header en navy sólido (antes gris claro), badges de categoría a
  color por tipo de producto (`categoryBadgeClass()` — azul lácteos, rojo
  embutidos, verde abarrotes, ámbar gourmet), precio en rojo Zarco bold
  (antes navy), fila resaltada en verde al agregar (antes rojo tenue — verde
  comunica mejor "ya está en tu pedido").
- **Carrito**: header del drawer con degradado navy + resplandor rojo
  decorativo, stepper de cantidad en píldora, botón flotante con badge de
  cantidad y total.
- **Bug real encontrado y corregido**: el botón flotante del carrito
  (`right-5 bottom-5`) quedaba **tapado** por el botón flotante de WhatsApp
  del `Footer.tsx` (misma esquina, `z-[9999]`) — el usuario reportaba que "el
  carrito no aparece" cuando en realidad estaba ahí pero era imposible darle
  clic. Se probó subirlo (`bottom-24`/`sm:bottom-28`), pero la solución final
  (jul 2026) fue **centrarlo abajo** (`bottom-5 left-1/2 -translate-x-1/2`,
  `z-[10000]`) y **ocultar el botón de WhatsApp del footer solo en
  `/catalogo`** (`Footer.tsx` ahora es `"use client"` y usa `usePathname()`
  para no renderizarlo ahí — esa página ya tiene su propio flotante de
  carrito en la misma zona). Si se agrega otro botón flotante a `/catalogo`
  en el futuro, revisar contra el `z-[10000]` del carrito.
- **Bug real encontrado y corregido (jul 2026)**: el cross-sell "Completa tu
  pedido" (`CatalogRecs.tsx`, ver más abajo) dejó de aparecer tras la
  migración a JSX — `renderCrossSell()` busca `document.getElementById("cartDrawer")`
  y al `<aside>` del drawer en `CatalogApp.tsx` le faltaba `id="cartDrawer"`
  (nunca se migró ese id desde el HTML crudo de Webflow). Se agregó el id de
  vuelta. También se quitó la barra "Te faltan $X para envío sin costo" del
  drawer (y la constante `FREE_SHIPPING_THRESHOLD`, que quedó sin uso) por
  pedido del usuario.

- **`catalog/CatalogApp.tsx`** — UI completa (tabla, filtros, drawer del
  carrito, toasts).
- **`catalog/useCatalogCart.ts`** — carrito: persiste en
  `localStorage.zarcoCartObjects` (mismo formato que usaba el JS viejo) y
  sincroniza con `/api/cart` cuando hay sesión. Al iniciar sesión con el
  carrito local vacío, trae el carrito guardado desde `/api/session`.
  Expone `window.zarcoCatalog.add(id, name, price, qty)` como puente para que
  **`CatalogRecs.tsx`** (cross-sell/upsell, en `src/app/(marketing)/CatalogRecs.tsx`)
  siga funcionando — ese componente manipula el DOM directamente y depende de
  esa función global + de los ids `cartDrawer`/`cartItemsList`/`.cart-footer`,
  que `CatalogApp.tsx` conserva a propósito. Cada tarjeta de recomendación
  (`.zr-card`) es clickeable completa (no solo el botón) y marca un badge de
  palomita al agregarse.
- Checkout: arma el mensaje de WhatsApp, hace `POST /api/order` (requiere
  sesión — si no hay, dispara el login), y abre `wa.me` con el resumen y el
  folio.
- Mientras carga el inventario, la tabla muestra filas skeleton animadas
  (`CatalogApp.tsx`) en vez de un preloader de página completa — se borró
  `Preloader.tsx`/`preloader.css`, que antes se montaba en `catalogo/page.tsx`.

## `/nosotros`, `/guias-de-negocio`, `/contacto` (rediseño editorial jul 2026)

Estas 3 páginas pasaron por una segunda ronda de rediseño, ya sin nada de
"tarjeta" (`border` + `rounded` + `shadow` envolviendo bloques de contenido) —
patrón explícito pedido por el usuario, mismo lenguaje visual que ya usan
`SectorPage`/Delicatessen (número editorial tenue, separadores finos en vez de
cajas):

- **`/nosotros`**: la sección "Nuestras Raíces" (línea de tiempo 1970/1992/HOY)
  y "Dominio Logístico" (cobertura + checklist + CTA) se separaron en dos
  `<section>` independientes, sin tarjetas blancas con borde/sombra. Los
  números de año son **sólidos** en rojo Zarco (no tenues/transparentes — el
  usuario lo pidió explícitamente después de verlos apagados). "Dominio
  Logístico" suma una fila de 3 estadísticas (alcaldías cubiertas / transporte
  propio / intermediarios, todas verificables con datos que ya vivían en el
  resto de la página, no inventadas) y las píldoras de cobertura por alcaldía
  van en **una sola fila** de ancho completo (antes competían por espacio con
  el checklist en un grid de 2 columnas). El FAQ (`FaqAccordion`) se
  rediseñó con numeración en badge circular. Fondo blanco puro en toda la
  página (antes `#F4F7F9` en unas secciones y blanco en otras — se veía como
  una costura horizontal entre secciones).
- **`/guias-de-negocio`**: `GuideAccordion` pasó de acordeón-tarjeta a lista
  editorial (ver arriba). El sidebar con el intro pasó a ser genuinamente
  `sticky` — antes estaba envuelto en `Reveal` (que anima con `transform`) y
  eso rompía el `position: sticky` de su hijo, porque un `transform` en
  cualquier ancestro cambia el *containing block* del elemento sticky. Se
  invirtió el anidado: `sticky` ahora es el contenedor externo y `Reveal`
  envuelve solo el contenido de adentro. También se agregó `lg:self-start` —
  en un grid, un item `sticky` que no tiene `align-self: start` se estira a la
  altura completa de la fila y no tiene margen para "pegarse".
- **`/contacto`**: se renombró la propuesta de la página de "Ventas y
  Logística" / "Atención a Negocios" a **"Solicita tu Cotización"** (h1 +
  metadata) para que quede claro que el objetivo es cotizar, no solo
  "contactar". `ContactForm.tsx` se rediseñó completo: inputs con ícono +
  foco en rojo, selector de zona como `<select>` restilizado (no píldoras —
  se probó y el usuario prefirió el dropdown de toda la vida), validación
  custom con `noValidate` en vez del tooltip nativo del navegador (se montaba
  encima del `<label>`). El bloque de contacto (WhatsApp/correo/horarios) y
  el mapa dejaron de estar en tarjetas con borde/sombra.

### Animaciones GSAP (jul 2026)

Se instaló **GSAP** (`gsap` + `@gsap/react`, `useGSAP` hook) para las
animaciones de scroll de estas 3 páginas — antes solo existía `Reveal.tsx`
(fade + slide-up genérico vía `IntersectionObserver`/CSS transition). GSAP se
usa donde hace falta coreografía más fina (stagger, parallax, pop-in):

- **`src/app/(marketing)/nosotros/ScrollFx.tsx`** — client component que
  envuelve `<main>`, hace `gsap.registerPlugin(ScrollTrigger, useGSAP)` y
  anima por `data-fx="..."` (parallax del banner, stagger de la línea de
  tiempo, pop-in de los números de año, stagger de píldoras/checklist/stats).
  Respeta `prefers-reduced-motion`.
- **`FaqAccordion.tsx`** y **`GuideAccordion.tsx`** tienen su propio
  `useGSAP` interno (stagger de sus items al entrar en viewport).
- **`ContactForm.tsx`** también: stagger de sus campos (`data-fx="field"`).
- Patrón: `gsap.registerPlugin(...)` a nivel de módulo, `useGSAP(() => {...},
  { scope })` con un `ref` como scope, `ScrollTrigger` con `start: "top 8X%"`
  y early-return si `matchMedia("(prefers-reduced-motion: reduce)")`.

### SEO: JSON-LD en estas 3 páginas

Ninguna página del sitio tenía datos estructurados. Se agregó `<script
type="application/ld+json">` inline en cada una (sin librería, `JSON.stringify`
directo):

- **`/nosotros`**: `Organization` (nombre, logo, `foundingDate: "1992"` —
  coincide con "Tradición desde 1992" del footer, no con el "1970" de la
  línea de tiempo que es el origen informal en La Merced) + `FAQPage` con las
  mismas preguntas de `FaqAccordion` (HTML de las respuestas limpiado con
  `stripHtml()` antes de meterlo al schema).
- **`/guias-de-negocio`**: `CollectionPage` (sin fabricar `Article` por guía —
  no tienen fecha ni imagen individual, así que no calificarían para rich
  results de todos modos; mejor ser preciso que inflar el schema).
- **`/contacto`**: `LocalBusiness` con teléfono, dirección y los 3 bloques de
  horario que ya estaban como texto plano en la página.

También se corrigieron 3 issues puntuales de una auditoría SEO (con la skill
`seo-audit`, ver abajo): faltaba `<h1>` en `/nosotros` y `/guias-de-negocio`
(headings arrancaban en `h2`), el `<title>` de `/guias-de-negocio` era
literalmente `"Guías de Negocio"` (16 caracteres, sin marca — el layout raíz
no le agrega sufijo automático), y la meta description de `/contacto` tenía
un `¿` faltante.

### Skills de marketing (`.claude/skills/`, `.agents/skills/`)

Se instalaron **33 skills de marketing** (copiadas de una carpeta local del
usuario, `marketingskills-main`: `seo-audit`, `marketing-psychology`,
`copywriting`, `schema-markup`, `page-cro`, etc.) y las **8 skills oficiales
de GSAP** (`npx skills add https://github.com/greensock/gsap-skills`) como
skills de proyecto. Se usaron para auditar y mejorar `/nosotros`,
`/guias-de-negocio` y `/contacto`: hallazgos de SEO ya corregidos arriba;
de psicología de marketing/CRO, los CTA de `/guias-de-negocio` ahora capturan
lead en vez de ir directo a `wa.me` sin registro, y la sección "Dominio
Logístico" de `/nosotros` ganó una fila de stats de autoridad junto al CTA.

## Delicatessen

`/delicatessen` usa `DelicatessenNavbar.tsx`/`DelicatessenFooter.tsx` — copias
recoloreadas del `Navbar`/`Footer` compartido (gris oxford `#3A3D42` + rojo
Zarco `#A81200`, GIF promocional normal en el centro), no navbar/footer
aparte. Su contenido (charolas, carruseles de quesos/embutidos/complementos,
beneficios estilo editorial, subnav pill) ya es JSX real, reusando
`HeroSlider`, `ProductCarousel` y `WhatsappCTA` (variante `red`). El servicio
de charolas interactivo vive en `/delicatessen/arma-tu-charola`
(`src/components/charolas/`).

## `/perfil`

Usa el `Navbar`/`Footer` compartidos igual que el resto del sitio. Su
dashboard (`PerfilDashboard.tsx`) se sigue montando con `createPortal` sobre
`#perfil-react-root` dentro de `<main>` — eso no cambió — pero **(jul 2026)**
se reescribió por completo en Tailwind, igual que el resto del sitio: se
borró `perfil/perfil.css` (239 líneas de CSS legacy extraído del `perfil.json`
viejo) y el bloque `<style dangerouslySetInnerHTML>` que tenía el componente.
Mismo lenguaje editorial: sin tarjetas (nada de `border`+`rounded`+`shadow`
envolviendo bloques — antes `.card`/`.metric-box` los usaba todos), KPIs como
fila de estadísticas con divisores verticales en vez de cajas, historial de
pedidos con toggle `+`→`×` circular (el mismo patrón que `FaqAccordion`/
`GuideAccordion`, no un chevron SVG), avatar como círculo rojo con iniciales
(igual que `AuthMenu`), skeleton de carga con `animate-pulse` de Tailwind en
vez de un keyframe `shimmer` propio. Se quitaron los íconos SVG decorativos
(usuario, reloj, flecha, lupa, logout) — se conservaron solo los íconos de
marca (WhatsApp, Google) porque son identidad, no decoración. Toda la lógica
de negocio quedó intacta: fetch a `/api/portal`, "cargar al carrito"/"repetir
pedido" (merge con `localStorage.zarcoCartObjects` + sync a `/api/cart`),
"descargar nota" (ventana imprimible → PDF), búsqueda de folio/producto,
login popup de Google, logout.

## Páginas migradas (referencia)

`/`, `/aviso-de-privacidad`, `/terminos-del-servicio`, `/cremeria`,
`/embutidos`, `/abarrotes-basicos`, `/cafeterias`, `/restaurantes`, `/tiendas`,
`/guias-de-negocio`, `/contacto`, `/nosotros`, `/delicatessen`, `/catalogo`,
`/perfil`. Las 15 páginas públicas.
