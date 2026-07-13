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
      
      {/* 
        This is where we inject the webflow body content. 
        It has been stripped of the hardcoded nav and footer in delicatessen.json.
      */}
      <div
        className={page.bodyClass || undefined}
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
      
      <PageScripts js={page.js ?? []} />
      <DelicatessenFooter />
    </>
  );
}
