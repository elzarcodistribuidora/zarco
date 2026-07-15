import type { Metadata } from "next";
import SectorPage from "@/components/marketing/SectorPage";

export const metadata: Metadata = {
  title: "Distribuidora de Carnes Frías y Embutidos B2B | El Zarco",
  description: "Maximiza tus ganancias con nuestros embutidos por mayoreo. Jamones, salchichas y tocino de alto rendimiento para pizzerías y cocinas.",
  alternates: { canonical: "/embutidos" },
};

const data = {
  "hero": {
    "desktop": "/assets/69ed69c65185651bc5d0b09a_BANNER-CREMERIA-1-2.webp",
    "mobile": "/assets/69ed69d4aef0cddd328e4c74_11.webp",
    "alt": "Embutidos y Salchichonería - El Zarco Mayoreo"
  },
  "subnavLinks": [
    {
      "href": "#sec-jamones",
      "label": "Jamones"
    },
    {
      "href": "#sec-salchichas",
      "label": "Salchichas y Chorizos"
    },
    {
      "href": "#sec-especialidades",
      "label": "Tocinos y Especiales"
    },
    {
      "href": "#sec-beneficios",
      "label": "Calidad"
    }
  ],
  "carousels": [
    {
      "id": "sec-jamones",
      "title": "Jamones, Pavos y Piernas",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Jamón Americano Fud Barra 5 Kg",
          "brand": "FUD",
          "image": "/assets/6a04ab36375b172db000c47c_35.webp"
        },
        {
          "unit": "KILO",
          "name": "Jamón de Pierna Zwan Barra 5.97 Kg",
          "brand": "ZWAN",
          "image": "/assets/6a04ab36d8d389663b121550_38.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Pechuga de Pavo Virginia Zwan",
          "brand": "ZWAN",
          "image": "/assets/embutidos/pechuga_de_pavo_virginia_zwan.webp"
        },
        {
          "unit": "KILO",
          "name": "Jamón York Bernina Rebanado",
          "brand": "BERNINA",
          "image": "/assets/embutidos/jamon_york_bernina_rebanado.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Jamón Virginia de Pavo Alpino Barra",
          "brand": "ALPINO",
          "image": "/assets/embutidos/jamon_virginia_de_pavo_alpino_barra.webp"
        },
        {
          "unit": "KILO",
          "name": "Jamón Americano El Mexicano 5.3 Kg",
          "brand": "EL MEXICANO",
          "image": "/assets/embutidos/jamon_americano_el_mexicano_en_vez_de_loyval_de_5.3kg.webp"
        }
      ]
    },
    {
      "id": "sec-salchichas",
      "title": "Salchichas, Chorizos y Longanizas",
      "items": [
        {
          "unit": "PAQUETE",
          "name": "Salchicha Viena Fud 2 Kg",
          "brand": "FUD",
          "image": "/assets/salchicha_viena_fud_2_kg.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Salchicha Frankfurt Pavo 2.4 Kg",
          "brand": "ALPINO",
          "image": "/assets/salchicha_frankfurt_pavo_2_4_kg.webp"
        },
        {
          "unit": "KILO",
          "name": "Chorizo Ranchero El Mexicano Granel",
          "brand": "EL MEXICANO",
          "image": "/assets/6a04ab3634e96d2a6cab2738_40.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Chorizo Argentino 330 G",
          "brand": "TANGAMANGA",
          "image": "/assets/embutidos/chorizo_argentino_zwan.webp"
        },
        {
          "unit": "PAQUETE",
          "name": "Salchicha para Asar Campestre",
          "brand": "FUD",
          "image": "/assets/embutidos/salchicha_para_asar_campestre_bafar.webp"
        },
        {
          "unit": "KILO",
          "name": "Longaniza Tradicional",
          "brand": "EL MEXICANO",
          "image": "/assets/longaniza_tradicional.webp"
        }
      ]
    },
    {
      "id": "sec-especialidades",
      "title": "Tocinos y Especialidades",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Pepperoni Tangamanga Barra 2 Kg",
          "brand": "TANGAMANGA",
          "image": "/assets/pepperoni_tangamanga_barra_2_kg.webp"
        },
        {
          "unit": "KILO",
          "name": "Tocino Ahumado Paquete Institucional",
          "brand": "FUD",
          "image": "/assets/tocino_ahumado_paquete_institucional.webp"
        },
        {
          "unit": "KILO",
          "name": "Salami Madurado para Panini",
          "brand": "TANGAMANGA",
          "image": "/assets/embutidos/salami_madurado_tangamanga.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso de Puerco Tradicional",
          "brand": "FUD",
          "image": "/assets/6a04d4c14077de30942f44db_54.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Mortadela Fud Barra",
          "brand": "FUD",
          "image": "/assets/embutidos/mortadela_fud_barra.webp"
        },
        {
          "unit": "KILO",
          "name": "Chilorio de Cerdo Empacado",
          "brand": "CHATA",
          "image": "/assets/embutidos/chilorio_de_cerdo_chata.webp"
        }
      ]
    }
  ],
  "sectionHeader": "NUESTRO ESTÁNDAR DE CALIDAD",
  "benefits": [
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line></svg>",
      "title": "Rendimiento de Corte",
      "text": "Textura y amarre ideal que evita desmoronamientos al pasar por la rebanadora, asegurando que cobres exactamente cada gramo que compras."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      "title": "Variedad de Líneas",
      "text": "Desde opciones económicas de alto volumen para comedores, hasta líneas premium y de pavo para restaurantes y delicatessen."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline></svg>",
      "title": "Rotación Continua",
      "text": "Recibimos embarques directos de planta todos los días, lo que garantiza que recibas productos con la caducidad más larga del mercado."
    }
  ],
  "cta": {
    "title": "¿Buscas abastecer tu área de carnes frías?",
    "text": "Accede a precios de distribuidor mayorista y asegura el volumen que tu negocio necesita para el fin de semana.",
    "wa": "https://wa.me/525500000000?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20volumen%20de%20embutidos%20y%20carnes%20fr%C3%ADas.",
    "btn": "COTIZAR EMBUTIDOS AHORA"
  }
};

export default function Page() {
  return <SectorPage {...data} />;
}
