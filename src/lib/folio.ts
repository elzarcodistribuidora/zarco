import "server-only";
// Folios legibles para pedidos (ZRC-…) y cotizaciones (COT-…).
//
// Antes se generaban con `Date.now().toString().slice(-7)`, que tiene un
// problema peor que la típica colisión "dos en el mismo milisegundo": al
// quedarse con los últimos 7 dígitos de los milisegundos, el contador **da la
// vuelta cada 10^7 ms ≈ 2.8 horas**. O sea que dos pedidos separados por 2.8h
// (o 5.6h, o 8.4h…) podían recibir exactamente el mismo folio — con volumen
// real de meses, los duplicados dejan de ser improbables.
//
// Ahora: base36 del timestamp completo (no se repite, y ordena
// cronológicamente porque crece de forma monótona) + sufijo aleatorio, que
// cubre las colisiones dentro del mismo milisegundo.
import { randomBytes } from "crypto";

export function generateFolio(prefix: "ZRC" | "COT"): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${time}-${rand}`;
}

// Código de violación de restricción única en Postgres. Supabase lo devuelve
// en `error.code`.
export const PG_UNIQUE_VIOLATION = "23505";
