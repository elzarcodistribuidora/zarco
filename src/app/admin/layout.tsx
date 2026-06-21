import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./ui/Sidebar";
import { ToastProvider } from "./ui/Toaster";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — El Zarco",
  robots: { index: false, follow: false },
};

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
    <div className={`font-sans min-h-screen bg-slate-50 text-slate-900`}>
      <ToastProvider>
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar
            userName={cliente?.nombre ?? ""}
            email={user.email ?? ""}
          />
          <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
            {children}
          </main>
        </div>
      </ToastProvider>
    </div>
  );
}
