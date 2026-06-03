// Conector a "La Matriz": el Google Apps Script Web App que ya tienes
// corriendo enfrente de tus Google Sheets (CRM CLIENTES + PEDIDOS WEB).
// Esto da paridad inmediata con el portal de Webflow, sin migrar la DB.
// Todo se llama desde el SERVIDOR de Next.js (el email viene de la sesión,
// nunca del cliente), lo que cierra el hueco de seguridad del portal viejo.

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;
const APPS_SCRIPT_TOKEN = process.env.APPS_SCRIPT_TOKEN;

// Agrega el token compartido a la URL (si está configurado). El Apps Script
// debe validar e.parameter.token y rechazar las peticiones sin él, para que
// nadie con la URL pueda consultar pedidos de otros clientes.
function withToken(url: string) {
  if (!APPS_SCRIPT_TOKEN) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}token=${encodeURIComponent(APPS_SCRIPT_TOKEN)}`;
}

export type UserData = { id: string; nombre: string; estatus: string };
export type Pedido = {
  folio: string;
  date: string;
  total: string | number;
  status: string;
  resumen?: string;
};
export type UserSession = {
  userData: UserData | null;
  history: Pedido[];
  savedCart: string;
};

// Forma cruda que devuelve el Apps Script (claves con espacios/acentos).
export type Producto = {
  CODIGO: string;
  "NOMBRE PARA WEB": string;
  MARCA: string;
  CATEGORIA: string;
  "UNIDAD DE MEDIDA": string;
  "PRECIO FINAL": number;
  WEB: string;
};

// Forma limpia que consume la UI del portal (sin claves raras).
export type CatalogProduct = {
  code: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  price: number;
};

// Una línea del carrito (lo que el cliente arma en el portal).
export type CartItem = { code: string; name: string; price: number; qty: number };

/** Normaliza el inventario crudo del Sheet a la forma que usa la UI. */
export function toCatalog(productos: Producto[]): CatalogProduct[] {
  return productos
    .map((p) => ({
      code: String(p.CODIGO ?? "").trim(),
      name: String(p["NOMBRE PARA WEB"] ?? "").trim(),
      brand: String(p.MARCA ?? "").trim(),
      category: String(p.CATEGORIA ?? "General").trim(),
      unit: String(p["UNIDAD DE MEDIDA"] ?? "Pieza").trim(),
      price: Number(p["PRECIO FINAL"]) || 0,
    }))
    .filter((p) => p.code && p.name && p.price > 0);
}

/** Sesión + historial de pedidos de un cliente (filtrado por su email). */
export async function getUserSession(email: string): Promise<UserSession> {
  const res = await fetch(
    withToken(
      `${APPS_SCRIPT_URL}?action=getUserSession&email=${encodeURIComponent(email)}`
    ),
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Matriz getUserSession ${res.status}`);
  return res.json();
}

/** Catálogo / inventario con precios. Cacheado 60s para no pegarle en cada visita. */
export async function getInventory(): Promise<Producto[]> {
  const res = await fetch(withToken(`${APPS_SCRIPT_URL}?action=getInventory`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Matriz getInventory ${res.status}`);
  const data = await res.json();
  // Solo productos activados para web.
  return (Array.isArray(data) ? data : []).filter(
    (p) => String(p.WEB).toLowerCase().includes("activ")
  );
}

/** Envía un pedido o guarda el carrito (POST al Apps Script, mismo formato viejo). */
export async function postToMatriz(payload: unknown) {
  const res = await fetch(withToken(APPS_SCRIPT_URL), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Matriz POST ${res.status}`);
  return res.json();
}

/**
 * Registra un pedido en la hoja PEDIDOS WEB (action=saveOrder). El Apps Script
 * devuelve { status: "Success", folio }. Mismo contrato que usaba el catálogo
 * viejo, pero ahora se llama desde el servidor con el email de la sesión.
 */
export async function saveOrder(args: {
  clientId: string;
  negocio: string;
  email: string;
  resumen: string;
  total: number;
}): Promise<{ status?: string; folio?: string }> {
  return postToMatriz({ action: "saveOrder", ...args });
}

/** Guarda el carrito en la nube del cliente (action=syncCart). */
export async function syncCart(email: string, cartJson: string) {
  return postToMatriz({ action: "syncCart", email, cart: cartJson });
}

/**
 * Parsea el `savedCart` (string JSON) que devuelve la Matriz y lo normaliza a
 * CartItem[]. Tolera dos formatos: el nuevo del portal [{code,name,price,qty}]
 * y el viejo del catálogo de Webflow [[id, {name,price,qty}]].
 */
export function parseSavedCart(savedCart: string | undefined | null): CartItem[] {
  if (!savedCart) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(savedCart);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const norm = (code: unknown, o: Record<string, unknown>): CartItem | null => {
    const c = String(code ?? "").trim();
    if (!c) return null;
    return {
      code: c,
      name: String(o.name ?? "").trim(),
      price: Number(o.price) || 0,
      qty: Math.max(1, Math.floor(Number(o.qty) || 1)),
    };
  };

  return raw
    .map((entry): CartItem | null => {
      // Formato viejo: [id, {name, price, qty}]
      if (Array.isArray(entry)) {
        const [id, obj] = entry as [unknown, Record<string, unknown>];
        return obj ? norm(id, obj) : null;
      }
      // Formato nuevo: {code, name, price, qty}
      if (entry && typeof entry === "object") {
        const o = entry as Record<string, unknown>;
        return norm(o.code ?? o.id, o);
      }
      return null;
    })
    .filter((x): x is CartItem => x !== null);
}
