import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Escapar valores para CSV (comillas, saltos de línea, comas)
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!["productos", "clientes", "pedidos"].includes(type || "")) {
    return new NextResponse("Invalid type", { status: 400 });
  }

  const supabase = await createClient();
  
  // Check admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  
  const { data: cliente } = await supabase
    .from("clientes")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();
    
  if (cliente?.role !== "admin") return new NextResponse("Forbidden", { status: 403 });

  let data: any[] | null = [];
  let headers: string[] = [];

  try {
    if (type === "productos") {
      const { data: res } = await supabase
        .from("productos")
        .select("codigo, nombre_web, categoria, precio_final, web")
        .order("nombre_web");
      data = res;
      headers = ["codigo", "nombre_web", "categoria", "precio_final", "web"];
    } else if (type === "clientes") {
      const { data: res } = await supabase
        .from("clientes")
        .select("id, email, nombre, estatus, nivel, role, created_at")
        .order("created_at", { ascending: false });
      data = res;
      headers = ["id", "email", "nombre", "estatus", "nivel", "role", "created_at"];
    } else if (type === "pedidos") {
      const { data: res } = await supabase
        .from("pedidos")
        .select("folio, email, fecha, total, status, resumen")
        .order("fecha", { ascending: false });
      data = res;
      headers = ["folio", "email", "fecha", "total", "status", "resumen"];
    }

    if (!data || data.length === 0) {
      return new NextResponse("No data", { status: 404 });
    }

    // Generar CSV
    const csvRows = [];
    csvRows.push(headers.join(",")); // Cabecera

    for (const row of data) {
      const csvRow = headers.map((header) => escapeCsv(row[header]));
      csvRows.push(csvRow.join(","));
    }

    const csvString = "\uFEFF" + csvRows.join("\n"); // \uFEFF es BOM para que Excel lea UTF-8 correctamente

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
