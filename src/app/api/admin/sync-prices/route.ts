import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(req: Request) {
  try {
    // Antes esto solo comprobaba que hubiera sesión. El registro es abierto
    // (cualquier cuenta de Google se vuelve cliente), así que cualquier usuario
    // logueado podía mandar un update masivo de precios de todo el catálogo.
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    const supabase = guard.supabase;

    const body = await req.json();
    const updates = body.updates as { codigo: string, precio: number }[];

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No se recibieron datos para actualizar." }, { status: 400 });
    }

    // Solo precios válidos: un NaN/negativo colado desde el CSV escribiría
    // basura en el catálogo público.
    const validos = updates.filter(
      (u) =>
        u &&
        String(u.codigo ?? "").trim() &&
        Number.isFinite(Number(u.precio)) &&
        Number(u.precio) >= 0
    );
    if (!validos.length) {
      return NextResponse.json(
        { error: "Ninguna fila traía un código y un precio válidos." },
        { status: 400 }
      );
    }

    // Procesamos en lotes (batches) de 50 para evitar sobrecargar la conexión
    const BATCH_SIZE = 50;
    let processedCount = 0;
    const fallidos: string[] = [];

    for (let i = 0; i < validos.length; i += BATCH_SIZE) {
      const batch = validos.slice(i, i + BATCH_SIZE);

      const promises = batch.map(item =>
        supabase
          .from("productos")
          .update({
            precio_final: Number(item.precio),
            updated_at: new Date().toISOString()
          })
          .eq("codigo", String(item.codigo).trim())
          // `.select()` devuelve las filas realmente escritas. Sin esto, un
          // UPDATE que no afecta ninguna fila (código inexistente, o RLS
          // bloqueando la escritura) no devuelve error y se contaba como
          // éxito → la ruta reportaba "listo" sin haber cambiado nada.
          .select("codigo")
      );

      const results = await Promise.all(promises);

      results.forEach((res, idx) => {
        if (!res.error && res.data && res.data.length > 0) {
          processedCount++;
        } else {
          fallidos.push(String(batch[idx].codigo).trim());
        }
      });
    }

    // Mismo tag que /api/inventory: el catálogo público refleja los precios
    // nuevos al instante en vez de esperar los 5 min del ISR.
    if (processedCount > 0) revalidateTag("inventory", "max");

    return NextResponse.json({
      success: processedCount > 0,
      processedCount,
      failedCount: fallidos.length,
      // Acotado: con un CSV grande la lista completa no aporta nada útil.
      failedCodigos: fallidos.slice(0, 20),
    });
  } catch (err: any) {
    console.error("Error al sincronizar precios masivos:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
