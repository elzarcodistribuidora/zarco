import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Verificamos si el usuario es admin válido comprobando la sesión
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado. Inicia sesión como administrador." }, { status: 401 });
    }

    const body = await req.json();
    const updates = body.updates as { codigo: string, precio: number }[];

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No se recibieron datos para actualizar." }, { status: 400 });
    }

    // Procesamos en lotes (batches) de 50 para evitar sobrecargar la conexión
    const BATCH_SIZE = 50;
    let processedCount = 0;

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);
      
      const promises = batch.map(item => 
        supabase
          .from("productos")
          .update({ 
            precio_final: item.precio,
            updated_at: new Date().toISOString()
          })
          .eq("codigo", item.codigo)
      );

      const results = await Promise.all(promises);
      
      for (const res of results) {
        if (!res.error) {
           processedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, processedCount });
  } catch (err: any) {
    console.error("Error al sincronizar precios masivos:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
