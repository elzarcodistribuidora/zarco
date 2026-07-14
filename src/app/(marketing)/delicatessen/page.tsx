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
      <style dangerouslySetInnerHTML={{ __html: page.css + `
        /* Adjust wrapper to account for navbar height exactly */
        .deli-content-wrapper { padding-top: 134px; }
        
        /* Remove webflow padding and first margin so there is no gap */
        .sector-page-wrapper { padding-top: 0 !important; }
        main .carousel-section:first-of-type { margin-top: 0 !important; }
        
        @media (min-width: 1024px) {
          .deli-content-wrapper { padding-top: 185px; }
        }
      `}} />
      
      {/* Wrapper to push content perfectly below the fixed navbar */}
      <div className="deli-content-wrapper">
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
      </div>
      
      <PageScripts js={page.js ?? []} />
      <DelicatessenFooter />
    </>
  );
}
