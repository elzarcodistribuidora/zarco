export interface Ingredient {
  id: string;
  name: string;
  category: "cheese" | "meat" | "extra";
  origin?: string; // estilo/denominación del producto (NO marca comercial)
  defaultUnit: "g" | "pz" | "ml";
  step: number;
  min: number;
}

// Ingredientes genéricos (sin marca comercial) para no atarse a una sola
// referencia de proveedor que pueda cambiar o agotarse. Se basan en lo que
// El Zarco maneja de verdad (tabla `productos`, categorías
// Lacteos/Embutidos/Abarrotes — ver docs/marketing-site.md), más un puñado
// de clásicos de charola muy comunes y fáciles de conseguir que hoy no están
// en catálogo (uvas/fresas frescas, aceitunas negras) — sobre todo en
// carnes frías y frutas/aceitunas, a propósito.
export const cheeses: Ingredient[] = [
  { id: "c01", name: "Brie", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c02", name: "Camembert", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c03", name: "Gouda", category: "cheese", origin: "Holanda", defaultUnit: "g", step: 100, min: 100 },
  { id: "c04", name: "Manchego", category: "cheese", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "c05", name: "Parmesano", category: "cheese", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c06", name: "Grana Padano", category: "cheese", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c07", name: "Gruyere", category: "cheese", origin: "Suiza", defaultUnit: "g", step: 100, min: 100 },
  { id: "c08", name: "Cheddar Añejo", category: "cheese", origin: "Inglaterra", defaultUnit: "g", step: 100, min: 100 },
  { id: "c09", name: "Queso Azul", category: "cheese", origin: "Dinamarca", defaultUnit: "g", step: 100, min: 100 },
  { id: "c10", name: "Roquefort", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c11", name: "Queso de Cabra", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c12", name: "Queso de Cabra con Arándano", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c13", name: "Provolone", category: "cheese", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c14", name: "Oaxaca", category: "cheese", origin: "México", defaultUnit: "g", step: 100, min: 100 },
  { id: "c15", name: "Panela", category: "cheese", origin: "México", defaultUnit: "g", step: 100, min: 100 },
];

export const meats: Ingredient[] = [
  { id: "m01", name: "Jamón Serrano", category: "meat", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "m02", name: "Prosciutto", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m03", name: "Salami", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m04", name: "Peperoni", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m05", name: "Chorizo Español", category: "meat", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "m06", name: "Chistorra", category: "meat", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "m07", name: "Pechuga de Pavo Ahumada", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m08", name: "Tocino Ahumado", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m09", name: "Lomo Ahumado", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m10", name: "Roast Beef", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m11", name: "Mortadela", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m12", name: "Jamón Selva Negra", category: "meat", origin: "Alemania", defaultUnit: "g", step: 100, min: 100 },
  { id: "m13", name: "Bresaola", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
];

export const extras: Ingredient[] = [
  { id: "e01", name: "Mermelada de Frutos Rojos", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e02", name: "Mermelada de Zarzamora", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e03", name: "Miel de Abeja", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e04", name: "Paté", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e05", name: "Aceitunas Verdes", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e06", name: "Aceitunas Negras", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e07", name: "Uvas Frescas", category: "extra", defaultUnit: "g", step: 200, min: 200 },
  { id: "e08", name: "Fresas", category: "extra", defaultUnit: "g", step: 200, min: 200 },
  { id: "e09", name: "Higos Cristalizados", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e10", name: "Arándanos Deshidratados", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e11", name: "Dátiles", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e12", name: "Almendras", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e13", name: "Nueces", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e14", name: "Nuez de la India", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e15", name: "Pistaches", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e16", name: "Galletas / Crackers", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e17", name: "Pan Artesanal", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
];
