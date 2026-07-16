-- FIX: escalada de privilegios en `clientes` — confirmada en auditoría (jul 2026).
--
-- La policy `clientes_update_own` deja a cualquier usuario autenticado
-- actualizar SU PROPIA fila:
--
--   using_expr = check_expr = (auth_user_id = auth.uid()) OR private.is_admin()
--
-- RLS en Postgres no tiene granularidad por columna: esa policy no distingue
-- entre "el cliente edita su nombre" y "el cliente se pone role = 'admin'".
-- Cualquier usuario logueado puede hoy correr:
--
--   update clientes set role = 'admin' where auth_user_id = auth.uid();
--
-- …y el layout de /admin (y require-admin.ts) lo dejan pasar, porque ambos
-- confían en clientes.role.
--
-- Verificado (grep en el repo) que NINGÚN flujo de cliente (fuera de /admin)
-- actualiza su propia fila — /api/session, /api/me, /api/portal, /api/cart,
-- /api/order solo LEEN `clientes`. El único UPDATE legítimo de esta tabla es
-- admin/actions.ts (`updateCliente`), que corre con la sesión del admin.
--
-- OJO — versión anterior de este archivo proponía un REVOKE de columna
-- (role/estatus/nivel) para el rol `authenticated`. Es INCORRECTO: Supabase no
-- tiene un rol de Postgres por usuario — TODOS los usuarios logueados,
-- incluido el admin, comparten el rol `authenticated` (RLS los distingue por
-- `auth.uid()`, no por rol). Ese REVOKE habría bloqueado también al admin real
-- al editar clientes desde /admin/clientes, rompiendo el único flujo legítimo
-- que sí necesita escribir esas columnas.
--
-- El fix correcto: como NINGÚN cliente necesita este UPDATE, la policy no
-- tiene que distinguir "admin edita cualquiera" de "cliente edita lo suyo" —
-- solo tiene que dejar de permitir lo segundo. Se quita la rama
-- `auth_user_id = auth.uid()` por completo; solo queda `private.is_admin()`.
--
-- Ejecutar en Supabase Dashboard → SQL Editor.

drop policy if exists "clientes_update_own" on public.clientes;

create policy "clientes_update_own" on public.clientes
  for update
  using (private.is_admin())
  with check (private.is_admin());

-- Verificación: confirma que la policy quedó así (una sola condición, sin la
-- rama de auth_user_id).
select
  polname as policy,
  pg_get_expr(polqual, polrelid)      as using_expr,
  pg_get_expr(polwithcheck, polrelid) as check_expr
from pg_policy
where polrelid = 'public.clientes'::regclass
  and polname = 'clientes_update_own';
-- Esperado: using_expr y check_expr = "private.is_admin()", sin mención de
-- auth_user_id ni auth.uid().
