import { createClient } from "@/lib/supabase/server";
import { QuoteBuilderClient } from "./QuoteBuilderClient";

export default async function NuevaCotizacionPage() {
  const supabase = await createClient();
  
  // Fetch products (limit to a reasonable number for the datalist, e.g. 1000)
  const { data: productos } = await supabase
    .from("productos")
    .select("codigo, nombre_web, precio_final")
    .order("nombre_web", { ascending: true })
    .limit(1000);

  return <QuoteBuilderClient productos={productos || []} />;
}
