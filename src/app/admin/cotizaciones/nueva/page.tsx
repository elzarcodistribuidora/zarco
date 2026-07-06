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

  // Fetch clients for the QuoteBuilder autocomplete
  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, empresa, email")
    .order("empresa", { ascending: true })
    .limit(500);

  return <QuoteBuilderClient productos={productos || []} clientes={clientes || []} />;
}
