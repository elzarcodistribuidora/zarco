import { createClient } from "@/lib/supabase/server";
import { updateProducto } from "../actions";

const LIMIT = 100;

export default async function ProductosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("productos")
    .select("codigo, nombre_web, categoria, precio_final, web", { count: "exact" })
    .order("nombre_web", { ascending: true })
    .limit(LIMIT);
  if (q) query = query.or(`nombre_web.ilike.%${q}%,codigo.ilike.%${q}%`);

  const { data: productos, count } = await query;
  const rows = productos ?? [];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0A2240]">
            Productos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {count ?? 0} en total{q ? ` · filtrando "${q}"` : ""} · mostrando{" "}
            {rows.length}
          </p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nombre o código…"
            className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white">
            Buscar
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 w-32">Precio</th>
              <th className="px-4 py-3 w-16">Web</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p.codigo}>
                <td className="px-4 py-2 font-mono text-xs text-slate-500">
                  {p.codigo}
                </td>
                <td colSpan={5} className="p-0">
                  <form
                    action={updateProducto}
                    className="grid grid-cols-[1fr_160px_120px_48px_80px] items-center gap-2 px-4 py-2"
                  >
                    <input type="hidden" name="codigo" value={p.codigo} />
                    <input
                      name="nombre_web"
                      defaultValue={p.nombre_web}
                      className="rounded-md border border-slate-200 px-2 py-1.5"
                    />
                    <input
                      name="categoria"
                      defaultValue={p.categoria ?? ""}
                      className="rounded-md border border-slate-200 px-2 py-1.5"
                    />
                    <input
                      name="precio_final"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={Number(p.precio_final)}
                      className="rounded-md border border-slate-200 px-2 py-1.5 text-right"
                    />
                    <input
                      name="web"
                      type="checkbox"
                      defaultChecked={p.web}
                      className="mx-auto h-5 w-5"
                      title="Activado para web"
                    />
                    <button className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[#0A2240] hover:text-white">
                      Guardar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            Sin resultados.
          </p>
        )}
      </div>
    </>
  );
}
