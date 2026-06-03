import type { MetadataRoute } from "next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: string[] = JSON.parse(
    await readFile(join(process.cwd(), "src/webflow/_pages.json"), "utf8")
  );

  // /perfil es el portal viejo (no indexable); el resto sí.
  return slugs
    .filter((s) => s !== "perfil")
    .map((s) => ({
      url: s === "index" ? SITE : `${SITE}/${s}`,
      changeFrequency: "weekly",
      priority: s === "index" ? 1 : 0.8,
    }));
}
