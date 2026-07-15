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
  El popover de escritorio (`DesktopAuthTrigger`, jul 2026) tiene header con
  degradado navy (mismo lenguaje que el header del drawer del carrito de
  `/catalogo`) + avatar del usuario sobre el fondo oscuro, y cada opción
  ("Ir a mi Portal B2B", "Panel admin", "Cerrar Sesión") lleva un ícono en
  badge circular que se resalta a color al hover (rojo sólido en "Cerrar
  Sesión"). Es un componente compartido — `DelicatessenNavbar.tsx` lo importa
  igual que `Navbar.tsx`, así que el rediseño aplica en todo el sitio sin
  duplicar código.
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
- **Aviso de precios** ("Nota Importante de Precios", debajo de la tabla):
  pasó de una tarjeta angosta (`max-w-[700px]`, sin icono en badge) a una
  más ancha (`max-w-[980px]`) con fondo en degradado ámbar y una barra de
  acento amarilla a la izquierda en vez de `border-l`. El mismo bloque
  (mismas clases) vive duplicado como `priceNotice` en
  `terminos-del-servicio/page.tsx` — si se ajusta uno, replicar en el otro.
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

### Botones CTA de navbar → pill (jul 2026)

El botón de acción de **ambas** navbars (`Navbar.tsx`: "Cotizar" → `/contacto`;
`DelicatessenNavbar.tsx`: "Arma tu Charola" → `/delicatessen/arma-tu-charola`)
dejó de ser un botón rectangular sólido para adoptar la misma forma de pill
que ya usaba `WhatsappCTA.tsx` (texto en negritas + círculo con flecha a la
derecha, `group-hover:translate-x-0.5`), solo que en blanco sobre el fondo
navy/gris de la navbar en vez de blanco sobre el degradado del CTA de cierre.
Mismo patrón, adaptado de contexto.

### Sección "Charolas & Tablas Premium" — de tarjetas a menú editorial (jul 2026)

La sección de 3 niveles de charola (`TIERS` en `delicatessen/page.tsx`) tenía
tarjetas con borde/sombra y SVGs decorativos dibujados a mano (path complejos
de regalo/vino/carpa) que no convencían visualmente. Se rediseñó dos veces:
primero se probó el mismo patrón de número tenue `01/02/03` que ya usa
`SectorPage` (ver abajo), pero el usuario pidió explícitamente **un enfoque
distinto** al que ya existe en el resto del sitio, no repetir el mismo
recurso. El diseño final es una lista tipo **menú de restaurante**: cada tier
es una fila completa (no una columna), separadas por líneas finas
horizontales (`divide-y` + `border-y`, sin tarjeta envolvente — la sección ya
no está dentro de la caja blanca `rounded-3xl bg-white shadow` que tenía
antes, vive directo sobre el fondo blanco de `<main>`). Cada fila:
nombre del tier a la izquierda, descripción al centro, un **pill** con el
dato de capacidad a la derecha (borde gris; rojo sólido en la fila
"Charola Premium"), franja roja vertical + ícono de estrella (SVG, no el
carácter unicode ★ que no renderiza igual en todos los sistemas) en la fila
popular. Toda la fila es un `<Link>` a `/delicatessen/arma-tu-charola`
(no solo el botón), con un botón circular de flecha que aparece al hover
(siempre visible en la fila popular) — mismo lenguaje de interacción que las
tarjetas de `CatalogRecs`/`ProductCarousel`.

Esta sección (`#servicio-charolas`, `delicatessen/page.tsx`) se hizo más
delgada en móvil (jul 2026) — antes cada bloque (encabezado, las 3 filas de
tier, la franja de 4 estadísticas, el botón CTA) traía el mismo padding
generoso que en escritorio, y sumado ocupaba mucho scroll en pantallas
angostas. Se redujeron paddings/márgenes/tamaños de texto **solo en móvil**
(clases base sin prefijo, con `lg:` conservando los valores originales de
escritorio): el `<nav>` de la píldora de filtros pasó de `mb-10` a `mb-3`
(queda pegado a la sección), el bloque de encabezado de `mb-10` a `mb-4`, las
filas de tier de `py-7` a `py-4` (con `md:py-8` de vuelta en desktop), la
franja de estadísticas de `py-8`/`gap-5` a `py-4`/`gap-3`, y el botón CTA de
`px-10 py-4` a `px-8 py-3`. Nada de esto tocó el layout de escritorio.

### Ícono de WhatsApp deformado (bug de sitewide, jul 2026)

El glyph de WhatsApp (path de Font Awesome, `viewBox="0 0 448 512"`) se
renderizaba en 4 lugares del sitio (`Footer.tsx`, `DelicatessenFooter.tsx`,
`TrayBuilder.tsx`) forzado a un tamaño cuadrado (`22px × 22px` o
`h-[22px] w-[22px]`), pero el viewBox **no es cuadrado** (proporción
448:512 ≈ 0.875:1) — el ícono quedaba ovalado/aplastado en vez de circular.
Se corrigió el ancho a `19px` (`22 × 0.875`) en los 4 lugares para respetar
la proporción real del glyph. De paso se encontró y borró un botón flotante
de WhatsApp **duplicado**: `delicatessen/page.tsx` montaba su propia versión
(`fixed right-5 bottom-5 z-[9999]`, con mensaje prellenado) exactamente en la
misma posición que la que ya trae `DelicatessenFooter.tsx` — invisible/dead
código porque quedaban apilados uno sobre otro con el mismo z-index.

### `/delicatessen/arma-tu-charola` — banner y "Arma tu Charola" como Typeform (jul 2026)

- **Banner**: el banner "Arma tu Charola de Charcutería" (mesa con charolas,
  logo, `/banners/charolas-desk.png`/`charolas-movil.png`) se movió
  exclusivamente a esta página, pegado al navbar (`<header className="w-full
  overflow-hidden pt-[var(--navbar-h)]">`, mismo patrón full-bleed que
  `SectorPage`). Tenía un **bug de scroll horizontal**: el `<section>` usaba
  estilos inline `width: '100%'` + `paddingLeft/Right: '5%'` sin
  `box-sizing: border-box` (el sitio no carga el preflight de Tailwind) — el
  padding se sumaba al 100% del ancho y el elemento terminaba ~10% más ancho
  que el viewport. Se resolvió adoptando el mismo patrón sin padding lateral
  que usan los demás banners del sitio. En Home (`/`), ese mismo espacio
  ahora muestra un banner promocional nuevo (`charolas-promo-desk.webp` /
  `charolas-promo-movil.webp`, en `public/banners/`) que enlaza aquí mismo —
  al hacer hover aparece una pill "Arma tu Charola" centrada sobre un overlay
  oscuro semitransparente.
- **`TrayBuilder.tsx` — navegación por teclado estilo Typeform**: `Enter`
  avanza en cualquier paso (antes solo en la intro), `↓`/`PageDown` avanza,
  `↑`/`PageUp` retrocede, dígitos `1`-`4` seleccionan el tamaño de charola
  directo. En notas, `Enter` avanza y `Shift+Enter` inserta salto de línea.
  **Bug real corregido**: si el usuario clickeaba un ingrediente (quedaba
  enfocado ese `<button>`) y luego presionaba `Enter` para avanzar, el
  navegador disparaba también un click nativo sobre ese botón enfocado —
  deseleccionando el ingrediente justo al avanzar de paso. Se previene con
  `e.preventDefault()` cuando el target del `Enter` es un `BUTTON`.
- **Scroll al avanzar/retroceder**: `next()`/`prev()` usaban
  `window.scrollTo(0, 0)`, que llevaba de vuelta hasta el tope absoluto de la
  página (mostrando el banner de nuevo) en vez de solo el tope del
  formulario — se sentía como una recarga. El sitio usa **Lenis** para el
  scroll suave, que mantiene su propio estado de scroll "virtual"; un
  `window.scrollTo` nativo pelea contra ese estado y el scroll rebota de
  vuelta a donde estaba. `SmoothScroll.tsx` ahora expone la instancia activa
  en `window.__lenis`, y `TrayBuilder.tsx` la usa (`lenis.scrollTo(el, {
  immediate: true })`) para saltar limpio al tope de `#charola-builder`.
- **Rediseño visual minimalista**: las tarjetas de ingredientes pasaron de
  checkbox-en-caja a filas con un subrayado que se pinta de azul al
  seleccionar + una insignia circular con palomita a la derecha (antes era
  un trazo SVG suelto sin fondo, se veía flotando). El textarea de notas
  pasó de caja con borde a subrayado simple (clase `.tb-textarea`, foco en
  azul). Hints de teclado junto a la navegación (`Presiona ↵ o ↓`,
  `Presiona 1–4`), ocultos en móvil.
- **Ingredientes (`trayData.ts`) reemplazados por catálogo real (jul 2026)**:
  la lista de quesos/carnes frías/acompañamientos era **ficticia** —
  productos que El Zarco no distribuye (Prosciutto di Parma, Bresaola,
  Coppa Italiana, Gruyère suizo, uvas/fresas/higos frescos, hummus). Se
  consultó la tabla `productos` real vía REST (Lacteos/Embutidos/Abarrotes,
  `web=true`) y se reconstruyeron las 3 listas 1:1 con lo que sí se vende:
  quesos (Brie/Camembert Danés, Gouda La Villita, Manchego El Zarco,
  Parmesano Regianito, Grana Padano, Gruyere Maasdam Holandés, Cheddar
  Navarro, Azul Vikingo, Roquefort Rosenborg, cabra, Provolone Toscana,
  Oaxaca/Panela El Zarco), carnes frías (Jamón Serrano tipo Prosciutto
  Parma, Jamón Serrano Tangamanga, Salami Calabrese/Ungaro, Peperoni El
  Mexicano, Chorizo Español Bremen, Chistorra Bremen, Pechuga Pavo Ahumada
  /Tocino/Lomo Ahumado Bernina, Roast Beef Tangamanga, Mortadela Kir,
  Pierna Selva Negra Tangamanga) y acompañamientos (mermeladas Rica Frut,
  miel de agave, paté Zwan, aceitunas, nueces/almendra/pistache/nuez de la
  India/nuez garapiñada, dátil, higos cristalizados, arándanos
  deshidratados, cacahuates, galletas pretzel, pan integral — sin fruta
  fresca ni crackers artesanales porque El Zarco no maneja perecederos de
  ese tipo). El campo `origin` de cada `Ingredient` ahora muestra la
  **marca real** del producto (p. ej. "Bernina", "Tangamanga", "El Zarco")
  en vez de un país inventado — solo se dejó un país cuando el nombre real
  del producto lo dice explícitamente (p. ej. "Brie Danés" → Dinamarca).
  `TrayBuilder.tsx` no cambió — solo consume `name`/`origin`/`category` de
  `trayData.ts`, así que el rediseño no tocó lógica del componente.
- **Ingredientes: de nombres con marca a nombres genéricos (jul 2026)**: la
  vuelta anterior (basada 1:1 en SKUs reales) quedó con marcas comerciales en
  el nombre ("Manchego El Zarco", "Jamón Serrano Tangamanga", "Paté Zwan") —
  a pedido del usuario se quitaron las marcas para no atarse a una sola
  referencia de proveedor. `trayData.ts` ahora usa nombres genéricos de tipo
  de producto (Brie, Manchego, Jamón Serrano, Prosciutto, Mermelada de
  Frutos Rojos) y el campo `origin` pasó de mostrar la marca a mostrar el
  país/estilo del queso o embutido (Francia, España, Italia — descriptor de
  denominación, no una marca). Se sumaron además unos clásicos de charola
  muy comunes y fáciles de conseguir que hoy no están en el catálogo de El
  Zarco (uvas y fresas frescas, aceitunas negras, Bresaola) — a propósito
  sobre todo en carnes frías y frutas/aceitunas, por pedido explícito del
  usuario.
- **Aviso de scroll en el banner de intro, solo en escritorio (jul 2026)**:
  se agregó una píldora semitransparente ("Desliza para armar tu charola" +
  flecha) superpuesta en la parte baja del banner de
  `arma-tu-charola/page.tsx` (`<header className="relative ...">`), visible
  **solo en escritorio** (`hidden md:flex`) — en móvil el formulario ya
  queda visible sin necesidad del aviso (ver el fix de espaciado banner/intro
  arriba), así que ahí se deja oculto.
- **Espacio entre el banner y el intro del formulario, corregido en móvil
  (jul 2026)**: el primer paso (`IntroSlide`, `.tb-intro-slide`) dejaba
  ~265px de espacio en blanco entre el banner y el título "Arma tu Charola"
  en móvil. Bajar el `padding-top` de `100px` a `32px` en el media query
  `@media (max-width: 768px)` **no tuvo efecto por sí solo**: `.tb-slide`
  fuerza `min-height: 100vh`, y `.tb-intro-slide > div` tiene
  `margin-top/bottom: auto` para centrar verticalmente el contenido — ese
  centrado domina sobre `justify-content: flex-start` y sobre cualquier
  cambio al `padding-top`, porque el hijo queda centrado en lo que mida el
  contenedor (100vh) sin importar el padding. Se corrigió agregando, dentro
  del mismo media query, `min-height: 0 !important` a `.tb-intro-slide` y
  `margin-top/bottom: 0 !important` a `.tb-intro-slide > div` — así el
  contenido ya no se centra en una caja de pantalla completa y el
  `padding-top` de 32px sí controla la posición real (gap final ~66px,
  verificado con Playwright en 390×844).

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

## 3 bugs de móvil corregidos, sitio verificado con Playwright (jul 2026)

El sitio se reportó como "solo se ve la navbar" en móvil. Se investigó con
Playwright headless (`chromium`, viewport 390×844) en vez de adivinar, y se
encontraron 3 bugs reales:

- **Drawer del menú móvil siempre abierto** (el bug real detrás del reporte):
  en `Navbar.tsx` y `DelicatessenNavbar.tsx`, el `<div>` del drawer tenía la
  clase `right-0` fija en la base del template string, **además** de la
  condicional `` drawerOpen ? "right-0" : "-right-full" ``. Ambas clases
  tienen la misma especificidad CSS (un solo selector de clase), así que
  `right-0` siempre ganaba y el drawer (`fixed`, `h-screen`, `z-[2001]`)
  quedaba visible y fijo sobre toda la pantalla sin importar el estado de
  `drawerOpen` — por eso en móvil "solo se veía la navbar" (en realidad era
  el drawer superpuesto, tapando el resto de la página). Se quitó el
  `right-0` de la base; ahora solo lo aporta la clase condicional.
- **GIF promocional del navbar cortado en móvil**: la imagen central de
  `Navbar.tsx`/`DelicatessenNavbar.tsx` (`GIF-EL-ZARCO-1.webp`, 700×150px)
  se forzaba a `h-[100px]` en todas las pantallas — a esa altura el ancho
  real es ~467px, más que el viewport de un teléfono (ej. 390px), y el
  texto ("TODO PARA TU NEGOCIO") quedaba cortado por el borde de la
  pantalla. Se hizo responsive: `h-[65px] lg:h-[100px]` sin scroll,
  `h-[38px] lg:h-[60px]` con scroll, más `max-w-full` en el `<img>` y su
  contenedor como red de seguridad.
- **`/contacto` con scroll horizontal en móvil**: los inputs de
  `ContactForm.tsx` combinan `w-full` + `padding` (`py-3.5 pr-4 pl-11`) +
  `border` en el mismo elemento. Sin el preflight de Tailwind (ver arriba),
  `input`/`textarea`/`select` no traían `box-sizing: border-box`, así que el
  padding y el borde se sumaban al 100% del ancho y el campo terminaba más
  ancho que su contenedor — el mismo patrón de bug que ya había aparecido en
  el banner de `arma-tu-charola` (ver abajo), pero esta vez en un elemento
  que si vale la pena resetear globalmente. Se agregó `box-sizing: border-box`
  a la regla `input, textarea, select { ... }` que ya existe en
  `marketing-tailwind.css` — **no** se creó una regla nueva (ver la
  advertencia sobre Lightning CSS y selectores duplicados, arriba).

Verificado con un script de Playwright ad-hoc (no quedó como skill del
proyecto) recorriendo las 15 páginas públicas más `/delicatessen/arma-tu-charola`
y `/portal/login` en viewport móvil: ninguna quedó con `scrollWidth` mayor al
viewport tras el fix.

### Home: 3 secciones a carrusel horizontal solo en móvil (jul 2026)

"Nuestras Líneas de Negocio" (`SECTOR_CARDS`), "Familias de Productos"
(`PRODUCT_CATS`) y "Líderes Que Confían en Nuestra Red" (`BRAND_LOGOS`), las
tres en `(marketing)/page.tsx`, eran un `grid` normal (columna única en
móvil, apilado vertical). Se pidió que en móvil fueran carrusel horizontal
con **peek** — la primera tarjeta/logo se ve completo y el segundo se ve
cortado, para que se note que hay más sin necesidad de una flecha o dot
indicador. Patrón aplicado a los tres (mismo que ya usaba `ProductCarousel.tsx`
para los carruseles de `SectorPage`): en el contenedor,
`flex snap-x snap-mandatory gap-* overflow-x-auto` + scrollbar oculta
(`[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`)
que revierte a `grid` normal en el breakpoint donde antes empezaba el grid
(`md:grid md:grid-cols-3` para sectores, `sm:grid sm:grid-cols-3` para
familias, `sm:grid sm:grid-cols-4` para líderes) — en desktop se ve exactamente
igual que antes, sin scroll. Cada item hijo lleva `w-[N%] shrink-0 snap-start`
en móvil (revertido a `w-auto shrink` en el breakpoint de grid): `78%` para
las tarjetas de sector (con `h-[380px]` en vez de `h-[500px]` fijo, para que
no queden desproporcionadas de angostas-y-altas), `60%` para las familias de
producto, `62%` para los logos de marca — todos calibrados a mano viendo el
screenshot hasta que el segundo elemento quedara visiblemente cortado (un
45% en los logos, por ejemplo, mostraba los dos completos sin transmitir
"hay más"). El contenedor usa `-mx-[5%] ... px-[5%]` (donde la sección ya
vivía en un `w-[90%]` centrado) para que el scroll no quede limitado por el
padding del propio contenedor.

De paso, `Navbar.tsx`/`DelicatessenNavbar.tsx` ganaron `overflow-x-hidden` en
el `<header>` (dueño real del contenido de la barra — el drawer/overlay móvil
son hermanos fuera de `<header>`, así que esto no los afecta) como red de
seguridad para que la barra nunca se sienta "temblorosa" horizontalmente en
pantallas angostas. **(Corregido más abajo — este `overflow-x-hidden` en el
`<header>` completo resultó tener un efecto secundario real: ver "Dropdown de
Productos" en la siguiente sección.)**

## Drawer móvil rediseñado + 2 bugs reales más (jul 2026)

- **Drawer del menú móvil animaba `right` en vez de `transform`**: tanto
  `Navbar.tsx` como `DelicatessenNavbar.tsx` abrían/cerraban el drawer
  animando la propiedad CSS `right` (`transition-[right]`, `right-0` /
  `-right-full`). Animar `right` obliga al navegador a recalcular layout en
  cada frame (no lo acelera el compositor), así que el drawer se sentía
  tembloroso/lento en vez de deslizarse suave. Se cambió a animar
  `transform: translateX` (`right-0` fijo siempre + `translate-x-0` /
  `translate-x-full`), que sí corre en el compositor/GPU — mismo efecto
  visual, mucho más fluido.
- **Drawer rediseñado para no tapar toda la pantalla ("más pro")**: pasó de
  `w-[85%] max-w-[380px]` (prácticamente pantalla completa en móviles
  angostos) a `w-[74%] max-w-[320px]` con `rounded-l-[28px]` en el borde
  izquierdo — dejando ver claramente el overlay oscuro de fondo a la
  izquierda, como un panel flotante en vez de una pantalla completa que
  reemplaza el contenido.
- **`DelicatessenNavbar.tsx`: "Inicio" del menú móvil no volvía al home
  real**: el ítem "Inicio" del drawer apuntaba a `/delicatessen` (el mismo
  logo ya enlaza ahí), mientras que en escritorio ese mismo link ("Inicio" de
  `MAIN_LINKS`) apunta a `/` — inconsistencia que hacía sentir que "Inicio"
  no hacía nada si ya estabas en `/delicatessen`. Se corrigió el mobile para
  que apunte a `/`, igual que en escritorio.
- **Bug real: el dropdown de "Productos" dejó de verse en escritorio**
  (regresión de la sesión anterior, causada por el `overflow-x-hidden` del
  `<header>` mencionado arriba). El dropdown de "Productos" se posiciona
  `absolute` sobresaliendo por debajo de la barra de links, dentro del mismo
  `<header>`. La regla CSS de overflow tiene un comportamiento poco conocido:
  si defines `overflow-x` distinto de `visible` y dejas `overflow-y` en su
  valor por defecto (`visible`), el navegador **fuerza el valor computado de
  `overflow-y` a `auto`** (no se puede evitar ni fijando `overflow-y-visible`
  explícitamente — es una regla del spec de CSS Overflow, no un problema de
  cascada/especificidad). Con `overflow-y: auto` en el `<header>` (que solo
  mide lo alto de sus dos barras, no toda la pantalla), cualquier cosa que
  sobresalga verticalmente —como el dropdown— queda recortada e invisible.
  Se corrigió moviendo el `overflow-x-hidden` **solo** a la barra superior
  (logo + GIF, la que de verdad necesitaba la protección contra el
  temblor horizontal), dejando la barra de links —dueña del dropdown— sin
  ningún `overflow` propio.
- **Bug real (2da vuelta): la flecha de "Productos" del drawer móvil se veía
  cortada y todo el texto quedaba corrido hacia la derecha**, con scroll
  horizontal dentro del propio panel. Dos causas, ambas por no cargar el
  preflight de Tailwind (ver arriba):
  1. `<ul>` conserva su `padding-inline-start: 40px` nativo del navegador —
     el reset existente solo le quitaba las viñetas (`list-style: none`), no
     el padding. Cualquier `<ul>` con `w-full`/flex quedaba efectivamente
     40px más angosto de lo que su contenedor esperaba, empujando todo el
     contenido (texto + ícono del chevron) hacia la derecha. Se agregó
     `margin: 0; padding: 0;` a la regla `ul, ol` que ya existía en
     `marketing-tailwind.css` (mismo patrón puntual del proyecto).
  2. El propio panel del drawer usa `box-sizing: content-box` (valor por
     defecto sin preflight) combinado con `px-6` — bajo `content-box` el
     padding **se suma** al ancho declarado (`w-[74%] max-w-[320px]`) en vez
     de restarle espacio al contenido, así que el panel terminaba más ancho
     de lo previsto (comiéndose el "espacio a la izquierda" del rediseño de
     arriba) y su contenido interno se desbordaba por la derecha. Se agregó
     la utilidad `box-border` (`box-sizing: border-box`) al contenedor del
     drawer en ambos navbars — ahí sí tenía sentido resolverlo puntual en el
     componente (no globalmente) porque es el único lugar del sitio que
     combina ancho fijo + padding + una posición `fixed` anclada a un borde
     de la pantalla, donde el error se nota de inmediato.

  Verificado con Playwright (viewport 390×844): `scrollWidth === clientWidth`
  del panel del drawer en `/` y `/delicatessen` (cero desbordamiento), y la
  flecha del chevron visible completa junto al texto "PRODUCTOS".

Verificado con Playwright (`chromium`, hover sobre "Productos" en escritorio
1440×900, apertura del drawer en 390×844) en `/` y `/delicatessen`: el
dropdown se ve completo, el drawer deja espacio a la izquierda, y el
`scrollWidth` de ambas páginas sigue sin exceder el viewport en móvil.

### Banner móvil de `/delicatessen/arma-tu-charola` actualizado (jul 2026)

Se reemplazó `public/banners/charolas-movil.png` (1080×300) por una imagen
nueva (1080×600) provista por el usuario. El `<picture>` que sirve este
banner (`arma-tu-charola/page.tsx`) usa `<img className="block w-full">`, así
que el nuevo aspecto más alto se acomoda solo sin reintroducir el bug de
padding/scroll horizontal que tuvo este mismo banner antes (ver más abajo).

### Flechas de navegación de `TrayBuilder.tsx` tapadas por el botón de WhatsApp (jul 2026)

En móvil, `.tb-nav-container` (las flechas ‹ › para retroceder/avanzar de
paso) quedaba en `bottom: 24px; right: 16px` — la misma esquina donde vive el
botón flotante de WhatsApp del footer (`z-[9999]`, por encima de las flechas
que son `z-index: 9000`), tapándolas parcialmente. Mismo patrón de bug que ya
se había corregido en el carrito de `/catalogo` (ver arriba): se centraron
las flechas abajo (`left: 50%; transform: translateX(-50%)`) en vez de
dejarlas en la esquina.

## Páginas migradas (referencia)

`/`, `/aviso-de-privacidad`, `/terminos-del-servicio`, `/cremeria`,
`/embutidos`, `/abarrotes-basicos`, `/cafeterias`, `/restaurantes`, `/tiendas`,
`/guias-de-negocio`, `/contacto`, `/nosotros`, `/delicatessen`, `/catalogo`,
`/perfil`. Las 15 páginas públicas.
