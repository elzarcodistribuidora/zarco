# Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run start        # servir el build
npm run build:recs   # recalcula cross-sell/upsell del catálogo (tabla recomendaciones)
npm run build:favicons
```

El pipeline de Webflow (`mirror`/`optimize`/`build:pages`) ya no existe — las
15 páginas públicas son JSX + Tailwind (ver `docs/marketing-site.md`).
