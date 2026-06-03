import { createClient } from "@/lib/supabase/server";
import { updateCliente } from "../actions";
import { RowForm } from "../ui/RowForm";
import { SaveButton } from "../ui/SaveButton";

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
      <div className="admin-enter">
        <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
          Clientes
        </h1>
        <p className="mt-1 text-sm text-slate-500">{rows.length} registrados</p>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((c, i) => (
          <RowForm
            key={c.id}
            action={updateCliente}
            savedMessage={`Guardado: ${c.nombre || c.email}`}
            style={{ "--i": Math.min(i + 1, 12) } as React.CSSProperties}
            className="admin-enter grid grid-cols-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.06] md:grid-cols-[1.4fr_1.2fr_1fr_0.8fr_0.8fr_auto]"
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
            <div />
            <SaveButton />
          </RowForm>
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
