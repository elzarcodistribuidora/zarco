import { createClient } from "@/lib/supabase/server";
import { updateProducto } from "../actions";
import { RowForm } from "../ui/RowForm";
import { SaveButton } from "../ui/SaveButton";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { LoadMore } from "../ui/LoadMore";
import { IconSearch } from "../ui/icons";

import { AddProductButton } from "../ui/AddProductButton";

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
  searchParams: Promise<{
    q?: string;
    n?: string;
    cat?: string;
    min?: string;
    max?: string;
  }>;
}) {
  const { q, n, cat, min, max } = await searchParams;
  // `n` = cuántas filas mostrar (crece con "Cargar más"). Mín. una tanda.
  const limit = Math.max(PAGE, Math.min(Number(n) || PAGE, 5000));
  const minNum = Number(min);
  const maxNum = Number(max);
  const supabase = await createClient();

  let query = supabase
    .from("productos")
    .select("codigo, nombre_web, categoria, precio_final, web", { count: "exact" })
    .order("nombre_web", { ascending: true })
    .limit(limit);
  if (q) query = query.or(`nombre_web.ilike.%${q}%,codigo.ilike.%${q}%`);
  if (cat) query = query.eq("categoria", cat);
  if (min && Number.isFinite(minNum)) query = query.gte("precio_final", minNum);
  if (max && Number.isFinite(maxNum)) query = query.lte("precio_final", maxNum);

  const { data: productos, count } = await query;
  const rows = productos ?? [];
  const total = count ?? 0;
  const restantes = total - rows.length;
  const filtros = { q, cat, min, max }; // se conservan en "Cargar más"
  const hayFiltro = !!(q || cat || min || max);

  return (
    <>
      <div className="admin-enter flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0A2240]">
            Productos
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            {hayFiltro ? `${total} coinciden` : `${total} en total`} · mostrando{" "}
            {rows.length}
          </p>
        </div>
        <AddProductButton />
      </div>

      <div className="admin-enter mt-6 mb-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-slate-900/[0.02] border border-slate-100">
        <form className="flex w-full flex-wrap items-end gap-3">
          <div className="relative">
            <IconSearch
              width={18}
              height={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Nombre o código…"
              className="w-56 rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
            />
          </div>
          <select
            name="cat"
            defaultValue={cat ?? ""}
            aria-label="Filtrar por categoría"
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            name="min"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={min ?? ""}
            placeholder="$ mín"
            aria-label="Precio mínimo"
            className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
          />
          <input
            name="max"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={max ?? ""}
            placeholder="$ máx"
            aria-label="Precio máximo"
            className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15"
          />
          <button className="rounded-lg bg-[#0A2240] px-4 py-2 text-sm font-semibold text-white outline-none transition-all duration-150 hover:bg-[#0c2c54] focus-visible:ring-2 focus-visible:ring-[#0A2240]/40 active:scale-[0.97]">
            Filtrar
          </button>
          {hayFiltro && (
            <a
              href="/admin/productos"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-[#A81200]"
            >
              Limpiar
            </a>
          )}
        </form>
      </div>

      {/* Encabezado de columnas: solo en escritorio. En móvil cada producto
          es una tarjeta apilada (con sus propias etiquetas) para que nada se
          corte. */}
      <div className="mt-6 space-y-2 md:space-y-1.5">
        <div
          className="admin-enter hidden gap-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[110px_1fr_170px_120px_56px_auto] md:items-center"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <span>Código</span>
          <span>Nombre</span>
          <span>Categoría</span>
          <span className="text-right">Precio</span>
          <span className="text-center">Web</span>
          <span />
        </div>

        {rows.map((p, i) => (
          <RowForm
            key={p.codigo}
            action={updateProducto}
            savedMessage={`Guardado: ${p.nombre_web}`}
            style={{ "--i": Math.min(i + 2, 12) } as React.CSSProperties}
            className="admin-enter grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.06] md:grid-cols-[110px_1fr_170px_120px_56px_auto] md:items-center md:gap-3 md:rounded-xl md:py-2.5"
          >
            <input type="hidden" name="codigo" value={p.codigo} />
            <div className="font-mono text-xs text-slate-500">
              <span className="mr-2 font-sans font-medium uppercase tracking-wide text-slate-400 md:hidden">
                Código
              </span>
              {p.codigo}
            </div>
            <label className="block text-xs font-medium text-slate-400 md:contents">
              <span className="md:hidden">Nombre</span>
              <input
                name="nombre_web"
                defaultValue={p.nombre_web}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15 md:mt-0"
              />
            </label>
            <label className="block text-xs font-medium text-slate-400 md:contents">
              <span className="md:hidden">Categoría</span>
              <select
                name="categoria"
                defaultValue={p.categoria ?? ""}
                className="mt-1 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15 md:mt-0"
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
            </label>
            <label className="block text-xs font-medium text-slate-400 md:contents">
              <span className="md:hidden">Precio</span>
              <input
                name="precio_final"
                type="number"
                step="0.01"
                min="0"
                defaultValue={Number(p.precio_final)}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-right text-sm text-slate-900 outline-none transition focus:border-[#0A2240] focus:ring-2 focus:ring-[#0A2240]/15 md:mt-0"
              />
            </label>
            <label className="flex items-center justify-between gap-2 text-xs font-medium text-slate-400 md:contents">
              <span className="md:hidden">Mostrar en la web</span>
              <ToggleSwitch
                name="web"
                defaultChecked={p.web}
                title="Mostrar en la web"
              />
            </label>
            <SaveButton className="w-full px-3 py-1.5 text-xs md:w-auto" />
          </RowForm>
        ))}

        {rows.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
            Sin resultados.
          </p>
        )}
        {restantes > 0 && (
          <div className="pt-1">
            <LoadMore
              params={filtros}
              next={rows.length + PAGE}
              restantes={restantes}
            />
          </div>
        )}
      </div>
    </>
  );
}
