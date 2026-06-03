// Conocimiento de recomendaciones para el catálogo (cross-sell / upsell).
//
// No hay historial de compras (1 pedido) → las recomendaciones por "co-compra"
// no son viables. En su lugar usamos un mapa de PARES precalculado: clasificamos
// cada producto en un ARQUETIPO por su nombre y definimos qué arquetipos se
// complementan (queso↔jamón/tostada/ate, tequila↔botana, yogurt↔nuez, …).
//
// build-recommendations.mjs usa esto para generar dos listas por producto:
//   - complemento (cross-sell): productos de arquetipos que combinan con el suyo.
//   - similar     (upsell):     mismo arquetipo, otra marca/presentación.
//
// Para regenerar tras cambiar el catálogo:  npm run build:recs

/** Normaliza para clasificar: minúsculas y sin acentos. */
export function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Clasificador: la PRIMERA regla cuyo keyword aparezca en el nombre gana.
// El orden importa ("queso crema" debe ser queso, no crema; "danonino" antes
// que yogurt/leche). Los keywords ya van normalizados (sin acento).
const REGLAS = [
  { tipo: "danonino", kw: ["danonino", "danup", "danet", "danette", "gogurt", "petit"] },
  { tipo: "queso", kw: ["queso", "panela", "manchego", "oaxaca", "gouda", "cheddar", "doble crema chiles", "requeson", "mozzarella", "parmesano"] },
  { tipo: "jamon", kw: ["jamon", "pierna", "pavo ovalado", "pavo redondo"] },
  { tipo: "pechuga", kw: ["pechuga"] },
  { tipo: "tocino", kw: ["tocino", "tocineta"] },
  { tipo: "salchicha", kw: ["salchicha", "frankfurt", "viena", "salchichon"] },
  { tipo: "chorizo", kw: ["chorizo", "longaniza"] },
  { tipo: "embutido_rebanada", kw: ["mortadela", "peperoni", "pepperoni", "salami", "pastel de pollo", "queso de puerco"] },
  { tipo: "carne_ahumada", kw: ["chuleta", "costilla ahumada", "ahumad"] },
  { tipo: "crema", kw: ["crema acida", "media crema", "crema para batir", "crema lyncott", "crema "] },
  { tipo: "mantequilla", kw: ["mantequilla"] },
  { tipo: "margarina", kw: ["margarina"] },
  { tipo: "yogurt", kw: ["yogurt", "yoghurt", "bebible", "alpura sport"] },
  { tipo: "leche", kw: ["leche", "lechita", "lala", "media crema"] },
  { tipo: "flan", kw: ["flan"] },
  { tipo: "gelatina", kw: ["gelatina", "gelatto"] },
  { tipo: "tostada", kw: ["tostada", "tostadita", "totopo"] },
  { tipo: "tortillas", kw: ["tortilla"] },
  { tipo: "pan", kw: ["pan ", "bolillo", "telera", "baguette", "media noche"] },
  { tipo: "chiles", kw: ["chile", "rajas", "jalapeñ", "jalapen", "chipotle", "serrano"] },
  { tipo: "salsa", kw: ["salsa", "catsup", "ketchup"] },
  { tipo: "mayonesa", kw: ["mayonesa"] },
  { tipo: "mostaza", kw: ["mostaza"] },
  { tipo: "mermelada", kw: ["mermelada"] },
  { tipo: "ate", kw: ["ate ", "ate de", "membrillo", "guayaba"] },
  { tipo: "cajeta", kw: ["cajeta", "dulce de leche"] },
  { tipo: "nuez", kw: ["nuez", "nueces", "almendra", "cacahuate", "pistache"] },
  { tipo: "duraznos", kw: ["durazno", "coctel de frutas", "pina en almibar", "fruta en almibar"] },
  { tipo: "tequila", kw: ["tequila", "mezcal"] },
  { tipo: "vino", kw: ["vino", "tinto", "blanco 750", "espumoso"] },
  { tipo: "cerveza", kw: ["cerveza", "michelada"] },
  { tipo: "refresco", kw: ["boing", "refresco", "agua mineral", "jarritos", "coca"] },
  { tipo: "papas", kw: ["papas", "sabritas", "frituras", "botana"] },
  { tipo: "cigarro", kw: ["cigarro", "marlboro"] },
  { tipo: "charola", kw: ["charola"] },
];

