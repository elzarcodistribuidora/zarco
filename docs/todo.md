# Pendientes / siguientes pasos

1. **Commitear y desplegar el endurecimiento de seguridad de rutas admin/checkout**
   (ver `docs/changelog.md`, jul 2026): `requireAdmin()` en
   `sync-prices`/`export`/`cord/create` y el total server-side en `/api/order`
   siguen sin commitear en el working tree — hasta que se despliegue, los 4
   huecos (bypass de autorización en precios masivos, acceso sin auth a
   `cord/create`, tampering de precio en pedidos, inyección de fórmulas en el
   export CSV) siguen abiertos en producción.
2. **Apps Script:** ya nada lo llama; dejarlo sin publicar ~2 semanas como red
   de seguridad y luego borrarlo. El Google Sheet ya no es necesario.
3. Confirmar en producción el flujo logueado completo (login popup → /perfil →
   pedido → admin lo ve) y las Redirect URLs de Supabase. Quitar las envs
   `AUTH_*` / `APPS_SCRIPT_URL` también en Vercel.
4. Revisión visual del usuario en curso tras la migración a Tailwind — ya
   confirmado: navbar (centrado, dropdown, ocultar/reaparecer al scroll),
   banners a todo el ancho, `<body>` sin marco blanco, tipografía Inter, y el
   navbar/footer nuevo de Delicatessen (gris oxford + rojo). También
   `/contacto` — probado end-to-end (`POST /api/quote` real, insertó folio)
   tras el rediseño. `/catalogo` ya se probó interactivamente con Playwright
   tras su rediseño (jul 2026): filtros, agregar/quitar del carrito, abrir el
   drawer, recomendaciones cross-sell — todo funcionando. Falta probar el
   **checkout completo por WhatsApp** con sesión iniciada (`POST /api/order`
   real con folio), que requiere login y no se cubrió en esa pasada.
5. Borrar el lead de prueba `[TEST]` que quedó en `cotizaciones` (se insertó
   al verificar que `/api/quote` seguía funcionando tras el rediseño de
   `/contacto`) — visible en `/admin/cotizaciones`.
6. **`/guias-de-negocio` a futuro**: las 8 guías viven como contenido de
   acordeón en una sola URL. Si se quiere que cada una rankee por su propio
   long-tail keyword, se podrían convertir en páginas individuales
   (`/guias-de-negocio/<slug>`) con esta página como índice — no se hizo
   porque es un cambio de arquitectura más grande, señalado en la auditoría
   SEO pero no implementado.
7. Revisar si vale la pena agregar Open Graph (`openGraph` en `metadata`) —
   ninguna página del sitio lo tiene todavía, se identificó en la misma
   auditoría SEO pero es un cambio sitewide, no específico de una página.
