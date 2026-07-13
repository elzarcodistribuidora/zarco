export interface Ingredient {
  id: string;
  name: string;
  category: "cheese" | "meat" | "extra";
  origin?: string; // e.g. "Italia", "España"
  defaultUnit: "g" | "pz" | "ml";
  step: number;
  min: number;
}

export const cheeses: Ingredient[] = [
  { id: "c01", name: "Brie", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c02", name: "Camembert", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c03", name: "Gouda Añejo", category: "cheese", origin: "Holanda", defaultUnit: "g", step: 100, min: 100 },
  { id: "c04", name: "Gouda Joven", category: "cheese", origin: "Holanda", defaultUnit: "g", step: 100, min: 100 },
  { id: "c05", name: "Azul Danés", category: "cheese", origin: "Dinamarca", defaultUnit: "g", step: 100, min: 100 },
  { id: "c06", name: "Roquefort", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c07", name: "Provolone Ahumado", category: "cheese", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c08", name: "Manchego Curado", category: "cheese", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "c09", name: "Gruyère", category: "cheese", origin: "Suiza", defaultUnit: "g", step: 100, min: 100 },
  { id: "c10", name: "Cheddar Madurado", category: "cheese", origin: "Inglaterra", defaultUnit: "g", step: 100, min: 100 },
  { id: "c11", name: "Parmesano Reggiano", category: "cheese", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c12", name: "Queso de Cabra", category: "cheese", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "c13", name: "Queso Crema con Hierbas", category: "cheese", defaultUnit: "g", step: 100, min: 100 },
  { id: "c14", name: "Havarti", category: "cheese", origin: "Dinamarca", defaultUnit: "g", step: 100, min: 100 },
  { id: "c15", name: "Emmental", category: "cheese", origin: "Suiza", defaultUnit: "g", step: 100, min: 100 },
];

export const meats: Ingredient[] = [
  { id: "m01", name: "Prosciutto di Parma", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m02", name: "Jamón Serrano", category: "meat", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "m03", name: "Salami Genoa", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m04", name: "Salami Milano", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m05", name: "Coppa Italiana", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m06", name: "Bresaola", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m07", name: "Lomo Embuchado", category: "meat", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "m08", name: "Chorizo Pamplona", category: "meat", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "m09", name: "Mortadela con Pistache", category: "meat", origin: "Italia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m10", name: "Pechuga de Pavo Ahumada", category: "meat", defaultUnit: "g", step: 100, min: 100 },
  { id: "m11", name: "Paté de Campaña", category: "meat", origin: "Francia", defaultUnit: "g", step: 100, min: 100 },
  { id: "m12", name: "Tocino Ahumado", category: "meat", defaultUnit: "g", step: 100, min: 100 },
];

export const extras: Ingredient[] = [
  { id: "e01", name: "Mermelada de Higo", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e02", name: "Mermelada de Chabacano", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e03", name: "Miel de Abeja", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e04", name: "Aceitunas Kalamata", category: "extra", origin: "Grecia", defaultUnit: "g", step: 100, min: 100 },
  { id: "e05", name: "Aceitunas Verdes", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e06", name: "Mix de Nueces", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e07", name: "Almendras Tostadas", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e08", name: "Uvas Frescas", category: "extra", defaultUnit: "g", step: 200, min: 200 },
  { id: "e09", name: "Fresas", category: "extra", defaultUnit: "g", step: 200, min: 200 },
  { id: "e10", name: "Higos Frescos", category: "extra", defaultUnit: "pz", step: 2, min: 2 },
  { id: "e11", name: "Dátiles", category: "extra", defaultUnit: "g", step: 100, min: 100 },
  { id: "e12", name: "Galletas Artesanales", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e13", name: "Crostini", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e14", name: "Pan de Nuez", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e15", name: "Hummus", category: "extra", defaultUnit: "pz", step: 1, min: 1 },
  { id: "e16", name: "Pimientos del Piquillo", category: "extra", origin: "España", defaultUnit: "g", step: 100, min: 100 },
  { id: "e17", name: "Chocolate Oscuro", category: "extra", defaultUnit: "g", step: 50, min: 50 },
  { id: "e18", name: "Frutos Secos Mixtos", category: "extra", defaultUnit: "g", step: 100, min: 100 },
];
