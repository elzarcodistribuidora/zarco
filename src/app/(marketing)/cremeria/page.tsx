import type { Metadata } from "next";
import SectorPage from "@/components/marketing/SectorPage";

export const metadata: Metadata = {
  title: "Venta de Quesos y Lácteos por Mayoreo | El Zarco",
  description: "Catálogo de quesos, cremas y lácteos a precio de distribuidor. Frescura y rendimiento en bloque o por caja para tu producción alimentaria.",
  alternates: { canonical: "/cremeria" },
};

const data = {
  "hero": {
    "desktop": "/assets/69ed69c62792d2380d536c04_BANNER-CREMERIA-1.webp",
    "mobile": "/assets/69ed69d48dd8de50c76f5d9e_10.webp",
    "alt": "Cremería y Lácteos - El Zarco Mayoreo"
  },
  "subnavLinks": [
    {
      "href": "#sec-frescos",
      "label": "Quesos Frescos"
    },
    {
      "href": "#sec-madurados",
      "label": "Quesos para Gratinar"
    },
    {
      "href": "#sec-cremas",
      "label": "Cremas y Mantequillas"
    },
    {
      "href": "#sec-beneficios",
      "label": "Calidad"
    }
  ],
  "carousels": [
    {
      "id": "sec-frescos",
      "title": "Quesos Frescos y de Mesa",
      "items": [
        {
          "unit": "KILO",
          "name": "Queso Oaxaca Tradicional El Zarco",
          "brand": "EL ZARCO",
          "image": "/assets/queso_oaxaca_tradicional_el_zarco.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Panela a Granel",
          "brand": "LA VILLITA",
          "image": "/assets/6a04d4c0a50da9d064471037_48.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Canasto Barra para Rebanar",
          "brand": "EL ZARCO",
          "image": "/assets/6a04d4c034d88bd3bbbba718_50.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Fresco Empacado 400g",
          "brand": "LA VILLITA",
          "image": "/assets/cremeria/queso_fresco_la_villita.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Cotija Añejo",
          "brand": "POR ASIGNAR",
          "image": "/assets/cremeria/queso_cotija_anejo_excelsior.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Doble Crema",
          "brand": "CHILCHOTA",
          "image": "/assets/cremeria/queso_doble_crema_chilchota.webp"
        }
      ]
    },
    {
      "id": "sec-madurados",
      "title": "Quesos Madurados y para Gratinar",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Queso Manchego Nochebuena Barra",
          "brand": "NOCHEBUENA",
          "image": "/assets/cremeria/queso_manchego_nochebuena_barra.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Amarillo Americano Paq. 140 Rebanadas",
          "brand": "ZWAN",
          "image": "/assets/queso_amarillo_americano_paq__140_rebanadas.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Gouda Edam Barra",
          "brand": "GALLO",
          "image": "/assets/cremeria/queso_gouda_edam_barra.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Asadero Fundido",
          "brand": "EL ZARCO",
          "image": "/assets/cremeria/queso_asadero_la_villita.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Mozzarella Barra",
          "brand": "LALA",
          "image": "/assets/cremeria/queso_mozarella_rayado_lala.webp"
        },
        {
          "unit": "KILO",
          "name": "Margarina Iberia Bloque 1 Kg",
          "brand": "IBERIA",
          "image": "/assets/6a04a49a6bfaff416ae73dd1_32.webp"
        }
      ]
    },
    {
      "id": "sec-cremas",
      "title": "Cremas, Mantequillas y Yogurts",
      "items": [
        {
          "unit": "CAJA",
          "name": "Yogurt Alpura 125 G (Caja 24 Pz)",
          "brand": "ALPURA",
          "image": "/assets/cremeria/yougurt_alpura_125g_caja_24pz.webp"
        },
        {
          "unit": "CAJA",
          "name": "Crema Lala 200 Ml (Caja 24 Pz)",
          "brand": "LALA",
          "image": "/assets/cremeria/crema_lala_200ml_caja_24_pz.webp"
        },
        {
          "unit": "CAJA",
          "name": "Danonino Bebible 90 G (Pack)",
          "brand": "DANONINO",
          "image": "/assets/cremeria/danonino_pack_bebible.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Crema Entera Alpura 1 Litro",
          "brand": "ALPURA",
          "image": "/assets/cremeria/crema_enetra_alpura_1l.webp"
        },
        {
          "unit": "CAJA",
          "name": "Yogurt Yoplait Fresa 1 Litro (Pack)",
          "brand": "YOPLAIT",
          "image": "/assets/cremeria/yoplait_fresa_1l.webp"
        },
        {
          "unit": "KILO",
          "name": "Crema Premium a Granel",
          "brand": "EL ZARCO",
          "image": "/assets/cremeria/yougurt_a_granel.webp"
        }
      ]
    }
  ],
  "sectionHeader": "NUESTRO ESTÁNDAR DE CALIDAD",
  "benefits": [
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      "title": "Rendimiento en Cocina",
      "text": "Seleccionamos quesos con excelente capacidad de fundición, estiramiento y que no desueran, ideales para planchas y hornos."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"></line><line x1=\"12\" y1=\"12\" x2=\"19.07\" y2=\"19.07\"></line><line x1=\"12\" y1=\"12\" x2=\"4.93\" y2=\"4.93\"></line><line x1=\"12\" y1=\"12\" x2=\"4.93\" y2=\"19.07\"></line><line x1=\"12\" y1=\"12\" x2=\"19.07\" y2=\"4.93\"></line><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line></svg>",
      "title": "Cadena de Frío Intacta",
      "text": "Tus lácteos nunca pierden temperatura. Del camión refrigerado a nuestras cámaras y de ahí directo a tu negocio para máxima frescura."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon></svg>",
      "title": "Marcas Líderes",
      "text": "Trabajamos directo con Lala, Alpura, Fud, Nochebuena, Lyncott y las marcas que exigen los chefs y restaurantes más reconocidos."
    }
  ],
  "cta": {
    "title": "¿Buscas mejor precio en tus lácteos?",
    "text": "Cotiza volumen de cremería y descubre cómo puedes bajar tus costos de insumos sin sacrificar la calidad de tus platillos.",
    "wa": "https://wa.me/525500000000?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20insumos%20de%20cremer%C3%ADa%20y%20l%C3%A1cteos.",
    "btn": "COTIZAR LÁCTEOS AHORA"
  }
};

export default function Page() {
  return <SectorPage {...data} />;
}
