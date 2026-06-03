import { createClient } from "@/lib/supabase/server";
import { updateProducto } from "../actions";
import { RowForm } from "../ui/RowForm";
import { SaveButton } from "../ui/SaveButton";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { LoadMore } from "../ui/LoadMore";
import { IconSearch } from "../ui/icons";

const PAGE = 100; // cuántos productos por "tanda" (botón Cargar más)

// Categorías disponibles en el desplegable (valor exacto guardado : etiqueta).
const CATEGORIAS = [
  { value: "Lacteos", label: "Lácteos" },
  { value: "Abarrotes", label: "Abarrotes" },
  { value: "Embutidos", label: "Embutidos" },
  { value: "Vinos Y Licores", label: "Vinos y Licores" },
  { value: "Sys", label: "Sys" },
];

export default async function ProductosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; n?: string }>;
}) {
  const { q, n } = await searchParams;
  // `n` = cuántas filas mostrar (crece con "Cargar más"). Mín. una tanda.
  const limit = Math.max(PAGE, Math.min(Number(n) || PAGE, 5000));
  const supabase = await createClient();

  let query = supabase
    .from("productos")
    .select("codigo, nombre_web, categoria, precio_final, web", { count: "exact" })
    .order("nombre_web", { ascending: true })
    .limit(limit);
  if (q) query = query.or(`nombre_web.ilike.%${q}%,codigo.ilike.%${q}%`);

  const { data: productos, count } = await query;
  const rows = productos ?? [];
  const total = count ?? 0;
  const restantes = total - rows.length;

  return (
    <>
      <div className="admin-enter flex flex-wrap items-end justify-between gap-3">
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
          <div className="relative">
            <IconSearch
              width={18}
              height={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre o código…"
              className="w-64 rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
            />
          </div>
          <button className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white outline-none transition-all duration-150 hover:bg-[#0c2c54] focus-visible:ring-2 focus-visible:ring-[#0A2240]/40 active:scale-[0.97]">
            Buscar
          </button>
        </form>
      </div>

      <div className="admin-enter mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]" style={{ "--i": 1 } as React.CSSProperties}>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 w-32">Precio</th>
              <th className="px-4 py-3 w-16">Web</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p.codigo} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-2 font-mono text-xs text-slate-500">
                  {p.codigo}
                </td>
                <td colSpan={5} className="p-0">
                  <RowForm
                    action={updateProducto}
                    savedMessage={`Guardado: ${p.nombre_web}`}
                    className="grid grid-cols-[1fr_160px_120px_48px_88px] items-center gap-2 px-4 py-2"
                  >
                    <input type="hidden" name="codigo" value={p.codigo} />
                    <input
                      name="nombre_web"
                      defaultValue={p.nombre_web}
                      className="rounded-md border border-slate-200 px-2 py-1.5 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
                    />
                    <select
                      name="categoria"
                      defaultValue={p.categoria ?? ""}
                      className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1.5 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
                    >
                      <option value="">— Sin categoría —</option>
                      {CATEGORIAS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                      {/* Si el producto trae una categoría fuera de la lista,
                          la conservamos como opción para no perderla al guardar. */}
                      {p.categoria &&
                        !CATEGORIAS.some((c) => c.value === p.categoria) && (
                          <option value={p.categoria}>{p.categoria}</option>
                        )}
                    </select>
                    <input
                      name="precio_final"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={Number(p.precio_final)}
                      className="rounded-md border border-slate-200 px-2 py-1.5 text-right outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
                    />
                    <ToggleSwitch
                      name="web"
                      defaultChecked={p.web}
                      title="Mostrar en la web"
                    />
                    <SaveButton className="px-3 py-1.5 text-xs" />
                  </RowForm>
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
        {restantes > 0 && (
          <LoadMore q={q} next={rows.length + PAGE} restantes={restantes} />
        )}
      </div>
    </>
  );
}
