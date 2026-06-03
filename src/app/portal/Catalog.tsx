"use client";

import { useMemo, useState } from "react";
import type { CartItem, CatalogProduct } from "@/lib/matriz";
import { mxn } from "./format";

const PAGE_SIZE = 24;

type Sort = "original" | "name-asc" | "price-asc" | "price-desc";

export default function Catalog({
  catalog,
  cart,
  onAdd,
}: {
  catalog: CatalogProduct[];
  cart: Record<string, CartItem>;
  onAdd: (p: CatalogProduct, qty: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [unit, setUnit] = useState("all");
  const [sort, setSort] = useState<Sort>("original");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [...new Set(catalog.map((p) => p.category).filter(Boolean))].sort(),
    [catalog]
  );
  const units = useMemo(
    () => [...new Set(catalog.map((p) => p.unit).filter(Boolean))].sort(),
    [catalog]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const out = catalog.filter((p) => {
      const matchText =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term);
      const matchCat = category === "all" || p.category === category;
      const matchUnit = unit === "all" || p.unit === unit;
      return matchText && matchCat && matchUnit;
    });
    const sorted = [...out];
    if (sort === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [catalog, search, category, unit, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Al cambiar cualquier filtro, regresa a la página 1.
  const resetTo1 = () => setPage(1);

  return (
    <section
      id="catalogo-portal"
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-brand-navy">
          Catálogo{" "}
          <span className="text-sm font-semibold text-slate-400">
            {filtered.length} productos
          </span>
        </h2>
      </div>

      {/* Controles */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetTo1();
          }}
          placeholder="Buscar producto, código o marca…"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-navy sm:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            resetTo1();
          }}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        >
          <option value="original">Orden sugerido</option>
          <option value="name-asc">Nombre (A→Z)</option>
          <option value="price-asc">Precio (menor)</option>
          <option value="price-desc">Precio (mayor)</option>
        </select>
      </div>

      {units.length > 1 && (
        <div className="mt-3">
          <select
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              resetTo1();
            }}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          >
            <option value="all">Todas las unidades</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Lista */}
      <div id="productBody" className="mt-5 divide-y divide-slate-100">
        {pageItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No hay resultados para esta búsqueda.
          </p>
        ) : (
          pageItems.map((p) => (
            <ProductRow
              key={p.code}
              product={p}
              inCart={cart[p.code]?.qty ?? 0}
              onAdd={onAdd}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-brand-navy disabled:opacity-40"
          >
            ‹ Anterior
          </button>
          <span className="text-sm font-semibold text-slate-500">
            {safePage} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-brand-navy disabled:opacity-40"
          >
            Siguiente ›
          </button>
        </div>
      )}
    </section>
  );
}

function ProductRow({
  product,
  inCart,
  onAdd,
}: {
  product: CatalogProduct;
  inCart: number;
  onAdd: (p: CatalogProduct, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">{product.name}</p>
        <p className="text-xs text-slate-400">
          {product.code}
          {product.brand ? ` · ${product.brand}` : ""} ·{" "}
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">
            {product.category}
          </span>{" "}
          · {product.unit}
        </p>
      </div>
      <div className="text-right">
        <p className="font-black text-brand-navy">{mxn(product.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm outline-none focus:border-brand-navy"
        />
        <button
          onClick={() => onAdd(product, qty)}
          className="rounded-lg bg-brand-navy px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-125"
        >
          {inCart > 0 ? `✓ ${inCart}` : "+ Añadir"}
        </button>
      </div>
    </div>
  );
}
