import type { Metadata } from "next";
import Image from "next/image";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Acceso a Clientes | Portal B2B El Zarco",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A2240] px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-black/5">
        <div className="text-center">
          <Image
            src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
            alt="Distribuidora El Zarco"
            width={180}
            height={64}
            className="mx-auto h-16 w-auto object-contain"
            priority
          />
          <h1 className="mt-6 text-2xl font-black tracking-tight text-[#0A2240]">
            Acceso a Clientes
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Entra con tu cuenta de Google para ver tu cuenta, armar pedidos y
            consultar tu historial de compras.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/portal" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
              />
            </svg>
            Entrar con Google
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2 4 5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V5l-8-3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Conexión segura cifrada
        </div>
      </div>
    </main>
  );
}
