# Arquitectura

```
src/
├── app/
│   ├── layout.tsx                  Layout raíz neutro (sin CSS framework)
│   ├── globals.css                 Tailwind (portal + admin)
│   ├── (marketing)/                SITIO PÚBLICO — cada página es JSX + Tailwind real
│   │   ├── layout.tsx              Inter + marketing-tailwind.css + marketing.css + SmoothScroll
│   │   ├── marketing-tailwind.css  Tailwind SOLO utilidades (sin preflight) + tokens de marca + resets puntuales
│   │   ├── marketing.css           Lenis (scroll suave) + fade de transición entre páginas — GLOBAL
│   │   ├── page.tsx                Home (/)
│   │   ├── <slug>/page.tsx         Una carpeta por página (ver docs/marketing-site.md)
│   │   └── SmoothScroll.tsx        Lenis (scroll suave)
│   ├── portal/
│   │   ├── layout.tsx              Tailwind + Inter
│   │   └── login/page.tsx          Login Google (popup); pantalla de respaldo
│   ├── admin/                      PANEL ADMIN (solo rol admin) — ver docs/admin.md
│   ├── auth/
│   │   ├── callback/route.ts       Intercambia el código OAuth → sesión (cookies)
│   │   ├── signout/route.ts        Cierra sesión
│   │   └── done/page.tsx           Cierra el popup de login y avisa al opener
│   ├── api/                        Ver docs/backend-supabase.md
│   └── sitemap.ts robots.ts manifest.ts
├── proxy.ts                        Next 16 "middleware": refresca sesión Supabase + protege /admin
├── lib/
│   ├── supabase/server.ts          Cliente con cookies (Server Components / route handlers)
│   ├── supabase/client.ts          Cliente de navegador
│   ├── supabase/admin.ts           Cliente service-role (BYPASS RLS, solo servidor)
│   ├── supabase/middleware.ts      updateSession() para el proxy
│   ├── supabase/types.ts           Tipos generados del esquema
│   └── db.ts                       getInventory() (Supabase, unstable_cache tag "inventory")
└── components/
    ├── marketing/                  Librería compartida del sitio público (ver docs/marketing-site.md)
    ├── DelicatessenNavbar.tsx / DelicatessenFooter.tsx   Mismo Navbar/Footer compartido, recoloreado (gris oxford + rojo)
    └── charolas/                   /delicatessen/arma-tu-charola
scripts/
├── build-recommendations.mjs        npm run build:recs (cross-sell/upsell del catálogo)
├── build-favicons.mjs
└── import-to-supabase.mjs           Importó los productos una vez (dev tool)
supabase/
├── README.md                        Por qué la RLS no está versionada + plan de `supabase db pull`
├── audit-rls.sql                    Auditoría de RLS de SOLO LECTURA (pegar en el SQL Editor)
└── fix-clientes-role-escalation.sql Fix aplicado (jul 2026) a la escalada de privilegios en `clientes`
```

`.mcp.json` conecta el **MCP de Supabase** (proyecto `gekuyrjsehwsyorqyuxc`) para
correr migraciones/SQL desde el editor. **El esquema y las policies de RLS NO
están versionadas** (no hay `supabase/migrations/`) — viven solo en el
dashboard de Supabase. Ver `supabase/README.md` para el porqué y el plan de
`supabase db pull`, y `docs/backend-supabase.md` (sección "Hardening de
superficie de ataque") para el hallazgo real que este punto ciego produjo.

## El pipeline de Webflow ya se retiró — y ya no queda nada legacy

Ya no existe `src/webflow/` ni el catch-all `[[...slug]]/page.tsx`: las 15
páginas públicas son componentes JSX reales (ver `docs/marketing-site.md`).
`/perfil` se migró al `Navbar`/`Footer` compartidos — su dashboard
(`PerfilDashboard.tsx`) ya no depende de CSS propio: se reescribió en
Tailwind puro (jul 2026), y `perfil/perfil.css` (extraído del JSON viejo) se
borró por completo. `DelicatessenNavbar`/`DelicatessenFooter` (usados en
`/delicatessen` y `/delicatessen/arma-tu-charola`) **ya no son HTML/CSS crudo
de Webflow tampoco** — son el mismo `Navbar`/`Footer` compartido, recoloreado
(gris oxford `#3A3D42` + rojo Zarco `#A81200` en vez de navy/rojo).

Con eso, ya se pudo borrar:
- `src/webflow/` entero, `webflow-export/`.
- `scripts/mirror-webflow.mjs`, `optimize-images.mjs`, `build-pages.mjs` y sus
  comandos en `package.json`.
- **`PageScripts.tsx`** (su único uso restante era el bridge de sesión en
  `arma-tu-charola`; ahora ese navbar usa `useZarcoAuth` como todo el sitio).
- El `<link rel="stylesheet" href="/assets/webflow-shared.css">` del layout
  (nada depende ya de esas clases legacy — `.navbar`, `.nav-link`, etc.).

## Lo que sigue siendo global (a propósito, no legacy)

- **`src/app/(marketing)/marketing.css`**: Lenis (scroll suave) + el fade de
  transición entre páginas (`PageTransition.tsx`), para **todo** el sitio.
- **`src/app/(marketing)/marketing-tailwind.css`**: además de las utilidades
  de Tailwind y los tokens de marca, tiene los resets puntuales que hacen
  falta al no cargar el preflight completo — `<a>` sin subrayado, `<button>`
  sin fondo/borde nativo, `<ul>/<li>` sin viñetas, `<body>` sin el
  `margin: 8px` por defecto del navegador, `font-family: Inter` en `body`, y
  en `input`/`textarea`/`select`: `font-family: inherit` (sin esto,
  `<textarea>` cae en la fuente monoespaciada por defecto del navegador —
  muy notorio en el form de `/contacto`) + `border: 0`, `outline: none` y
  `appearance: none` (sin esto el navegador dibuja su propio borde/recuadro
  nativo sobre el diseño de cada campo — muy notorio en el buscador de
  `/catalogo`). **Ojo con Lightning CSS (el minificador de Tailwind v4):** si
  agregas un reset nuevo para estos mismos elementos, súmalo a la regla
  `input, textarea, select { ... }` que ya existe — **no crees una segunda
  regla con el mismo grupo de selectores en otro orden** (ej.
  `input, select, textarea`), porque Lightning CSS las trata como duplicadas
  y descarta la segunda por completo del CSS compilado, sin error visible
  (así se nos coló un bug real). Si aparece otro elemento con estilo nativo
  raro, el patrón es agregar el reset puntual aquí (no reactivar el preflight
  completo).

## GSAP (animaciones de scroll)

`gsap` + `@gsap/react` (hook `useGSAP`) se usan en `/nosotros`,
`/guias-de-negocio` y `/contacto` para animaciones de scroll más finas que el
fade genérico de `Reveal.tsx` (parallax, stagger, pop-in). Ver
`docs/marketing-site.md` para el detalle por página y el patrón de uso. Las
skills oficiales de GSAP y ~33 skills de marketing (SEO, copywriting, CRO,
psicología de marketing) están instaladas como skills de proyecto en
`.claude/skills/`/`.agents/skills/`.
