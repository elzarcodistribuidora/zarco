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

`build:recs` borra e inserta de cero la tabla `recomendaciones` a partir del
catálogo activo — vale la pena correrlo después de agregar/quitar productos
en bulk o de editar categorías/nombres. Después de correrlo, pégale a
`POST /api/revalidate?token=APPS_SCRIPT_TOKEN` (o espera los 5 min del ISR):
`/api/inventory` cachea `recs_comp`/`recs_sim` junto con el resto del
inventario, así que sin revalidar el catálogo en vivo sigue sirviendo las
recomendaciones anteriores aunque la tabla ya se haya actualizado.
