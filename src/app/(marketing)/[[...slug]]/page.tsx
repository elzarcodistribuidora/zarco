import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import PageScripts from "../PageScripts";
import CatalogRecs from "../CatalogRecs";
import Preloader from "@/components/Preloader";

type PageMeta = { title: string; description: string; ogImage: string };

const WEBFLOW_DIR = join(process.cwd(), "src/webflow");

async function loadIndex(): Promise<string[]> {
  return JSON.parse(await readFile(join(WEBFLOW_DIR, "_pages.json"), "utf8"));
}

async function loadPage(slug: string) {
  try {
    return JSON.parse(
      await readFile(join(WEBFLOW_DIR, `${slug}.json`), "utf8")
    ) as {
      slug: string;
      css: string;
      body: string;
      bodyClass: string;
      js: string[];
      meta?: PageMeta;
    };
  } catch {
    return null;
  }
}

function pathFor(name: string) {
  return name === "index" ? "/" : `/${name}`;
}

// SEO por página: restaura title / description / Open Graph desde Webflow.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = !slug || slug.length === 0 ? "index" : slug.join("/");
  const page = await loadPage(name);
  const meta = page?.meta;
  if (!meta?.title) return {};

  const images = meta.ogImage ? [meta.ogImage] : undefined;
  return {
    title: meta.title,
    description: meta.description || undefined,
    alternates: { canonical: pathFor(name) },
    openGraph: {
      title: meta.title,
      description: meta.description || undefined,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description || undefined,
      images,
    },
  };
}

// Genera todas las rutas estáticas en build (/, /nosotros, /contacto, ...).
export async function generateStaticParams() {
  const index = await loadIndex();
  // `/perfil` lo sirve su propia ruta React (perfil/page.tsx), no el catch-all.
  return index
    .filter((slug) => slug !== "perfil" && slug !== "delicatessen")
    .map((slug) => ({
      slug: slug === "index" ? [] : [slug],
    }));
}

export default async function WebflowPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const name = !slug || slug.length === 0 ? "index" : slug.join("/");
  const page = await loadPage(name);
  if (!page) notFound();

  return (
    <>
      {/* Catálogo carga productos vía fetch → el preloader espera a que la
          tabla (#productBody) tenga filas antes de revelar. */}
      {name === "catalogo" && <Preloader waitForSelector="#productBody" />}
      <style dangerouslySetInnerHTML={{ __html: page.css }} />
      <div
        className={page.bodyClass || undefined}
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
      <PageScripts js={page.js ?? []} />
      {/* Recomendaciones cross-sell / upsell (solo catálogo). */}
      {name === "catalogo" && <CatalogRecs />}
    </>
  );
}
