# Supabase — esquema y RLS

## El problema

Toda la seguridad de datos de El Zarco (RLS, triggers, los helpers de
`private.*`) vive **únicamente en el dashboard de Supabase**. No hay
migraciones en el repo, y eso significa que:

- No se puede revisar la seguridad leyendo el código. Una auditoría del backend
  tiene un punto ciego permanente.
- Un cambio accidental en el dashboard no deja rastro: no hay diff, no hay
  historial, no hay revisión.
- No hay forma de recrear la base desde cero, ni de levantar un entorno de
  staging que se parezca a producción.

Las rutas de `/api/*` y el layout de `/admin` **dependen** de que esas policies
sean correctas — son la segunda barrera, no la única.

## Auditar la RLS ahora mismo (sin instalar nada)

`audit-rls.sql` es un script de **solo lectura**. Pégalo en
Supabase Dashboard → SQL Editor y córrelo. Responde:

1. Qué tablas tienen RLS activo (y cuáles no → expuestas vía la anon key).
2. Todas las policies con su condición real.
3. **Si un cliente puede auto-promoverse a `role = 'admin'`.**
4. Si el esquema `private` está fuera del alcance de la API.
5. Qué funciones son `SECURITY DEFINER` y si tienen `search_path` fijo.

### Sobre la pregunta 3 (escalada de privilegios) — CONFIRMADA (jul 2026)

La auditoría encontró la policy `clientes_update_own` con:

```
using_expr = check_expr = (auth_user_id = auth.uid()) OR private.is_admin()
```

RLS en Postgres **no tiene granularidad por columna**: esa policy deja a
cualquier usuario autenticado actualizar su propia fila completa, `role`
incluido. Y `role = 'admin'` es exactamente lo que revisan
`src/app/admin/layout.tsx` y `src/lib/supabase/require-admin.ts` — cualquier
cliente logueado podía correr
`update clientes set role = 'admin' where auth_user_id = auth.uid()` y entrar
al panel admin.

**Fix, en `fix-clientes-role-escalation.sql`:** como ningún flujo de cliente
(fuera de `/admin`) escribe esta tabla — se verificó por grep, solo se lee
`clientes` desde `/api/*` — la policy no necesita distinguir "admin edita
cualquiera" de "cliente edita lo suyo". Se quita la rama
`auth_user_id = auth.uid()` y queda solo `private.is_admin()`.

⚠️ Una primera versión de este fix proponía `revoke update (role, estatus,
nivel) on clientes from authenticated`. Es **incorrecto**: Supabase no tiene un
rol de Postgres por usuario — todos los usuarios logueados, incluido el admin,
comparten el rol `authenticated` (RLS distingue por `auth.uid()`, no por rol de
Postgres). Ese REVOKE habría bloqueado también al admin real al editar
clientes desde `/admin/clientes`.

## Poner el esquema bajo control de versiones

```bash
# 1. Instalar el CLI de Supabase
brew install supabase/tap/supabase

# 2. Autenticarse y vincular este proyecto
supabase login
supabase link --project-ref gekuyrjsehwsyorqyuxc

# 3. Volcar el esquema REAL de producción a supabase/migrations/
supabase db pull

# 4. Revisar lo que salió y commitearlo
git add supabase/migrations && git diff --cached
```

`supabase db pull` genera la migración a partir de lo que **de verdad** hay en
producción — por eso es el camino correcto, en vez de escribir a mano lo que
creemos que hay. A partir de ahí, los cambios de esquema se hacen con
`supabase migration new` + `supabase db push`, y quedan revisables como
cualquier otro código.
