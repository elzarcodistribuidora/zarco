export interface Ingredient {
  id: string;
  name: string;
  category: "cheese" | "meat" | "extra";
  origin?: string; // marca o denominación real del producto (catálogo El Zarco)
  defaultUnit: "g" | "pz" | "ml";
  step: number;
  min: number;
}

// Ingredientes tomados 1:1 del catálogo real (tabla `productos`, categorías
// Lacteos/Embutidos/Abarrotes) — antes esta lista era ficticia (Prosciutto di
// Parma, Bresaola, Gruyère suizo, uvas/higos/fresas frescas, hummus...),
// productos que El Zarco no maneja. `origin` ahora muestra la marca o
// denominación real del producto (no un país inventado).
export const cheeses: Ingredient[] = [
  { id: "c01", name: "Brie Danés", category: "cheese", origin: "Dinamarca", defaultUnit: "g", step: 100, min: 100 },
  { id: "c02", name: "Camembert Danés", category: "cheese", origin: "Dinamarca", defaultUnit: "g", step: 100, min: 100 },
  { id: "c03", name: "Gouda La Villita", category: "cheese", origin: "La Villita", defaultUnit: "g", step: 100, min: 100 },
  { id: "c04", name: "Manchego El Zarco", category: "cheese", origin: "El Zarco", defaultUnit: "g", step: 100, min: 100 },
  { id: "c05", name: "Parmesano Regianito", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c06", name: "Grana Padano", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c07", name: "Gruyere Maasdam Holandés", category: "cheese", origin: "Holanda", defaultUnit: "g", step: 100, min: 100 },
  { id: "c08", name: "Cheddar Extra Añejo Navarro", category: "cheese", origin: "Navarro", defaultUnit: "g", step: 100, min: 100 },
  { id: "c09", name: "Azul Vikingo", category: "cheese", origin: "Vikingo", defaultUnit: "g", step: 100, min: 100 },
  { id: "c10", name: "Roquefort Rosenborg", category: "cheese", origin: "Rosenborg", defaultUnit: "g", step: 100, min: 100 },
  { id: "c11", name: "Queso de Cabra Natural", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c12", name: "Queso de Cabra con Arándano", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c13", name: "Provolone Toscana", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c14", name: "Oaxaca El Zarco", category: "cheese", origin: "El Zarco", defaultUnit: "g", step: 100, min: 100 },
  { id: "c15", name: "Panela El Zarco", category: "cheese", origin: "El Zarco", defaultUnit: "g", step: 100, min: 100 },
];

export const meats: Ingredient[] = [
  { id: "m01", name: "Jamón Serrano Tipo Prosciutto Parma", category: "meat", origin: "Parma", defaultUnit: "g", step: 100, min: 100 },
  { id: "m02", name: "Jamón Serrano Tangamanga", category: "meat", origin: "Tangamanga", defaultUnit: "g", step: 100, min: 100 },
  { id: "m03", name: "Salami Calabrese", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m04", name: "Salami Ungaro", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m05", name: "Peperoni El Mexicano", category: "meat", origin: "El Mexicano", defaultUnit: "g", step: 100, min: 100 },
  { id: "m06", name: "Chorizo Español Bremen", category: "meat", origin: "Bremen", defaultUnit: "g", step: 100, min: 100 },
  { id: "m07", name: "Chistorra Bremen", category: "meat", origin: "Bremen", defaultUnit: "g", step: 100, min: 100 },
  { id: "m08", name: "Pechuga de Pavo Ahumada Bernina", category: "meat", origin: "Bernina", defaultUnit: "g", step: 100, min: 100 },
  { id: "m09", name: "Tocino Ahumado Bernina", category: "meat", origin: "Bernina", defaultUnit: "g", step: 100, min: 100 },
  { id: "m10", name: "Lomo Ahumado Bernina", category: "meat", origin: "Bernina", defaultUnit: "g", step: 100, min: 100 },
  { id: "m11", name: "Roast Beef Tangamanga", category: "meat", origin: "Tangamanga", defaultUnit: "g", step: 100, min: 100 },
  { id: "m12", name: "Mortadela Kir", category: "meat", origin: "Kir", defaultUnit: "g", step: 100, min: 100 },
  { id: "m13", name: "Pierna Selva Negra Tangamanga", category: "meat", origin: "Tangamanga", defaultUnit: "g", step: 100, min: 100 },
];

export const extras: Ingredient[] = [
  { id: "e01", name: "Mermelada Rica Frut", category: "extra", origin: "Rica Frut", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e02", name: "Mermelada de Zarzamora Rica Frut", category: "extra", origin: "Rica Frut", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e03", name: "Miel de Agave", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e04", name: "Paté Zwan", category: "extra", origin: "Zwan", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e05", name: "Aceitunas con Hueso", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e06", name: "Almendra Entera", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e07", name: "Nuez en Mitad", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e08", name: "Nuez de la India", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e09", name: "Pistaches", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e10", name: "Nuez Garapiñada", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e11", name: "Dátil", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e12", name: "Higos Cristalizados", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e13", name: "Arándanos Deshidratados", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e14", name: "Cacahuates Botaneros", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e15", name: "Galletas Pretzel", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e16", name: "Pan Integral", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
];
