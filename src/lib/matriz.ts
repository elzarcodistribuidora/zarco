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

export type Producto = {
  CODIGO: string;
  "NOMBRE PARA WEB": string;
  MARCA: string;
  CATEGORIA: string;
  "UNIDAD DE MEDIDA": string;
  "PRECIO FINAL": number;
  WEB: string;
};

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
