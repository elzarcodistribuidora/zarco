import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { leadId, negocio, email, mensaje } = body;

    const CORD_SECRET_KEY = process.env.CORD_SECRET_KEY;
    if (!CORD_SECRET_KEY) {
      return NextResponse.json(
        { error: "CORD_SECRET_KEY no configurado" },
        { status: 500 }
      );
    }

    // TODO: Reemplazar con la URL real de la API de Flouvia / Cord
    const FLOUVIA_API_URL = "https://api.flouvia.com/v1/quotes"; 

    // TODO: Ajustar el payload según la documentación de la API de Flouvia
    const payload = {
      client_name: negocio || "Sin nombre",
      client_email: email,
      notes: mensaje,
      // items: [] 
    };

    const response = await fetch(FLOUVIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CORD_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error al crear cotización en Cord:", errorData);
      return NextResponse.json(
        { error: "Error de Flouvia API", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Asumimos que la API devuelve un 'token' o 'id' para embeber
    const quoteToken = data.token || data.id;

    // (Opcional) Guardar el token de la cotización en Supabase asociado al lead
    // await supabase.from("cotizaciones").update({ cord_token: quoteToken }).eq("id", leadId);

    return NextResponse.json({ token: quoteToken });
  } catch (error: any) {
    console.error("Excepción en /api/cord/create:", error);
    return NextResponse.json(
      { error: "Error interno", message: error.message },
      { status: 500 }
    );
  }
}
