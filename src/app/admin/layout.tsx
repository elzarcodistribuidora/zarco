import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inter } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin — El Zarco",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Defensa en profundidad: el Proxy ya exige sesión; aquí exigimos rol admin.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?next=/admin");

  const { data: cliente } = await supabase
    .from("clientes")
    .select("role, nombre")
    .eq("auth_user_id", user.id)
    .single();

  if (cliente?.role !== "admin") redirect("/perfil");

  return (
    <div className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
          <span className="font-black tracking-tight text-[#0A2240]">
            El Zarco <span className="text-[#A81200]">Admin</span>
          </span>
          <nav className="flex flex-1 gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="hidden text-sm text-slate-400 sm:block">
            {cliente?.nombre ?? user.email}
          </span>
          <form action="/auth/signout" method="post">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
