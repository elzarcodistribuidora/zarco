import { auth, signOut } from "@/auth";
import { getUserSession, getInventory } from "@/lib/matriz";
import Preloader from "@/components/Preloader";

export default async function PortalPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  // Datos reales desde tu Apps Script (La Matriz), en paralelo.
  const [userSession, inventory] = await Promise.all([
    email
      ? getUserSession(email).catch(() => null)
      : Promise.resolve(null),
    getInventory().catch(() => []),
  ]);

  const userData = userSession?.userData;
  const history = userSession?.history ?? [];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 p-8">
      {/* Los datos del portal ya vienen del servidor; el preloader cubre la
          entrada y revela todo cargado. */}
      <Preloader />
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hola, {session?.user?.name}</h1>
          <p className="text-sm text-black/60">{email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="rounded-full border px-4 py-2 text-sm">Salir</button>
        </form>
      </header>

      {/* Estatus del cliente (CRM CLIENTES) */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card label="Nivel">
          {userData?.id && userData.id !== "CLI-NUEVO"
            ? "Socio Comercial"
            : "Cliente Nuevo"}
        </Card>
        <Card label="Estatus">{userData?.estatus ?? "Sin validar"}</Card>
        <Card label="Pedidos">{history.length}</Card>
      </section>

      {/* Historial de pedidos (PEDIDOS WEB, filtrado por email) */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Mis pedidos</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="p-3">Folio</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Total</th>
                <th className="p-3">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td className="p-3 text-black/50" colSpan={4}>
                    No hay pedidos registrados en la nube.
                  </td>
                </tr>
              ) : (
                history.map((o, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 font-medium">{o.folio}</td>
                    <td className="p-3">{o.date}</td>
                    <td className="p-3">${o.total}</td>
                    <td className="p-3">{o.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Catálogo con precios (getInventory) */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Catálogo ({inventory.length} productos)
        </h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Unidad</th>
                <th className="p-3">Precio</th>
              </tr>
            </thead>
            <tbody>
              {inventory.slice(0, 50).map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{p.CODIGO}</td>
                  <td className="p-3">{p["NOMBRE PARA WEB"]}</td>
                  <td className="p-3">{p.CATEGORIA}</td>
                  <td className="p-3">{p["UNIDAD DE MEDIDA"]}</td>
                  <td className="p-3 font-medium">${p["PRECIO FINAL"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs uppercase tracking-wide text-black/50">{label}</p>
      <p className="mt-1 text-lg font-semibold">{children}</p>
    </div>
  );
}
