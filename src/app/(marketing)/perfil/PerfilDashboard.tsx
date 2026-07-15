"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Dashboard del portal de cliente, reconstruido en React. Se monta DENTRO del
// marco público (navbar/footer) vía createPortal sobre #perfil-react-root.
// UI en Tailwind puro, mismo lenguaje editorial que el resto del sitio
// (sin tarjetas, sin íconos SVG decorativos, separadores finos).

type Item = {
  codigo: string | null;
  nombre: string;
  precio: number | null;
  cantidad: number;
};
type Order = {
  folio: string;
  fechaISO: string;
  fecha: string;
  total: number;
  status: string;
  resumen: string;
  items: Item[];
};
type TopProducto = {
  codigo: string | null;
  nombre: string;
  cantidad: number;
  veces: number;
};
type PortalData = {
  authenticated: boolean;
  registered: boolean;
  user?: {
    nombre: string | null;
    email: string;
    estatus: string;
    nivel: string | null;
    role: string;
    isAdmin: boolean;
    esSocio: boolean;
    memberSince: string;
  };
  kpis?: {
    gastoMes: number;
    ordenesMes: number;
    gastoTotal: number;
    totalPedidos: number;
  };
  topProductos?: TopProducto[];
  history?: Order[];
  savedCartCount?: number;
};

const WA_ASESOR = "https://wa.me/522298477440";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

function chipClasses(status: string): string {
  if (status.includes("Entregado")) return "bg-emerald-50 text-emerald-700";
  if (
    status.includes("Ruta") ||
    status.includes("Espera") ||
    status.includes("Cola")
  )
    return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function greetingFor(name: string | null): string {
  const h = new Date().getHours();
  const saludo =
    h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  const first = (name || "").trim().split(/\s+/)[0] || "Cliente";
  return `${saludo}, ${first}.`;
}

function initials(name: string | null, email?: string): string {
  const base = (name || email || "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

// "Repetir pedido" / "Cargar al carrito": vuelca los items al carrito local
// (mismo formato que el catálogo: Map → [[codigo,{name,price,qty}],...]) y a la
// nube, luego abre el catálogo. Hace MERGE con lo que ya haya en el carrito.
async function cargarAlCarrito(items: Item[]) {
  const conCodigo = items.filter((it) => it.codigo);
  if (!conCodigo.length) {
    alert("Este pedido no tiene productos vinculados al catálogo.");
    return;
  }
  let cart: Map<string, { name: string; price: number; qty: number }>;
  try {
    cart = new Map(JSON.parse(localStorage.getItem("zarcoCartObjects") || "[]"));
  } catch {
    cart = new Map();
  }
  for (const it of conCodigo) {
    cart.set(it.codigo as string, {
      name: it.nombre,
      price: Number(it.precio) || 0,
      qty: it.cantidad,
    });
  }
  const serialized = JSON.stringify(Array.from(cart.entries()));
  localStorage.setItem("zarcoCartObjects", serialized);
  // Sincroniza a la nube (best-effort; no bloquea la navegación).
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: serialized }),
    });
  } catch {
    /* el catálogo re-sincroniza igual */
  }
  window.location.href = "/catalogo";
}

