"use client";

import { useEffect, useMemo, useState } from "react";
import { useZarcoAuth } from "../useZarcoAuth";
import Reveal from "../Reveal";
import { useCatalogCart } from "./useCatalogCart";
import { useToasts } from "./useToasts";

type InventoryRow = {
  CODIGO: string;
  "NOMBRE PARA WEB": string;
  MARCA: string | null;
  CATEGORIA: string | null;
  "UNIDAD DE MEDIDA": string | null;
  "PRECIO FINAL": number;
};

type Product = {
  id: string;
  name: string;
  categoryLabel: string;
  categoryId: string;
  unit: string;
  priceNum: number;
  originalIndex: number;
};

const ITEMS_PER_PAGE = 25;

const CATEGORY_FILTERS = [
  { id: "all", label: "Inventario Total" },
  { id: "lacteos", label: "Lácteos & Cremería" },
  { id: "embutidos", label: "Embutidos & Carnes" },
  { id: "abarrotes", label: "Abarrotes Básicos" },
  { id: "gourmet", label: "Vinos & Gourmet" },
];

const mxn = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function matchesCategory(catExcel: string, categoryId: string, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "lacteos")
    return /queso|crema|lacteo|lácteo|yogurt|mantequilla/.test(catExcel);
  if (filter === "embutidos")
    return /carne|embutido|jamon|jamón|salchicha|tocino|pavo/.test(catExcel);
  if (filter === "abarrotes") return /abarrote|aceite|chile|mayonesa/.test(catExcel);
  if (filter === "gourmet") return /gourmet|vino|delicatessen|salami/.test(catExcel);
  return categoryId.includes(filter);
}

