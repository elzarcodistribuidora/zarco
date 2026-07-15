# SEO y scroll

## SEO
- Cada página migrada exporta su propio `metadata`/`generateMetadata`
  (título, descripción, canonical, Open Graph). `metadataBase` ← `NEXT_PUBLIC_SITE_URL`.
- `app/sitemap.ts` tiene el arreglo `SLUGS` hardcodeado (ya no lee
  `src/webflow/_pages.json`, que se borró — era el último uso de ese archivo).
  Excluye `/perfil` (portal de clientes, no indexable). Si agregas una página
  nueva, agrégala también aquí.
- `app/robots.ts` (disallow `/portal`, `/api`). `/admin` y `/portal` además
  llevan `noindex` por metadata en sus layouts.
- **JSON-LD** (`<script type="application/ld+json">` inline, sin librería):
  `/nosotros` tiene `Organization` + `FAQPage`, `/guias-de-negocio` tiene
  `CollectionPage`, `/contacto` tiene `LocalBusiness` (teléfono, dirección,
  horarios). El resto de las páginas todavía no tiene schema — pendiente si
  se quiere ampliar.

## Scroll suave
- Lenis (scroll suave) en todo el público (`SmoothScroll.tsx`).
- `/catalogo` ya no usa un preloader de página completa (logo + barra de
  progreso) — se quitó (`Preloader.tsx`/`preloader.css` se borraron). Mientras
  el inventario carga, `CatalogApp.tsx` muestra filas skeleton (placeholders
  animados) directo dentro de la tabla, en vez de bloquear toda la página.
