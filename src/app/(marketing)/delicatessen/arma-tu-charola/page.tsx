import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import DelicatessenNavbar from "@/components/DelicatessenNavbar";
import DelicatessenFooter from "@/components/DelicatessenFooter";
import TrayBuilder from "@/components/charolas/TrayBuilder";
import PageScripts from "../../PageScripts";

const WEBFLOW_DIR = join(process.cwd(), "src/webflow");

async function loadWebflowData() {
  try {
    const page = JSON.parse(
      await readFile(join(WEBFLOW_DIR, "delicatessen.json"), "utf8")
    );
    return { css: page.css as string, js: (page.js as string[]) ?? [] };
  } catch {
    return { css: "", js: [] };
  }
}

export const metadata: Metadata = {
  title: "Arma tu Charola | El Zarco Delicatessen",
  description:
    "Diseña tu propia charola de quesos y carnes frías. Selecciona tus ingredientes favoritos y personaliza tu tabla para tu evento.",
};

export default async function ArmaTuCharolaPage() {
  const { css, js } = await loadWebflowData();

  return (
    <>
      <DelicatessenNavbar />
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
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
      {/* Banner desktop-only */}
      <section style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '140px 5% 0',
      }}>
        <picture>
          <source media="(max-width: 768px)" srcSet="/banners/charolas-movil.png" />
          <img
            src="/banners/charolas-desk.png"
            alt="Arma tu Charola - El Zarco Delicatessen"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            }}
          />
        </picture>
      </section>
      <main id="charola-builder">
        <TrayBuilder />
      </main>
      <PageScripts js={js} />
      <DelicatessenFooter />
    </>
  );
}
