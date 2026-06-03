import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getInventory,
  getUserSession,
  parseSavedCart,
  toCatalog,
  type CatalogProduct,
  type Pedido,
  type UserData,
} from "@/lib/matriz";
import PortalShell from "./PortalShell";

export const metadata: Metadata = {
  title: "Mi Portal B2B | El Zarco",
  description:
    "Gestiona tu cuenta mayorista: arma pedidos, repite requisiciones y consulta tu historial de compras.",
  robots: { index: false, follow: false },
};

// Datos del cliente en vivo (no se cachean entre clientes).
export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const session = await auth();
  const email = session?.user?.email;
  // El proxy ya protege /portal, pero por si acaso:
  if (!email) redirect("/portal/login");

  // Catálogo (cacheado 60s) + sesión del cliente, en paralelo.
  const [productosRaw, userSession] = await Promise.all([
    getInventory().catch(() => []),
    getUserSession(email).catch(() => ({
      userData: null,
      history: [],
      savedCart: "[]",
    })),
  ]);

  const catalog: CatalogProduct[] = toCatalog(productosRaw);
  const userData: UserData = userSession.userData ?? {
    id: "CLI-NUEVO",
    nombre: session.user?.name ?? "Cliente Nuevo",
    estatus: "🟢 Contado",
  };
  const history: Pedido[] = Array.isArray(userSession.history)
    ? userSession.history
    : [];
  const initialCart = parseSavedCart(userSession.savedCart);

  return (
    <PortalShell
      userData={userData}
      userEmail={email}
      avatar={session.user?.image ?? null}
      history={history}
      catalog={catalog}
      initialCart={initialCart}
    />
  );
}
