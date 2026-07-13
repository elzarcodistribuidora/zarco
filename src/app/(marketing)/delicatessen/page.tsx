import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import PageScripts from "../PageScripts";
import DelicatessenNavbar from "@/components/DelicatessenNavbar";
import DelicatessenFooter from "@/components/DelicatessenFooter";

type PageMeta = { title: string; description: string; ogImage: string };

const WEBFLOW_DIR = join(process.cwd(), "src/webflow");

async function loadPage() {
  try {
    return JSON.parse(
      await readFile(join(WEBFLOW_DIR, `delicatessen.json`), "utf8")
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

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadPage();
  const meta = page?.meta;
  if (!meta?.title) return {};

  const images = meta.ogImage ? [meta.ogImage] : undefined;
  return {
    title: meta.title,
    description: meta.description || undefined,
    alternates: { canonical: "/delicatessen" },
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

export default async function DelicatessenPage() {
  const page = await loadPage();
  if (!page) notFound();

  return (
    <>
      <DelicatessenNavbar />
      <style dangerouslySetInnerHTML={{ __html: page.css }} />
      {/* React CTA Banner inserted above Webflow content */}
      <div className="bg-[#A81200] text-white py-4 px-4 text-center sticky top-[70px] z-[1900] shadow-md">
        <p className="font-bold text-sm md:text-base flex items-center justify-center gap-2">
          <span>✨ NUEVO: Experimenta nuestro Constructor Interactivo de Charolas ✨</span>
          <a href="/delicatessen/arma-tu-charola" className="bg-white text-[#A81200] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide hover:bg-slate-100 transition-colors ml-2">
            Pruébalo ahora
          </a>
        </p>
      </div>

      {/* 
        This is where we inject the webflow body content. 
        It has been stripped of the hardcoded nav and footer in delicatessen.json.
        We also redirect old charolas anchor links to the new builder.
      */}
      <div
        className={page.bodyClass || undefined}
        dangerouslySetInnerHTML={{ 
          __html: page.body
            .replace(/href="[^"]*#servicio-charolas"/g, 'href="/delicatessen/arma-tu-charola"')
            .replace(/href="[^"]*#charolas"/g, 'href="/delicatessen/arma-tu-charola"') 
        }}
      />
      
      <PageScripts js={page.js ?? []} />
      <DelicatessenFooter />
    </>
  );
}
