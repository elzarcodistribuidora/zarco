# Pendientes / siguientes pasos

1. ~~Commitear y desplegar el endurecimiento de seguridad de rutas admin/checkout~~
   **Hecho y desplegado (jul 2026)**: commits `22f4f6d` (rutas admin/checkout)
   y `5400cc6` (escalada de privilegios en RLS + limpieza de dependencias),
   ambos en producción. Ver `docs/backend-supabase.md` ("Hardening de
   superficie de ataque") para el detalle completo.
2. Probar en producción el **checkout completo por WhatsApp con sesión
   iniciada** (`POST /api/order` real, con folio) — el total ahora lo cotiza
   el servidor contra `productos.precio_final` en vez de confiar en el
   cliente, así que vale la pena confirmar con un pedido real de bajo monto
   que el total mostrado en WhatsApp coincide con el guardado en `pedidos`.
3. **Poner la RLS bajo control de versiones** (`supabase db pull`, ver
   `supabase/README.md`) — hoy solo vive en el dashboard; ya se demostró que
   eso deja pasar hallazgos como la escalada de privilegios de `clientes`
   sin que una revisión de código la detecte.
4. **Revisar el tráfico de las reglas del WAF** (`Rate limit quote` y `Log
   traffic: order + admin + cord`, ver `docs/backend-supabase.md`) tras 24-48h
   en modo `log`/monitoreo, y decidir si conviene subir de plan de Vercel para
   tener más de 1 regla `rate_limit` activa (el plan actual solo permite una).
5. **`npm audit`**: quedan 2 vulnerabilidades moderadas de un `postcss`
   vendorizado dentro del propio Next 16.2.7 (XSS solo explotable si PostCSS
   procesa CSS no confiable en runtime — no es el caso aquí, solo corre en
   build time). No hay parche estable de Next 16.x disponible todavía (solo
   `16.3.0-preview.*`); revisar cuando salga un patch estable.
6. **Apps Script:** ya nada lo llama; dejarlo sin publicar ~2 semanas como red
   de seguridad y luego borrarlo. El Google Sheet ya no es necesario.
7. Confirmar en producción el flujo logueado completo (login popup → /perfil →
   pedido → admin lo ve) y las Redirect URLs de Supabase. Quitar las envs
   `AUTH_*` / `APPS_SCRIPT_URL` también en Vercel (ya no están en `.env.example`,
   falta confirmar que tampoco sigan configuradas ahí).
8. Revisión visual del usuario en curso tras la migración a Tailwind — ya
   confirmado: navbar (centrado, dropdown, ocultar/reaparecer al scroll),
   banners a todo el ancho, `<body>` sin marco blanco, tipografía Inter, y el
   navbar/footer nuevo de Delicatessen (gris oxford + rojo). También
   `/contacto` — probado end-to-end (`POST /api/quote` real, insertó folio)
   tras el rediseño. `/catalogo` ya se probó interactivamente con Playwright
   tras su rediseño (jul 2026): filtros, agregar/quitar del carrito, abrir el
   drawer, recomendaciones cross-sell — todo funcionando.
9. Borrar el lead de prueba `[TEST]` que quedó en `cotizaciones` (se insertó
   al verificar que `/api/quote` seguía funcionando tras el rediseño de
   `/contacto`) — visible en `/admin/cotizaciones`.
10. **`/guias-de-negocio` a futuro**: las 8 guías viven como contenido de
    acordeón en una sola URL. Si se quiere que cada una rankee por su propio
    long-tail keyword, se podrían convertir en páginas individuales
    (`/guias-de-negocio/<slug>`) con esta página como índice — no se hizo
    porque es un cambio de arquitectura más grande, señalado en la auditoría
    SEO pero no implementado.
11. Revisar si vale la pena agregar Open Graph (`openGraph` en `metadata`) —
    ninguna página del sitio lo tiene todavía, se identificó en la misma
    auditoría SEO pero es un cambio sitewide, no específico de una página.
