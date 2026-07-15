# Panel admin (`/admin`)

Reemplaza la edición en Google Sheets. Doble barrera: el `layout.tsx` exige
`role=admin` y las RLS lo exigen otra vez. Los writes usan **la sesión del
admin** (no service-role). Vistas: dashboard (conteos), productos (precio/web/
nombre/categoría, con búsqueda), clientes (estatus/nivel/role), pedidos
(status), cotizaciones (leads, marcar atendido). Al editar un producto se
revalida el catálogo público (`revalidateTag("inventory")`).
