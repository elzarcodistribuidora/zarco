-- Auditoría de RLS — SOLO LECTURA, no modifica nada.
-- Pegar en Supabase Dashboard → SQL Editor y correr.
--
-- Existe porque el esquema y las policies viven únicamente en el dashboard: no
-- hay migraciones en el repo, así que no hay forma de revisar la seguridad
-- leyendo el código. Ver supabase/README.md.


-- 1) ¿Qué tablas públicas tienen RLS activo?
--    Cualquier fila con rls_activo = false está EXPUESTA a través de la API:
--    la anon key puede leerla (y quizá escribirla) desde el navegador.
select
  c.relname            as tabla,
  c.relrowsecurity     as rls_activo,
  c.relforcerowsecurity as rls_forzado_al_dueno,
  count(p.polname)     as num_policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policy p on p.polrelid = c.oid
where n.nspname = 'public'
  and c.relkind = 'r'
group by c.relname, c.relrowsecurity, c.relforcerowsecurity
order by c.relrowsecurity asc, c.relname;


-- 2) Todas las policies, con su condición real.
--    `using_expr`  = qué filas VE     (SELECT/UPDATE/DELETE)
--    `check_expr`  = qué filas PUEDE ESCRIBIR (INSERT/UPDATE)
--    Una policy permisiva con `using_expr = true` para el rol `anon` o
--    `authenticated` es una tabla efectivamente pública.
select
  c.relname as tabla,
  p.polname as policy,
  case p.polcmd
    when 'r' then 'SELECT' when 'a' then 'INSERT'
    when 'w' then 'UPDATE' when 'd' then 'DELETE'
    else 'ALL'
  end as comando,
  p.polpermissive as permisiva,
  coalesce(
    (select array_agg(r.rolname) from pg_roles r where r.oid = any(p.polroles)),
    array['(todos)']
  ) as roles,
  pg_get_expr(p.polqual, p.polrelid)      as using_expr,
  pg_get_expr(p.polwithcheck, p.polrelid) as check_expr
from pg_policy p
join pg_class c on c.oid = p.polrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
order by c.relname, p.polcmd;


-- 3) LA PREGUNTA CRÍTICA: ¿un cliente puede auto-promoverse a admin?
--
--    El layout de /admin y el guard de las rutas /api confían en
--    `clientes.role`. Si existe una policy de UPDATE sobre `clientes` que deja
--    al usuario modificar SU PROPIA fila, y esa policy no protege la columna
--    `role`, entonces cualquier cliente puede hacer:
--
--      update clientes set role = 'admin' where auth_user_id = auth.uid();
--
--    …y con eso entra al panel admin. RLS en Postgres NO tiene granularidad por
--    columna: si puedes actualizar la fila, puedes actualizar `role`.
--
--    Qué buscar en el resultado:
--      - Si NO sale ninguna fila con comando UPDATE/ALL → los clientes no
--        pueden escribir su fila. Estás bien.
--      - Si sale una con `check_expr` tipo `auth_user_id = auth.uid()` y el rol
--        `authenticated` → ESCALADA DE PRIVILEGIOS. Ver README para el arreglo.
select
  p.polname as policy,
  case p.polcmd when 'w' then 'UPDATE' when '*' then 'ALL' else p.polcmd::text end as comando,
  (select array_agg(r.rolname) from pg_roles r where r.oid = any(p.polroles)) as roles,
  pg_get_expr(p.polqual, p.polrelid)      as using_expr,
  pg_get_expr(p.polwithcheck, p.polrelid) as check_expr
from pg_policy p
join pg_class c on c.oid = p.polrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'clientes'
  and p.polcmd in ('w', '*');


-- 4) ¿El esquema `private` está realmente fuera del alcance de la API?
--    Los helpers (is_admin, current_cliente_id, es_email_admin) viven ahí. Si
--    `anon`/`authenticated` tienen USAGE sobre el esquema, se pueden llamar
--    desde el navegador.
select
  n.nspname as esquema,
  r.rolname as rol,
  has_schema_privilege(r.rolname, n.nspname, 'USAGE') as tiene_usage
from pg_namespace n
cross join (select rolname from pg_roles where rolname in ('anon', 'authenticated')) r
where n.nspname = 'private';


-- 5) Funciones SECURITY DEFINER: corren con los permisos de quien las creó y
--    saltan RLS. Verifica que su `search_path` esté fijo (si no, se pueden
--    secuestrar plantando objetos en un esquema que el atacante controle).
select
  n.nspname as esquema,
  p.proname as funcion,
  p.prosecdef as security_definer,
  p.proconfig as config_search_path
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where p.prosecdef
  and n.nspname in ('public', 'private')
order by n.nspname, p.proname;