/** Devuelve el arquetipo de un producto a partir de su nombre. */
export function clasificar(nombre) {
  const n = " " + normalize(nombre) + " ";
  for (const r of REGLAS) {
    if (r.kw.some((k) => n.includes(normalize(k)))) return r.tipo;
  }
  return null; // sin arquetipo → se cae a complementos por categoría
}

// Grafo de complementos: arquetipo → arquetipos que combinan con él (cross-sell).
// El orden de la lista define la prioridad al diversificar.
export const COMPLEMENTOS = {
  queso: ["jamon", "tocino", "tostada", "ate", "mermelada", "nuez", "vino", "crema", "chiles", "pan"],
  jamon: ["queso", "pan", "mayonesa", "mostaza", "tostada", "mantequilla"],
  pechuga: ["queso", "pan", "mayonesa", "mostaza", "tostada"],
  tocino: ["queso", "jamon", "pan", "salchicha", "mayonesa"],
  salchicha: ["mostaza", "mayonesa", "salsa", "pan", "tocino", "queso"],
  chorizo: ["queso", "tortillas", "salsa", "chiles", "crema"],
  embutido_rebanada: ["queso", "pan", "mayonesa", "tostada", "salsa"],
  carne_ahumada: ["salsa", "chiles", "tortillas", "queso"],
  crema: ["queso", "chiles", "tostada", "salsa", "tortillas", "chorizo"],
  mantequilla: ["pan", "mermelada", "leche", "cajeta"],
  margarina: ["pan", "mermelada", "leche"],
  yogurt: ["nuez", "mermelada", "danonino", "duraznos"],
  danonino: ["yogurt", "leche", "gelatina", "flan"],
  leche: ["pan", "mantequilla", "mermelada", "cajeta", "danonino", "yogurt"],
  flan: ["cajeta", "leche", "gelatina"],
  gelatina: ["crema", "danonino", "flan", "duraznos"],
  tostada: ["crema", "queso", "chiles", "salsa", "mayonesa", "jamon"],
  tortillas: ["queso", "crema", "chorizo", "chiles", "salsa"],
  pan: ["queso", "jamon", "mantequilla", "mermelada", "mayonesa", "cajeta", "leche"],
  chiles: ["queso", "crema", "tostada", "tortillas", "salsa", "chorizo"],
  salsa: ["tostada", "tortillas", "queso", "chiles", "salchicha", "chorizo"],
  mayonesa: ["jamon", "salchicha", "mostaza", "tostada"],
  mostaza: ["salchicha", "jamon", "mayonesa"],
  mermelada: ["pan", "mantequilla", "queso", "yogurt", "leche"],
  ate: ["queso", "pan", "nuez"],
  cajeta: ["pan", "leche", "nuez", "gelatina", "flan"],
  nuez: ["queso", "ate", "yogurt", "vino", "cajeta"],
  duraznos: ["crema", "gelatina", "yogurt"],
  tequila: ["refresco", "papas", "nuez", "cigarro"],
  vino: ["queso", "nuez", "ate", "jamon"],
  cerveza: ["papas", "salsa", "queso"],
  refresco: ["papas", "pan"],
  papas: ["salsa", "mayonesa", "refresco", "cerveza"],
  cigarro: ["tequila", "vino", "cerveza"],
  charola: ["vino", "pan", "queso", "tostada"],
};

// Cuántas recomendaciones generar por producto.
export const MAX_COMPLEMENTO = 8;
export const MAX_SIMILAR = 6;
