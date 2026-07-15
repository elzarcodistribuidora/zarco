import type { Metadata } from "next";
import DelicatessenNavbar from "@/components/DelicatessenNavbar";
import DelicatessenFooter from "@/components/DelicatessenFooter";
import TrayBuilder from "@/components/charolas/TrayBuilder";

export const metadata: Metadata = {
  title: "Arma tu Charola | El Zarco Delicatessen",
  description:
    "Diseña tu propia charola de quesos y carnes frías. Selecciona tus ingredientes favoritos y personaliza tu tabla para tu evento.",
};

export default function ArmaTuCharolaPage() {
  return (
    <>
      <DelicatessenNavbar />
      {/* Scoped reset: neutralizes Webflow global rules ONLY inside the builder */}
      <style dangerouslySetInnerHTML={{ __html: `
        #charola-builder, #charola-builder * {
          box-sizing: border-box;
        }
        #charola-builder svg {
          display: inline-block !important;
          width: auto !important;
          height: auto !important;
          fill: currentColor;
          visibility: visible !important;
        }
        #charola-builder button {
          font-family: inherit;
          line-height: normal;
          visibility: visible !important;
          display: inline-flex;
        }
        #charola-builder h1,
        #charola-builder h2,
        #charola-builder h3,
        #charola-builder h4,
        #charola-builder p,
        #charola-builder span,
        #charola-builder div {
          all: revert;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          visibility: visible !important;
          display: block;
        }
        #charola-builder div {
          display: block;
        }
      `}} />
      <header className="relative w-full overflow-hidden pt-[var(--navbar-h)]">
        <picture>
          <source media="(max-width: 768px)" srcSet="/banners/charolas-movil.png" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banners/charolas-desk.png"
            alt="Arma tu Charola - El Zarco Delicatessen"
            className="block w-full"
          />
        </picture>
        <div className="absolute inset-x-0 bottom-4 hidden justify-center md:flex">
          <span className="inline-flex animate-bounce items-center gap-1.5 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">
            Desliza para armar tu charola
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </header>
      <main id="charola-builder">
        <TrayBuilder />
      </main>
      <DelicatessenFooter />
    </>
  );
}
