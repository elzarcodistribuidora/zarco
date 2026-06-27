import { createClient } from "@/lib/supabase/server";
import { updateCliente, deleteCliente } from "../actions";
import { RowForm } from "../ui/RowForm";
import { DeleteForm } from "../ui/DeleteForm";
import { SaveButton } from "../ui/SaveButton";
import { ExportButton } from "../ui/ExportButton";
import { IconSearch } from "../ui/icons";

export default async function ClientesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  
  let query = supabase
    .from("clientes")
    .select("id, email, nombre, estatus, nivel, role, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(500);
    
  if (q) {
    query = query.or(`email.ilike.%${q}%,nombre.ilike.%${q}%`);
  }

  const { data: clientes, count } = await query;
  const rows = clientes ?? [];
  const total = count ?? 0;
  const hayFiltro = !!q;

  return (
    <>
      <div className="admin-enter flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
            Clientes
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {hayFiltro ? `${total} coinciden` : `${total} registrados`}
          </p>
        </div>
        <ExportButton type="clientes" />
      </div>

      <div className="admin-enter mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-slate-900/[0.02] border border-slate-100">
        <form className="flex w-full items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <IconSearch
              width={18}
              height={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre o correo..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
            />
          </div>
          <button className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white outline-none transition-all duration-150 hover:bg-[#0c2c54] focus-visible:ring-2 focus-visible:ring-[#0A2240]/40 active:scale-[0.97]">
            Buscar
          </button>
          {hayFiltro && (
            <a
              href="/admin/clientes"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-[#A81200]"
            >
              Limpiar
            </a>
          )}
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((c, i) => (
          <div
            key={c.id}
            className="admin-enter flex items-stretch gap-2"
            style={{ "--i": Math.min(i + 1, 12) } as React.CSSProperties}
          >
          <RowForm
            action={updateCliente}
            savedMessage={`Guardado: ${c.nombre || c.email}`}
            className="grid flex-1 grid-cols-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.06] md:grid-cols-[1.4fr_1.2fr_1fr_0.8fr_auto]"
          >
            <input type="hidden" name="id" value={c.id} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-[#0A2240]">
                  {(c.nombre || c.email || "?").charAt(0).toUpperCase()}
                </span>
                <span className="truncate text-sm font-semibold text-[#0A2240]">
                  {c.email}
                </span>
                {c.role === "admin" && (
                  <span className="rounded-full bg-[#0A2240] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Admin
                  </span>
                )}
              </div>
              <input
                name="nombre"
                defaultValue={c.nombre ?? ""}
                placeholder="Nombre"
                className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
              />
            </div>
            <label className="text-xs font-medium text-slate-400">
              Estatus
              <input
                name="estatus"
                defaultValue={c.estatus}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
              />
            </label>
            <label className="text-xs font-medium text-slate-400">
              Nivel
              <input
                name="nivel"
                defaultValue={c.nivel ?? ""}
                placeholder="—"
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
              />
            </label>
            <label className="text-xs font-medium text-slate-400">
              Rol
              <select
                name="role"
                defaultValue={c.role}
                className="mt-1 w-full cursor-pointer rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
              >
                <option value="cliente">cliente</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <SaveButton />
          </RowForm>
            <DeleteForm
              action={deleteCliente}
              id={c.id}
              title="Eliminar cliente"
              confirmMessage={`¿Eliminar a ${
                c.nombre || c.email
              }? Esta acción no se puede deshacer. Sus pedidos se conservan (quedan sin cliente).`}
              deletedMessage={`Eliminado: ${c.nombre || c.email}`}
            />
          </div>
        ))}
        {rows.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
            Aún no hay clientes. Se crean solos cuando alguien entra con Google.
          </p>
        )}
      </div>
    </>
  );
}
