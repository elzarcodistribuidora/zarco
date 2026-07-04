import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { leadId, negocio, email, mensaje, items: bodyItems } = body;

    const CORD_SECRET_KEY = process.env.CORD_SECRET_KEY;
    if (!CORD_SECRET_KEY) {
      return NextResponse.json(
        { error: "CORD_SECRET_KEY no configurado" },
        { status: 500 }
      );
    }

    const FLOUVIA_API_URL = "https://cord.flouvia.com/api/v1/cotizaciones"; 

    // Usar los ítems enviados, o un ítem por defecto si no hay ninguno
    const finalItems = Array.isArray(bodyItems) && bodyItems.length > 0
      ? bodyItems
      : [
          {
            descripcion: "Solicitud desde formulario web (revisar y ajustar precios)",
            cantidad: 1,
            precio_unitario: 0
          }
        ];

    const payload = {
      notas: `Cliente: ${negocio || "Sin nombre"}\nEmail: ${email || "Sin email"}\nMensaje: ${mensaje || "Sin mensaje"}`,
      send: false, 
      items: finalItems
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

    const responseData = await response.json();
    
    // La API de Flouvia devuelve { data: { id: "...", link_publico: "/q/abc1234" } }
    let quoteToken = responseData?.data?.id || responseData?.id || responseData?.token;
    const linkPublico = responseData?.data?.link_publico;
    
    if (linkPublico && linkPublico.includes("/q/")) {
      quoteToken = linkPublico.split("/q/")[1];
    }

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
