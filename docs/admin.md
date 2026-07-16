# Panel admin (`/admin`)

Reemplaza la edición en Google Sheets. Doble barrera: el `layout.tsx` exige
`role=admin` y las RLS lo exigen otra vez. Los writes usan **la sesión del
admin** (no service-role). Vistas: dashboard (conteos), productos (precio/web/
nombre/categoría, con búsqueda), clientes (estatus/nivel/role), pedidos
(status), cotizaciones (leads, marcar atendido). Al editar un producto se
revalida el catálogo público (`revalidateTag("inventory")`).

- **Carga masiva de precios (`UploadPricesCSV.tsx` → `POST /api/admin/sync-prices`)**:
  sube un CSV (código, precio) y actualiza `productos.precio_final` en lotes
  de 50. El aviso de resultado distingue cuántas filas se escribieron de
  verdad y cuántas fallaron (código inexistente u otro motivo) — antes
  cualquier fila que no afectara ninguna fila igual se contaba como éxito.
  Revalida el catálogo público (`"inventory"`) si algo se escribió de verdad.
- **Export CSV (`ExportButton.tsx` → `GET /api/admin/export?type=...`)**:
  productos/clientes/pedidos/cotizaciones a CSV.
- La barrera del `layout.tsx` protege las **páginas** de `/admin`; las rutas
  `/api/admin/*` que estas vistas llaman (`sync-prices`, `export`) no pasan
  por ese layout y verifican admin por su cuenta con `requireAdmin()` (ver
  `docs/backend-supabase.md`).
