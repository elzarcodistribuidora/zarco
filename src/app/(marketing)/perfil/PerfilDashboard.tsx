"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Dashboard del portal de cliente, reconstruido en React. Se monta DENTRO del
// marco público de Webflow (navbar/footer intactos) vía createPortal sobre
// #perfil-react-root. Reusa las clases del CSS de Webflow (.card, .metric-box,
// .b2b-table, .status-chip, .chip-*) + estilos propios (prx-*) para lo nuevo.

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

function chipClass(status: string): string {
  if (status.includes("Entregado")) return "chip-green";
  if (
    status.includes("Ruta") ||
    status.includes("Espera") ||
    status.includes("Cola")
  )
    return "chip-yellow";
  return "chip-gray";
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
        <div className="card prx-state">
          <p>No pudimos cargar tu portal. Revisa tu conexión e inténtalo de nuevo.</p>
        </div>
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

  return (
    <ScopedStyles>
      <div className="dashboard-container">
        {/* Header */}
        <header className="dash-header">
          <div className="header-info">
            <div className="badge-row">
              <span className="badge-system">
                <span className="pulse-green" /> Conexión Segura
              </span>
              <span className="badge-tier">
                {user.esSocio ? "Socio Comercial" : "Cliente Nuevo"}
              </span>
            </div>
            <h1 className="dash-title">{greetingFor(user.nombre)}</h1>
            <p className="dash-subtitle">
              Panel operativo y control de abasto comercial.
            </p>
          </div>
          <div className="header-action">
            {/* Recarga completa a propósito: el catálogo reinicializa sus
                scripts de Webflow al cargar (convención del sitio). */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="btn-red-solid" href="/catalogo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              NUEVA REQUISICIÓN
            </a>
          </div>
        </header>

        <div className="dash-grid">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="card id-card">
              <div className="id-header">
                <div className="prx-avatar">{initials(user.nombre, user.email)}</div>
                <div className="id-data">
                  <h2>{user.nombre || "Cliente"}</h2>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="prx-account-meta">
                <span>Estatus</span>
                <strong>{user.estatus}</strong>
              </div>
              {user.nivel && (
                <div className="prx-account-meta">
                  <span>Nivel</span>
                  <strong>{user.nivel}</strong>
                </div>
              )}
              <div className="prx-account-meta">
                <span>Cliente desde</span>
                <strong>
                  {new Date(user.memberSince).toLocaleDateString("es-MX", {
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>
              {user.isAdmin && (
                // Recarga completa: /admin es una app Tailwind separada.
                // eslint-disable-next-line @next/next/no-html-link-for-pages
                <a className="prx-admin-link" href="/admin">
                  ⚙ Panel administrativo
                </a>
              )}
              <button className="btn-outline-gray" onClick={logout} style={{ marginTop: 12 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar Sesión
              </button>
            </div>

            <div className="card exec-card">
              <div className="exec-header">
                <div className="icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span>ASISTENCIA MATRIZ</span>
              </div>
              <h3>Equipo de Ventas</h3>
              <p>Cotiza volúmenes por tarima o resuelve dudas operativas directo con nosotros.</p>
              <a href={WA_ASESOR} target="_blank" rel="noopener" className="btn-wa-solid">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.64-1.653-1.938-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Mandar WhatsApp
              </a>
            </div>
          </aside>

          {/* Contenido */}
          <div className="dash-content">
            {/* KPIs reales */}
            <div className="prx-metrics">
              <div className="metric-box">
                <span className="m-label">GASTO DEL MES</span>
                <h3 className="m-value text-blue">{mxn.format(kpis?.gastoMes ?? 0)}</h3>
              </div>
              <div className="metric-box">
                <span className="m-label">ÓRDENES ESTE MES</span>
                <h3 className="m-value text-blue">{kpis?.ordenesMes ?? 0}</h3>
              </div>
              <div className="metric-box">
                <span className="m-label">TOTAL DE PEDIDOS</span>
                <h3 className="m-value text-blue">{kpis?.totalPedidos ?? 0}</h3>
              </div>
              <div className="metric-box">
                <span className="m-label">PRODUCTO ESTRELLA</span>
                <h3 className="m-value text-red" title={estrella?.nombre}>
                  {estrella ? estrella.nombre : "Ninguno"}
                </h3>
              </div>
            </div>

            {/* Requisición frecuente = items del último pedido */}
            <div className="card module-card">
              <div className="module-header">
                <div>
                  <h2>Requisición Frecuente</h2>
                  <p>Tu último pedido, listo para reabastecer en un clic.</p>
                </div>
                {ultimo && ultimo.items.length > 0 && (
                  <button
                    className="btn-dark-solid"
                    onClick={() => cargarAlCarrito(ultimo.items)}
                  >
                    CARGAR AL CARRITO
                  </button>
                )}
              </div>
              <div className="dynamic-list">
                {!ultimo || ultimo.items.length === 0 ? (
                  <div className="empty-state">
                    Tus productos frecuentes aparecerán aquí después de tu primer pedido.
                  </div>
                ) : (
                  ultimo.items.slice(0, 5).map((it, i) => (
                    <div className="list-row" key={`${it.codigo}-${i}`}>
                      <div className="row-info">
                        <strong>{it.nombre}</strong>
                        <span>
                          {it.codigo ? `${it.codigo} · ` : ""}Última compra
                        </span>
                      </div>
                      <div className="row-qty">{it.cantidad}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Historial con detalle expandible */}
            <div className="card module-card">
              <div className="module-header-table">
                <h2>Historial Operativo</h2>
                <div className="table-actions">
                  <div className="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar folio o producto..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="table-container">
                <table className="b2b-table">
                  <thead>
                    <tr>
                      <th>FOLIO</th>
                      <th>FECHA</th>
                      <th>TOTAL</th>
                      <th>ESTATUS</th>
                      <th>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="empty-state">
                            {history.length === 0
                              ? "No hay pedidos registrados todavía."
                              : "Sin resultados para tu búsqueda."}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((o) => (
                        <FilaPedido
                          key={o.folio}
                          order={o}
                          isOpen={open === o.folio}
                          onToggle={() =>
                            setOpen((cur) => (cur === o.folio ? null : o.folio))
                          }
                          nombreCliente={user.nombre}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScopedStyles>
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
    <>
      <tr className={`prx-row ${isOpen ? "prx-row-open" : ""}`} onClick={onToggle}>
        <td>
          <strong>{order.folio}</strong>
        </td>
        <td>{order.fecha}</td>
        <td>{mxn.format(order.total)}</td>
        <td>
          <span className={`status-chip ${chipClass(order.status)}`}>
            {order.status}
          </span>
        </td>
        <td>
          <span className="link-action">
            {isOpen ? "Ocultar" : "Detalle"}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="14"
              style={{
                transform: isOpen ? "rotate(180deg)" : "none",
                transition: "transform .2s",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </td>
      </tr>
      {isOpen && (
        <tr className="prx-detail-row">
          <td colSpan={5}>
            <div className="prx-detail">
              {order.items.length === 0 ? (
                <p className="prx-detail-empty">
                  Este pedido no tiene detalle de productos guardado.
                </p>
              ) : (
                <table className="prx-detail-table">
                  <thead>
                    <tr>
                      <th>Cant.</th>
                      <th>Producto</th>
                      <th>P. Unit.</th>
                      <th>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it, i) => (
                      <tr key={`${it.codigo}-${i}`}>
                        <td>{it.cantidad}</td>
                        <td>{it.nombre}</td>
                        <td>{it.precio == null ? "—" : mxn.format(it.precio)}</td>
                        <td>
                          {it.precio == null
                            ? "—"
                            : mxn.format(it.precio * it.cantidad)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="prx-detail-actions">
                <button
                  className="btn-dark-solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    cargarAlCarrito(order.items);
                  }}
                >
                  Repetir pedido
                </button>
                <button
                  className="prx-btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    descargarNota(order, nombreCliente);
                  }}
                >
                  Descargar nota
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ScopedStyles>
      <div className="dashboard-container">{children}</div>
    </ScopedStyles>
  );
}

function LoginGate() {
  return (
    <ScopedStyles>
      <div className="dashboard-container">
        <div className="prx-login">
          <div className="prx-login-card card">
            <span className="badge-system" style={{ alignSelf: "center" }}>
              <span className="pulse-green" /> Conexión Segura
            </span>
            <h1>Acceso a Socios Comerciales</h1>
            <p>
              Ingresa con tu cuenta de Google para ver tu historial, repetir
              pedidos y gestionar el abasto de tu negocio.
            </p>
            <button className="btn-red-solid prx-login-btn" onClick={googleLogin}>
              <svg width="18" viewBox="0 0 24 24">
                <path fill="#fff" d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.4-1.64 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.46 3.36 14.43 2.5 12.17 2.5 6.92 2.5 2.67 6.75 2.67 12s4.25 9.5 9.5 9.5c5.48 0 9.11-3.85 9.11-9.28 0-.62-.07-1.1-.93-1.12z" />
              </svg>
              Iniciar sesión con Google
            </button>
            <small>Registro abierto · conexión cifrada de extremo a extremo</small>
          </div>
        </div>
      </div>
    </ScopedStyles>
  );
}

function DashboardSkeleton() {
  return (
    <ScopedStyles>
      <div className="dashboard-container">
        <header className="dash-header">
          <div className="header-info">
            <div className="prx-sk prx-sk-pill" />
            <div className="prx-sk prx-sk-title" />
            <div className="prx-sk prx-sk-sub" />
          </div>
        </header>
        <div className="dash-grid">
          <aside className="dash-sidebar">
            <div className="card">
              <div className="prx-sk prx-sk-block" />
            </div>
          </aside>
          <div className="dash-content">
            <div className="prx-metrics">
              {[0, 1, 2, 3].map((i) => (
                <div className="metric-box" key={i}>
                  <div className="prx-sk prx-sk-sub" />
                  <div className="prx-sk prx-sk-title" />
                </div>
              ))}
            </div>
            <div className="card module-card">
              <div className="prx-sk prx-sk-block" />
            </div>
          </div>
        </div>
      </div>
    </ScopedStyles>
  );
}

// Estilos propios SOLO para lo nuevo; el resto hereda del CSS de Webflow.
function ScopedStyles({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #perfil-react-root .prx-metrics{
          display:grid;gap:16px;margin-bottom:20px;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
        }
        #perfil-react-root .prx-avatar{
          width:56px;height:56px;border-radius:14px;flex:0 0 auto;
          display:grid;place-items:center;font-weight:900;font-size:1.1rem;
          color:#fff;background:linear-gradient(135deg,#0A2240,#16365C);
          letter-spacing:.5px;
        }
        #perfil-react-root .prx-account-meta{
          display:flex;justify-content:space-between;align-items:center;
          padding:10px 0;border-top:1px solid var(--border-ui,#E2E8F0);font-size:.85rem;
        }
        #perfil-react-root .prx-account-meta span{color:var(--text-mute,#64748B);font-weight:600;}
        #perfil-react-root .prx-account-meta strong{color:var(--text-main,#0F172A);font-weight:800;}
        #perfil-react-root .prx-admin-link{
          display:block;text-align:center;margin-top:12px;padding:10px;
          border-radius:8px;background:var(--zarco-blue,#0A2240);color:#fff;
          font-weight:800;font-size:.82rem;text-decoration:none;
        }
        #perfil-react-root .prx-row{cursor:pointer;transition:background .15s;}
        #perfil-react-root .prx-row:hover{background:var(--bg-system,#F4F7F9);}
        #perfil-react-root .prx-row-open{background:var(--bg-system,#F4F7F9);}
        #perfil-react-root .prx-row td{padding:14px 12px;border-bottom:1px solid var(--border-ui,#E2E8F0);}
        #perfil-react-root .prx-detail-row td{padding:0;background:#F8FAFC;}
        #perfil-react-root .prx-detail{padding:18px;}
        #perfil-react-root .prx-detail-table{width:100%;border-collapse:collapse;font-size:.85rem;margin-bottom:14px;}
        #perfil-react-root .prx-detail-table th{
          text-align:left;color:var(--text-mute,#64748B);font-size:.7rem;
          text-transform:uppercase;letter-spacing:.5px;padding:6px 10px;
        }
        #perfil-react-root .prx-detail-table td{padding:8px 10px;border-top:1px solid var(--border-ui,#E2E8F0);}
        #perfil-react-root .prx-detail-table th:last-child,
        #perfil-react-root .prx-detail-table td:last-child,
        #perfil-react-root .prx-detail-table th:nth-child(3),
        #perfil-react-root .prx-detail-table td:nth-child(3){text-align:right;}
        #perfil-react-root .prx-detail-empty{color:var(--text-mute,#64748B);font-size:.9rem;margin:0 0 14px;}
        #perfil-react-root .prx-detail-actions{display:flex;gap:10px;flex-wrap:wrap;}
        #perfil-react-root .prx-btn-ghost{
          background:#fff;border:1px solid var(--border-ui,#E2E8F0);
          color:var(--text-main,#0F172A);padding:12px 24px;border-radius:6px;
          font-weight:700;font-size:.85rem;cursor:pointer;transition:.2s;
        }
        #perfil-react-root .prx-btn-ghost:hover{border-color:var(--zarco-blue,#0A2240);}
        #perfil-react-root .prx-login{display:grid;place-items:center;min-height:50vh;padding:20px 0;}
        #perfil-react-root .prx-login-card{
          max-width:440px;text-align:center;display:flex;flex-direction:column;
          gap:14px;padding:36px 32px;
        }
        #perfil-react-root .prx-login-card h1{font-size:1.5rem;color:var(--zarco-blue,#0A2240);margin:6px 0 0;}
        #perfil-react-root .prx-login-card p{color:var(--text-mute,#64748B);font-size:.95rem;margin:0;}
        #perfil-react-root .prx-login-btn{justify-content:center;width:100%;}
        #perfil-react-root .prx-login-card small{color:var(--text-mute,#64748B);font-size:.75rem;}
        #perfil-react-root .prx-state{padding:32px;text-align:center;color:var(--text-mute,#64748B);}
        #perfil-react-root .prx-sk{
          background:linear-gradient(110deg,#e2e8f0 8%,#f1f5f9 18%,#e2e8f0 33%);
          background-size:200% 100%;animation:shimmer 1.5s linear infinite;border-radius:8px;
        }
        #perfil-react-root .prx-sk-pill{width:160px;height:22px;margin-bottom:14px;border-radius:6px;}
        #perfil-react-root .prx-sk-title{width:60%;height:30px;margin-bottom:10px;}
        #perfil-react-root .prx-sk-sub{width:40%;height:14px;margin-bottom:8px;}
        #perfil-react-root .prx-sk-block{width:100%;height:160px;}
      `,
        }}
      />
      {children}
    </>
  );
}
