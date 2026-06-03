import { createClient } from "@/lib/supabase/server";
import { updateCliente } from "../actions";

export default async function ClientesAdmin() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, email, nombre, estatus, nivel, role, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = clientes ?? [];

  return (
    <>
      <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
        Clientes
      </h1>
      <p className="mt-1 text-sm text-slate-500">{rows.length} registrados</p>

      <div className="mt-6 space-y-3">
        {rows.map((c) => (
          <form
            key={c.id}
            action={updateCliente}
            className="grid grid-cols-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1.4fr_1.2fr_1fr_0.8fr_0.8fr_auto]"
          >
            <input type="hidden" name="id" value={c.id} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[#0A2240]">
                {c.email}
              </div>
              <input
                name="nombre"
                defaultValue={c.nombre ?? ""}
                placeholder="Nombre"
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              />
            </div>
            <label className="text-xs text-slate-400">
              Estatus
              <input
                name="estatus"
                defaultValue={c.estatus}
                className="mt-0.5 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
              />
            </label>
            <label className="text-xs text-slate-400">
              Nivel
              <input
                name="nivel"
                defaultValue={c.nivel ?? ""}
                placeholder="—"
                className="mt-0.5 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
              />
            </label>
            <label className="text-xs text-slate-400">
              Rol
              <select
                name="role"
                defaultValue={c.role}
                className="mt-0.5 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
              >
                <option value="cliente">cliente</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <div />
            <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#0A2240] hover:text-white">
              Guardar
            </button>
          </form>
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
