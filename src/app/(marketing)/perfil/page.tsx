import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import PerfilDashboard from "./PerfilDashboard";

export const metadata: Metadata = {
  title: "Panel de Cliente | Gestiona tus Pedidos B2B | El Zarco",
  description:
    "Accede a tu cuenta mayorista. Revisa tu historial de facturación, repite pedidos anteriores y gestiona el abasto de tu negocio fácilmente.",
  alternates: { canonical: "/perfil" },
  // El perfil no se indexa.
  robots: { index: false, follow: false },
};

export default function PerfilPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-white pt-[calc(var(--navbar-h)+75px)] pb-20">
        {/* Dashboard React montado aquí (createPortal). */}
        <div className="mx-auto w-[90%]" id="perfil-react-root" />
      </main>
      <PerfilDashboard />
      <Footer />
    </>
  );
}
