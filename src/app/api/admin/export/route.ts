import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

// Escapar valores para CSV (comillas, saltos de línea, comas)
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return "";
  let str = String(val);

  // Inyección de fórmulas: Excel/Sheets EJECUTAN una celda que empieza con
  // = + - @ (o tab/CR). Varias columnas que exportamos son texto libre del
  // usuario — `pedidos.resumen` viene del body de /api/order, y nombre/email
  // salen del perfil de Google — así que un cliente podía plantar
  // `=HYPERLINK(...)` en un pedido y dispararlo al abrir el CSV.
  // Anteponer un apóstrofo fuerza a que la celda se lea como texto.
  if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;

  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
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

  const guard = await requireAdmin();
  if (!guard.ok) return new NextResponse(guard.error, { status: guard.status });
  const supabase = guard.supabase;

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