// "Descargar nota": abre una ventana imprimible (PDF vía "Guardar como PDF").
function descargarNota(order: Order, nombreCliente: string | null) {
  const filas = order.items
    .map(
      (it) => `<tr>
        <td>${it.cantidad}</td>
        <td>${escapeHtml(it.nombre)}</td>
        <td>${it.codigo ? escapeHtml(it.codigo) : "—"}</td>
        <td style="text-align:right">${
          it.precio == null ? "—" : mxn.format(it.precio)
        }</td>
        <td style="text-align:right">${
          it.precio == null ? "—" : mxn.format(it.precio * it.cantidad)
        }</td>
      </tr>`
    )
    .join("");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <title>Nota ${escapeHtml(order.folio)} — El Zarco</title>
    <style>
      *{font-family:Inter,Arial,sans-serif;color:#0F172A}
      body{padding:40px;max-width:720px;margin:0 auto}
      h1{color:#0A2240;margin:0 0 4px}
      .muted{color:#64748B;font-size:13px}
      .head{display:flex;justify-content:space-between;border-bottom:3px solid #0A2240;padding-bottom:16px;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
      th{background:#0A2240;color:#fff;text-align:left;padding:8px;font-size:11px;text-transform:uppercase}
      td{padding:8px;border-bottom:1px solid #E2E8F0}
      .total{text-align:right;font-size:18px;font-weight:900;color:#A81200;margin-top:16px}
      .badge{display:inline-block;background:#F1F5F9;color:#64748B;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:800;text-transform:uppercase}
    </style></head><body>
    <div class="head">
      <div><h1>EL ZARCO</h1><div class="muted">Distribuidora de abarrotes B2B</div></div>
      <div style="text-align:right">
        <div style="font-weight:900;font-size:18px">${escapeHtml(order.folio)}</div>
        <div class="muted">${escapeHtml(order.fecha)}</div>
        <div style="margin-top:6px"><span class="badge">${escapeHtml(order.status)}</span></div>
      </div>
    </div>
    <div class="muted">Cliente</div>
    <div style="font-weight:700;margin-bottom:8px">${escapeHtml(nombreCliente || "—")}</div>
    <table>
      <thead><tr><th>Cant.</th><th>Producto</th><th>Código</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Importe</th></tr></thead>
      <tbody>${filas || `<tr><td colspan="5">Sin detalle de productos.</td></tr>`}</tbody>
    </table>
    <div class="total">Total: ${mxn.format(order.total)}</div>
    <div class="muted" style="margin-top:32px">Gracias por tu preferencia · Central de Abasto CDMX, Local 2-85 F · (55) 229-847-7440</div>
    <script>window.onload=function(){window.print()}</script>
    </body></html>`;
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) {
    alert("Permite las ventanas emergentes para descargar la nota.");
    return;
  }
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      (({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }) as Record<string, string>)[c]
  );
}

function logout() {
  const f = document.createElement("form");
  f.method = "post";
  f.action = "/auth/signout";
  document.body.appendChild(f);
  f.submit();
}

async function googleLogin() {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent("/perfil")}&popup=1`,
      skipBrowserRedirect: true,
    },
  });
  if (error || !data?.url) {
    alert("No se pudo iniciar sesión. Intenta de nuevo.");
    return;
  }
  const w = 480,
    h = 640;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2;
  const popup = window.open(
    data.url,
    "zarco-login",
    `width=${w},height=${h},left=${left},top=${top}`
  );
  if (!popup) {
    window.location.href = data.url;
    return;
  }
  const onMessage = (e: MessageEvent) => {
    if (e.origin !== window.location.origin || e.data !== "zarco-auth-done")
      return;
    window.removeEventListener("message", onMessage);
    window.location.reload();
  };
  window.addEventListener("message", onMessage);
}

// false en el servidor, true tras el primer render en cliente — sin setState
// en effect (evita renders en cascada y satisface react-hooks/set-state-in-effect).
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function PerfilDashboard() {
  const mounted = useMounted();
  if (!mounted) return null;
  const root = document.getElementById("perfil-react-root");
  if (!root) return null;
  return createPortal(<Dashboard />, root);
}

function Dashboard() {
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/portal")
      .then(async (r) => {
        // 401 = sin sesión → también devuelve JSON con authenticated:false
        const json = (await r.json().catch(() => null)) as PortalData | null;
        if (alive) setData(json ?? { authenticated: false, registered: false });
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const history = data?.history ?? [];
  const filtered = useMemo(() => {
    const list = data?.history ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (o) =>
        o.folio.toLowerCase().includes(q) ||
        o.resumen.toLowerCase().includes(q)
    );
  }, [data, query]);

  // --- Estados de carga / error / sin sesión ---
  if (error) {
    return (
      <Shell>
        <p className="py-16 text-center text-[0.95rem] text-slate-500">
          No pudimos cargar tu portal. Revisa tu conexión e inténtalo de nuevo.
        </p>
      </Shell>
    );
  }
  if (!data) return <DashboardSkeleton />;

  if (!data.authenticated || !data.registered || !data.user) {
    return <LoginGate />;
  }

  const { user, kpis, topProductos = [] } = data;
  const estrella = topProductos[0];
  const ultimo = history[0];

  const metrics = [
    { label: "Gasto del mes", value: mxn.format(kpis?.gastoMes ?? 0) },
    { label: "Órdenes este mes", value: String(kpis?.ordenesMes ?? 0) },
    { label: "Total de pedidos", value: String(kpis?.totalPedidos ?? 0) },
    {
      label: "Producto estrella",
      value: estrella ? estrella.nombre : "Ninguno",
      accent: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1250px]">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-[0.75rem] font-bold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Conexión Segura
            </span>
            <span className="rounded bg-brand-navy px-2 py-1 text-[0.7rem] font-extrabold tracking-[0.5px] text-white uppercase">
              {user.esSocio ? "Socio Comercial" : "Cliente Nuevo"}
            </span>
          </div>
          <h1 className="mb-1 text-[2rem] leading-[1.1] font-black tracking-[-1px] text-brand-navy lg:text-[2.6rem]">
            {greetingFor(user.nombre)}
          </h1>
          <p className="text-[1.05rem] font-medium text-slate-600">
            Panel operativo y control de abasto comercial.
          </p>
        </div>
        {/* Recarga completa a propósito: el catálogo reinicializa sus
            scripts al cargar (convención del sitio). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/catalogo"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-[0.85rem] font-black tracking-[0.5px] text-white uppercase transition-all hover:-translate-y-0.5 hover:bg-brand-red-dark"
        >
          + Nueva Requisición
        </a>
      </header>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
        {/* Sidebar */}
        <aside className="flex flex-col gap-10">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-red text-[1.05rem] font-black tracking-[0.5px] text-white">
                {initials(user.nombre, user.email)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-[1.05rem] font-black text-brand-navy">
                  {user.nombre || "Cliente"}
                </h2>
                <p className="truncate text-[0.85rem] font-medium text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 py-2.5 text-[0.85rem]">
              <span className="font-semibold text-slate-500">Estatus</span>
              <strong className="font-extrabold text-brand-navy">{user.estatus}</strong>
            </div>
            {user.nivel && (
              <div className="flex items-center justify-between border-t border-slate-200 py-2.5 text-[0.85rem]">
                <span className="font-semibold text-slate-500">Nivel</span>
                <strong className="font-extrabold text-brand-navy">{user.nivel}</strong>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-b border-slate-200 py-2.5 text-[0.85rem]">
              <span className="font-semibold text-slate-500">Cliente desde</span>
              <strong className="font-extrabold text-brand-navy">
                {new Date(user.memberSince).toLocaleDateString("es-MX", {
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </div>
            {user.isAdmin && (
              // Recarga completa: /admin es una app Tailwind separada.
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a
                href="/admin"
                className="mt-4 block text-center text-[0.82rem] font-extrabold text-brand-red hover:underline"
              >
                Panel administrativo →
              </a>
            )}
            <button
              onClick={logout}
              className="mt-4 w-full text-center text-[0.85rem] font-bold text-slate-500 transition-colors hover:text-brand-red"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <span className="mb-3 block text-[0.75rem] font-extrabold tracking-[1px] text-slate-400 uppercase">
              Asistencia Matriz
            </span>
            <h3 className="mb-2 text-[1.1rem] font-black text-brand-navy">Equipo de Ventas</h3>
            <p className="mb-5 text-[0.9rem] leading-[1.5] text-slate-600">
              Cotiza volúmenes por tarima o resuelve dudas operativas directo con nosotros.
            </p>
            <a
              href={WA_ASESOR}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 rounded-full bg-brand-green py-3.5 text-[0.9rem] font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#20ba56]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.64-1.653-1.938-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              Mandar WhatsApp
            </a>
          </div>
        </aside>

        {/* Contenido */}
        <div className="flex flex-col gap-12">
          {/* KPIs reales */}
          <div className="grid grid-cols-2 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
            {metrics.map((m) => (
              <div key={m.label} className="py-4 pr-4 sm:px-6 sm:py-2 sm:first:pl-0">
                <span className="mb-1 block text-[0.7rem] font-extrabold tracking-[0.5px] text-slate-400 uppercase">
                  {m.label}
                </span>
                <span
                  className={`block truncate text-[1.3rem] font-black tracking-[-0.5px] ${
                    m.accent ? "text-brand-red" : "text-brand-navy"
                  }`}
                  title={m.value}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Requisición frecuente = items del último pedido */}
          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-[1.3rem] font-black tracking-[-0.5px] text-brand-navy">
                  Requisición Frecuente
                </h2>
                <p className="mt-1 text-[0.9rem] text-slate-500">
                  Tu último pedido, listo para reabastecer en un clic.
                </p>
              </div>
              {ultimo && ultimo.items.length > 0 && (
                <button
                  onClick={() => cargarAlCarrito(ultimo.items)}
                  className="rounded-full bg-brand-navy px-6 py-2.5 text-[0.8rem] font-extrabold tracking-[0.5px] text-white uppercase transition-colors hover:bg-brand-navy-light"
                >
                  Cargar al carrito
                </button>
              )}
            </div>
            {!ultimo || ultimo.items.length === 0 ? (
              <p className="py-10 text-center text-[0.95rem] font-medium text-slate-500">
                Tus productos frecuentes aparecerán aquí después de tu primer pedido.
              </p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {ultimo.items.slice(0, 5).map((it, i) => (
                  <li key={`${it.codigo}-${i}`} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <strong className="block truncate text-[0.95rem] font-bold text-brand-navy">
                        {it.nombre}
                      </strong>
                      <span className="text-[0.8rem] font-medium text-slate-500">
                        {it.codigo ? `${it.codigo} · ` : ""}Última compra
                      </span>
                    </div>
                    <span className="shrink-0 text-[0.95rem] font-black text-brand-red">
                      {it.cantidad}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Historial con detalle expandible */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <h2 className="text-[1.3rem] font-black tracking-[-0.5px] text-brand-navy">
                Historial Operativo
              </h2>
              <input
                type="text"
                placeholder="Buscar folio o producto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full max-w-[260px] border-b border-slate-300 bg-transparent py-2 text-[0.9rem] text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-navy"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="py-10 text-center text-[0.95rem] font-medium text-slate-500">
                {history.length === 0
                  ? "No hay pedidos registrados todavía."
                  : "Sin resultados para tu búsqueda."}
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {filtered.map((o) => (
                  <FilaPedido
                    key={o.folio}
                    order={o}
                    isOpen={open === o.folio}
                    onToggle={() =>
                      setOpen((cur) => (cur === o.folio ? null : o.folio))
                    }
                    nombreCliente={user.nombre}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilaPedido({
  order,
  isOpen,
  onToggle,
  nombreCliente,
}: {
  order: Order;
  isOpen: boolean;
  onToggle: () => void;
  nombreCliente: string | null;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="grid w-full grid-cols-2 items-center gap-x-4 gap-y-2 py-4 text-left sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      >
        <span className="text-[0.95rem] font-black text-brand-navy">{order.folio}</span>
        <span className="text-[0.9rem] text-slate-600">{order.fecha}</span>
        <span className="text-[0.95rem] font-bold text-brand-navy">{mxn.format(order.total)}</span>
        <span>
          <span
            className={`inline-block rounded px-2.5 py-1 text-[0.7rem] font-extrabold uppercase ${chipClasses(order.status)}`}
          >
            {order.status}
          </span>
        </span>
        <span className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1">
          <span className="text-[0.85rem] font-bold text-brand-red">
            {isOpen ? "Ocultar" : "Detalle"}
          </span>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-base font-light transition-all duration-300 ${
              isOpen
                ? "rotate-45 border-brand-red bg-brand-red text-white"
                : "border-slate-200 text-slate-400"
            }`}
          >
            +
          </span>
        </span>
      </button>
      {isOpen && (
        <div className="pb-6">
          {order.items.length === 0 ? (
            <p className="text-[0.9rem] text-slate-500">
              Este pedido no tiene detalle de productos guardado.
            </p>
          ) : (
            <table className="w-full border-collapse text-[0.85rem]">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 py-2 text-left text-[0.7rem] font-extrabold tracking-[0.5px] text-slate-400 uppercase">
                    Cant.
                  </th>
                  <th className="border-b border-slate-200 py-2 text-left text-[0.7rem] font-extrabold tracking-[0.5px] text-slate-400 uppercase">
                    Producto
                  </th>
                  <th className="border-b border-slate-200 py-2 text-right text-[0.7rem] font-extrabold tracking-[0.5px] text-slate-400 uppercase">
                    P. Unit.
                  </th>
                  <th className="border-b border-slate-200 py-2 text-right text-[0.7rem] font-extrabold tracking-[0.5px] text-slate-400 uppercase">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={`${it.codigo}-${i}`}>
                    <td className="border-b border-slate-100 py-2">{it.cantidad}</td>
                    <td className="border-b border-slate-100 py-2">{it.nombre}</td>
                    <td className="border-b border-slate-100 py-2 text-right">
                      {it.precio == null ? "—" : mxn.format(it.precio)}
                    </td>
                    <td className="border-b border-slate-100 py-2 text-right">
                      {it.precio == null ? "—" : mxn.format(it.precio * it.cantidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                cargarAlCarrito(order.items);
              }}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-[0.8rem] font-extrabold tracking-[0.5px] text-white uppercase transition-colors hover:bg-brand-navy-light"
            >
              Repetir pedido
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                descargarNota(order, nombreCliente);
              }}
              className="rounded-full border border-slate-300 px-6 py-2.5 text-[0.8rem] font-extrabold tracking-[0.5px] text-brand-navy uppercase transition-colors hover:border-brand-navy"
            >
              Descargar nota
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1250px]">{children}</div>;
}

function LoginGate() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[440px] flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="flex items-center gap-1.5 text-[0.75rem] font-bold text-emerald-600">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Conexión Segura
      </span>
      <h1 className="text-[1.6rem] font-black tracking-[-0.5px] text-brand-navy">
        Acceso a Socios Comerciales
      </h1>
      <p className="text-[0.95rem] text-slate-500">
        Ingresa con tu cuenta de Google para ver tu historial, repetir pedidos y
        gestionar el abasto de tu negocio.
      </p>
      <button
        onClick={googleLogin}
        className="mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-brand-red py-3.5 text-[0.9rem] font-black tracking-[0.5px] text-white uppercase transition-all hover:-translate-y-0.5 hover:bg-brand-red-dark"
      >
        <svg width="18" viewBox="0 0 24 24">
          <path
            fill="#fff"
            d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.4-1.64 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.46 3.36 14.43 2.5 12.17 2.5 6.92 2.5 2.67 6.75 2.67 12s4.25 9.5 9.5 9.5c5.48 0 9.11-3.85 9.11-9.28 0-.62-.07-1.1-.93-1.12z"
          />
        </svg>
        Iniciar sesión con Google
      </button>
      <small className="text-[0.75rem] text-slate-400">
        Registro abierto · conexión cifrada de extremo a extremo
      </small>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1250px] animate-pulse">
      <div className="mb-10 border-b border-slate-200 pb-6">
        <div className="mb-4 h-5 w-40 rounded bg-slate-200" />
        <div className="mb-2 h-9 w-72 rounded bg-slate-200" />
        <div className="h-4 w-48 rounded bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <div className="h-56 rounded bg-slate-100" />
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded bg-slate-100" />
            ))}
          </div>
          <div className="h-40 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
