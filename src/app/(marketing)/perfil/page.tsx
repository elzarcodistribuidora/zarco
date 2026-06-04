import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import PageScripts from "../PageScripts";
import PerfilDashboard from "./PerfilDashboard";

// /perfil deja de ser una página Webflow "tal cual": se conserva el MISMO
// navbar/footer público (el JSON de Webflow), pero el panel interno
// (`main.dashboard-wrapper`) se vacía y se reconstruye en React. Esta ruta
// estática gana sobre el catch-all `[[...slug]]`.

const PERFIL_JSON = join(process.cwd(), "src/webflow/perfil.json");
const MAIN_OPEN = '<main class="dashboard-wrapper">';

type PerfilPage = {
  css: string;
  body: string;
  bodyClass: string;
  js: string[];
  meta?: { title: string; description: string; ogImage: string };
};

async function loadPerfil(): Promise<PerfilPage> {
  return JSON.parse(await readFile(PERFIL_JSON, "utf8"));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await loadPerfil();
  if (!meta?.title) return {};
  return {
    title: meta.title,
    description: meta.description || undefined,
    alternates: { canonical: "/perfil" },
    // El perfil no se indexa (igual que el sitemap ya lo excluía).
    robots: { index: false, follow: false },
  };
}

export default async function PerfilPage() {
  const page = await loadPerfil();

  // Vacía SOLO el interior del dashboard (conserva navbar + footer + el tag
  // <main> con sus clases de spacing) y deja un punto de montaje para React.
  const start = page.body.indexOf(MAIN_OPEN);
  const innerStart = start + MAIN_OPEN.length;
  const close = page.body.indexOf("</main>", start);
  const body =
    start >= 0 && close >= 0
      ? page.body.slice(0, innerStart) +
        '<div id="perfil-react-root"></div>' +
        page.body.slice(close)
      : page.body;

  // No corremos el motor viejo del dashboard ("PORTAL B2B ENGINE"): React lo
  // reemplaza. Sí conservamos los scripts del navbar/drawer/auth.
  const js = (page.js ?? []).filter((s) => !s.includes("PORTAL B2B ENGINE"));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.css }} />
      <div
        className={page.bodyClass || undefined}
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {/* Dashboard React montado dentro de #perfil-react-root (createPortal). */}
      <PerfilDashboard />
      <PageScripts js={js} />
    </>
  );
}
