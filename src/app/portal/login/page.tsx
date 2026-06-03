import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

const MENSAJES: Record<string, string> = {
  AccessDenied: "No se pudo iniciar sesión. Intenta de nuevo.",
  Configuration: "Hubo un problema de configuración. Intenta más tarde.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/portal");

  const { error } = await searchParams;
  const mensaje = error ? MENSAJES[error] ?? "No se pudo iniciar sesión." : null;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="text-3xl font-bold">Portal de clientes</h1>
      <p className="max-w-md text-black/60">
        Inicia sesión con tu cuenta de Google para ver tus precios y tu
        historial de pedidos.
      </p>
      {mensaje && (
        <p className="max-w-md rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {mensaje}
        </p>
      )}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/portal" });
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-foreground px-6 py-3 text-background transition-opacity hover:opacity-90"
        >
          Entrar con Google
        </button>
      </form>
    </main>
  );
}