function categoryBadgeClass(catExcel: string): string {
  const c = catExcel.toLowerCase();
  if (/queso|crema|lacteo|lácteo|yogurt|mantequilla/.test(c)) return "bg-sky-50 text-sky-700";
  if (/carne|embutido|jamon|jamón|salchicha|tocino|pavo/.test(c)) return "bg-rose-50 text-rose-700";
  if (/abarrote|aceite|chile|mayonesa/.test(c)) return "bg-emerald-50 text-emerald-700";
  if (/gourmet|vino|delicatessen|salami/.test(c)) return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function highlight(text: string, term: string) {
  if (!term) return text;
  const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span key={i} className="bg-amber-200/70 text-brand-navy">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function CatalogApp() {
  const { user, login } = useZarcoAuth();
  const isLoggedIn = !!user;
  const { cart, addItem, removeItem, updateQty, clear } = useCatalogCart(isLoggedIn);
  const { toasts, showToast } = useToasts();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("original");
  const [unit, setUnit] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/inventory")
      .then((r) => {
        if (!r.ok) throw new Error("inventory fetch failed");
        return r.json();
      })
      .then((data: InventoryRow[]) => {
        const mapped: Product[] = data
          .map((item, index) => {
            const priceRaw = item["PRECIO FINAL"];
            const priceNum =
              typeof priceRaw === "string" ? parseFloat(priceRaw) || 0 : Number(priceRaw) || 0;
            const catText = String(item.CATEGORIA || "General");
            return {
              id: String(item.CODIGO || "S/N"),
              name: String(item["NOMBRE PARA WEB"] || "Producto Desconocido"),
              categoryLabel: catText,
              categoryId: catText.toLowerCase().replace(/\s+/g, ""),
              unit: String(item["UNIDAD DE MEDIDA"] || "Pieza"),
              priceNum,
              originalIndex: index,
            };
          })
          .filter((p) => p.name !== "Producto Desconocido" && p.priceNum > 0);
        setProducts(mapped);
      })
      .catch(() => setLoadError(true));
  }, []);

  const units = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.unit))].filter(Boolean).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    const term = search.toLowerCase();
    let list = products.filter((p) => {
      const matchText =
        p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term);
      const matchUnit = unit === "all" || p.unit === unit;
      const matchCat = matchesCategory(p.categoryLabel.toLowerCase(), p.categoryId, category);
      return matchText && matchUnit && matchCat;
    });
    list = [...list].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.priceNum - b.priceNum;
      if (sort === "price-desc") return b.priceNum - a.priceNum;
      return a.originalIndex - b.originalIndex;
    });
    return list;
  }, [products, search, unit, category, sort]);

  useEffect(() => setPage(1), [search, unit, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const scrollToTable = () => {
    document.getElementById("catalog-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cartTotal = useMemo(() => {
    let sum = 0;
    let qty = 0;
    cart.forEach((item) => {
      sum += item.price * item.qty;
      qty += item.qty;
    });
    return { sum, qty };
  }, [cart]);

  const toggleProduct = (p: Product, qty: number) => {
    if (cart.has(p.id)) {
      removeItem(p.id);
    } else {
      addItem(p.id, p.name, p.priceNum, qty);
      showToast(`${qty}x Agregado a la requisición`);
    }
  };

  const selectAll = (checked: boolean) => {
    pageItems.forEach((p) => {
      if (checked && !cart.has(p.id)) addItem(p.id, p.name, p.priceNum, 1);
      if (!checked && cart.has(p.id)) removeItem(p.id);
    });
    if (checked) showToast(`${pageItems.length} productos agregados`);
  };

  const handleCheckout = async () => {
    if (!user) {
      showToast("Inicia sesión para enviar tu pedido.");
      setCartOpen(false);
      login();
      return;
    }
    setSending(true);
    let msg = `Hola Matriz El Zarco, soy *${user.name || user.email}*.\n\nSolicito la cotización formal de la siguiente requisición armada en el Portal B2B:\n\n`;
    let resumen = "";
    cart.forEach((item, id) => {
      const total = item.price * item.qty;
      msg += `🔸 ${item.qty}x ${item.name} (Cod: ${id}) - $${mxn.format(total)}\n`;
      resumen += `${item.qty}x ${item.name} (${id}), `;
    });
    msg += `\n*TOTAL ESTIMADO:* $${mxn.format(cartTotal.sum)} MXN\n\nQuedo a la espera de la confirmación operativa.`;

    try {
      const r = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({ resumen: resumen.slice(0, -2), total: cartTotal.sum }),
      });
      const result = await r.json();
      if (result.status === "Success") {
        msg = msg.replace(
          "Solicito la cotización",
          `*REQUISICIÓN ${result.folio}*\n\nSolicito la cotización`
        );
      }
    } catch {
      /* sin red: igual mandamos WhatsApp */
    }

    window.open(`https://wa.me/522298477440?text=${encodeURIComponent(msg)}`, "_blank");
    clear();
    setCartOpen(false);
    setSending(false);
    showToast("Cotización enviada. Revisa tu historial.");
  };

  return (
    <>
      <section className="mx-auto mb-10 w-[90%] max-w-[1300px]">
        <Reveal>
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <span className="mb-2 block text-[0.7rem] font-extrabold tracking-[3px] text-brand-red uppercase">
                Portal B2B · Mayoreo
              </span>
              <h1 className="text-3xl font-black tracking-[-1px] text-brand-navy lg:text-5xl">
                Inventario <span className="text-brand-red">Central</span>
              </h1>
              <p className="mt-2 max-w-lg text-slate-500">
                Selecciona tus productos del catálogo completo y arma tu
                requisición al instante.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-[0_4px_15px_rgba(10,34,64,0.04)] lg:self-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[0.7rem] font-extrabold tracking-wide text-slate-400 uppercase">
                Matriz Online
              </span>
              <span className="text-[0.7rem] font-extrabold text-brand-navy">
                {products
                  ? `· ${products.length} artículos`
                  : loadError
                    ? "· Fuera de línea"
                    : "· Sincronizando..."}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_10px_40px_rgba(10,34,64,0.06)] sm:p-7">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-3.5 transition-all focus-within:border-brand-red/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(168,18,0,0.08)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="h-4 w-4 shrink-0 text-brand-navy/40"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por producto o marca (Ej. Queso, Tocino)..."
                className="w-full bg-transparent text-sm text-brand-navy outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Limpiar búsqueda"
                  className="shrink-0 text-lg leading-none text-slate-300 transition-colors hover:text-brand-red"
                >
                  ×
                </button>
              )}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-extrabold tracking-wide text-slate-400 uppercase">
                  <span className="h-1 w-1 rounded-full bg-brand-red" />
                  Ordenar Inventario
                </label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-bold text-brand-navy outline-none transition-colors hover:border-slate-300 focus:border-brand-red focus:bg-white"
                  >
                    <option value="original">Predeterminado</option>
                    <option value="name-asc">Alfabético (A-Z)</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 text-slate-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-extrabold tracking-wide text-slate-400 uppercase">
                  <span className="h-1 w-1 rounded-full bg-brand-red" />
                  Unidad de Medida
                </label>
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-bold text-brand-navy outline-none transition-colors hover:border-slate-300 focus:border-brand-red focus:bg-white"
                  >
                    <option value="all">Todas las Unidades</option>
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 text-slate-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <ul className="flex flex-wrap items-center gap-2">
              {CATEGORY_FILTERS.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setCategory(f.id)}
                    className={`block rounded-full px-5 py-2.5 text-[0.7rem] font-extrabold tracking-[1px] whitespace-nowrap uppercase transition-all duration-300 ${
                      category === f.id
                        ? "bg-brand-navy text-white shadow-[0_8px_20px_rgba(10,34,64,0.25)]"
                        : "border border-slate-100 bg-slate-50 text-slate-500 hover:border-brand-red/20 hover:bg-brand-red/5 hover:text-brand-red"
                    }`}
                  >
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section id="catalog-table" className="mx-auto mb-8 w-[90%] max-w-[1300px]">
        <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_10px_40px_rgba(10,34,64,0.06)]">
          <div className="hidden grid-cols-[44px_100px_2fr_1fr_80px_130px_170px] items-center gap-3 bg-brand-navy px-5 py-4 text-[0.7rem] font-extrabold tracking-[1.5px] text-white/60 uppercase lg:grid">
            <div className="flex justify-center">
              <input
                type="checkbox"
                onChange={(e) => selectAll(e.target.checked)}
                className="h-4 w-4 accent-brand-red"
              />
            </div>
            <div>Código</div>
            <div>Producto</div>
            <div>Categoría</div>
            <div className="text-center">Und</div>
            <div className="text-right">Precio MXN</div>
            <div className="text-center">Cantidad</div>
          </div>

          <div id="productBody" className="divide-y divide-slate-100">
            {!products && !loadError && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="grid grid-cols-[44px_1fr_110px] items-center gap-3 px-5 py-3.5 lg:grid-cols-[44px_100px_2fr_1fr_80px_130px_170px]"
                  >
                    <div className="col-span-3 flex justify-center lg:col-span-1">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="hidden lg:block">
                      <div className="h-3 w-14 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div className="order-first col-span-2 lg:order-none lg:col-span-1">
                      <div
                        className="h-4 animate-pulse rounded-full bg-slate-200"
                        style={{ width: `${55 + ((i * 13) % 35)}%` }}
                      />
                    </div>
                    <div className="hidden lg:block">
                      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div className="hidden justify-center lg:flex">
                      <div className="h-3 w-10 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div className="flex justify-end">
                      <div className="h-4 w-14 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-2 lg:col-span-1 lg:justify-center">
                      <div className="h-8 w-14 animate-pulse rounded-full bg-slate-200" />
                      <div className="h-8 w-[76px] animate-pulse rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </>
            )}
            {loadError && (
              <div className="p-10 text-center text-sm font-semibold text-red-500">
                Fallo de conexión con la matriz. Intenta de nuevo más tarde.
              </div>
            )}
            {products && pageItems.length === 0 && (
              <div className="p-10 text-center text-sm font-semibold text-slate-400">
                No hay resultados para esta búsqueda.
              </div>
            )}
            {pageItems.map((p) => {
              const inCart = cart.has(p.id);
              const qty = inCart ? cart.get(p.id)!.qty : 1;
              return (
                <div
                  key={p.id}
                  className={`grid grid-cols-[44px_1fr_110px] items-center gap-3 px-5 py-3.5 transition-colors lg:grid-cols-[44px_100px_2fr_1fr_80px_130px_170px] ${
                    inCart ? "bg-emerald-50/60" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className="col-span-3 flex cursor-pointer items-center justify-center lg:col-span-1"
                    onClick={() => toggleProduct(p, qty)}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={inCart}
                      className="h-4 w-4 accent-brand-navy"
                    />
                  </div>
                  <div className="hidden text-sm font-medium text-slate-400 lg:block">
                    {highlight(p.id, search)}
                  </div>
                  <div
                    className="order-first col-span-2 cursor-pointer text-sm font-bold text-brand-navy lg:order-none lg:col-span-1"
                    onClick={() => toggleProduct(p, qty)}
                  >
                    {highlight(p.name, search)}
                    <div className="mt-1.5 flex gap-1.5 lg:hidden">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.65rem] font-extrabold uppercase ${categoryBadgeClass(p.categoryLabel)}`}
                      >
                        {p.categoryLabel}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-extrabold text-slate-500 uppercase">
                        {p.unit}
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.7rem] font-extrabold uppercase ${categoryBadgeClass(p.categoryLabel)}`}
                    >
                      {p.categoryLabel}
                    </span>
                  </div>
                  <div className="hidden text-center text-[0.7rem] font-extrabold tracking-wide text-slate-400 uppercase lg:block">
                    {p.unit}
                  </div>
                  <div className="text-right text-base font-black text-brand-red lg:text-right">
                    ${mxn.format(p.priceNum)}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2 lg:col-span-1 lg:justify-center">
                    <input
                      type="number"
                      min={1}
                      defaultValue={qty}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const n = parseInt(e.target.value) || 1;
                        if (cart.has(p.id)) updateQty(p.id, n);
                      }}
                      className="w-14 rounded-full border border-slate-200 px-2 py-1.5 text-center text-sm font-bold text-brand-navy outline-none transition-colors focus:border-brand-red"
                    />
                    <button
                      onClick={() => toggleProduct(p, qty)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase transition-all duration-200 ${
                        inCart
                          ? "bg-emerald-500 text-white shadow-[0_6px_14px_rgba(16,185,129,0.35)]"
                          : "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                      }`}
                    >
                      {inCart ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        "+ Añadir"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm font-semibold text-slate-400">
            {products ? (
              <>
                Mostrando <span className="font-extrabold text-brand-navy">{filtered.length}</span> productos
              </>
            ) : (
              "Cargando base de datos..."
            )}
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage((p) => p - 1);
                scrollToTable();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy transition-colors hover:border-brand-navy disabled:opacity-30"
            >
              ‹
            </button>
            <span className="text-sm font-extrabold text-brand-navy">
              {page} <span className="font-medium text-slate-400">de</span> {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => p + 1);
                scrollToTable();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy transition-colors hover:border-brand-navy disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-[700px] items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] p-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h3 className="mb-1 text-sm font-bold text-amber-800">Nota Importante de Precios</h3>
            <p className="text-[0.85rem] leading-tight text-amber-900/80">
              <strong>Los precios mostrados son exclusivamente de referencia.</strong>{" "}
              Debido a la constante actualización y volatilidad del mercado en
              tienda física, el total final de su pedido podría tener
              variaciones. El precio definitivo será confirmado por nuestros
              agentes al procesar su solicitud.
            </p>
          </div>
        </div>
      </section>

      {cartTotal.qty > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="group fixed bottom-5 left-1/2 z-[10000] flex -translate-x-1/2 items-center gap-3 rounded-full bg-gradient-to-br from-brand-navy to-brand-navy-light py-3 pr-5 pl-3 text-white shadow-[0_15px_35px_rgba(10,34,64,0.4)] transition-transform duration-300 hover:-translate-x-1/2 hover:-translate-y-1 sm:bottom-8"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-4.5 w-4.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[0.65rem] font-black shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              {cartTotal.qty}
            </span>
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[0.6rem] font-bold tracking-wide text-white/60 uppercase">Requisición</span>
            <span className="mt-0.5 font-black">${mxn.format(cartTotal.sum)}</span>
          </span>
        </button>
      )}

      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[2001] bg-brand-navy/40 backdrop-blur-[2px] transition-opacity ${cartOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      />
      <aside
        id="cartDrawer"
        className={`fixed top-0 right-0 z-[2002] flex h-screen w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-light p-5 text-white">
          <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" className="h-4.5 w-4.5">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </span>
                <h2 className="text-lg font-black">Tu Requisición</h2>
              </div>
              <p className="mt-1.5 text-sm text-white/60">
                Ajusta las cantidades o envía directo a Matriz.
              </p>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-white/80 transition-colors hover:bg-white/20"
            >
              ×
            </button>
          </div>
          {cart.size > 0 && (
            <button
              onClick={() => {
                clear();
                showToast("Requisición vaciada");
              }}
              className="relative mt-3 text-xs font-bold text-white/50 underline decoration-white/30 underline-offset-2 hover:text-white"
            >
              Vaciar todo
            </button>
          )}
        </div>

        <div id="cartItemsList" className="flex-1 overflow-y-auto p-5">
          {cart.size === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </span>
              <p className="font-semibold text-slate-500">Tu requisición está vacía.</p>
              <span className="text-sm">Agrega productos del inventario para comenzar.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Array.from(cart.entries()).map(([id, item]) => (
                <div
                  key={id}
                  id={`cart-item-${id}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:border-slate-200"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <span className="block text-sm font-bold text-brand-navy">{item.name}</span>
                      <span className="text-xs font-semibold text-slate-400">
                        ${mxn.format(item.price)} / un.
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(id)}
                      aria-label="Eliminar producto"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-brand-red/10 hover:text-brand-red"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-1">
                      <button
                        onClick={() => updateQty(id, item.qty - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateQty(id, parseInt(e.target.value) || 0)}
                        className="w-9 text-center text-sm font-bold text-brand-navy"
                      />
                      <button
                        onClick={() => updateQty(id, item.qty + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-black text-brand-red">
                      ${mxn.format(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-footer border-t border-slate-100 bg-slate-50/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Estimado (MXN)</span>
            <h3 className="text-2xl font-black text-brand-navy">${mxn.format(cartTotal.sum)}</h3>
          </div>
          <button
            disabled={cart.size === 0 || sending}
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green py-3.5 font-black tracking-wide text-white uppercase shadow-[0_10px_25px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            {sending ? "Enviando..." : "Enviar a Matriz"}
          </button>
        </div>
      </aside>

      <div className="fixed bottom-24 left-1/2 z-[3000] flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 text-emerald-400">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
