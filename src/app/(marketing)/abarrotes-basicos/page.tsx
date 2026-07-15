import type { Metadata } from "next";
import SectorPage from "@/components/marketing/SectorPage";

export const metadata: Metadata = {
  title: "Abarrotes Básicos por Mayoreo para Negocios | El Zarco",
  description: "Venta de latas, granos, salsas y básicos por caja. Abastece tu despensa industrial o tienda con los mejores precios de distribuidor B2B.",
  alternates: { canonical: "/abarrotes-basicos" },
};

const data = {
  "hero": {
    "desktop": "/assets/69ed69c6df12660fdd729f5b_BANNER-CREMERIA-1-3.webp",
    "mobile": "/assets/69ed69d4adb247f2de86ee40_12.webp",
    "alt": "Abarrotes Básicos - El Zarco Mayoreo"
  },
  "subnavLinks": [
    {
      "href": "#sec-aceites",
      "label": "Aceites y Salsas"
    },
    {
      "href": "#sec-conservas",
      "label": "Conservas y Latas"
    },
    {
      "href": "#sec-secos",
      "label": "Secos y Granos"
    },
    {
      "href": "#sec-beneficios",
      "label": "Rentabilidad"
    }
  ],
  "carousels": [
    {
      "id": "sec-aceites",
      "title": "Aceites, Aderezos y Salsas",
      "items": [
        {
          "unit": "CAJA",
          "name": "Aceite Comestible 123 (Caja 12 Pz)",
          "brand": "123",
          "image": "/assets/abarrotes/aceita_123_en_vez_de_maravilla.webp"
        },
        {
          "unit": "CAJA",
          "name": "Mayonesa Clásica McCormick 390g (Caja)",
          "brand": "MCCORMICK",
          "image": "/assets/abarrotes/mayonesa_mckormick.webp"
        },
        {
          "unit": "CAJA",
          "name": "Salsa Cátsup Bachi 3.8 Kg",
          "brand": "BACHI",
          "image": "/assets/abarrotes/catsup_bachi.webp"
        },
        {
          "unit": "BIDÓN",
          "name": "Aceite de Oliva Extra Virgen 5 L",
          "brand": "CARBONELL",
          "image": "/assets/aceite_de_oliva_extra_virgen_5_l.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Aderezo Tipo Mayonesa Bachi 3.8 Kg",
          "brand": "BACHI",
          "image": "/assets/abarrotes/mayonesa_bachi.webp"
        },
        {
          "unit": "BIDÓN",
          "name": "Aceite Comestible 20 Litros",
          "brand": "MARAVILLA",
          "image": "/assets/aceite_comestible_20_litros.webp"
        }
      ]
    },
    {
      "id": "sec-conservas",
      "title": "Conservas y Enlatados",
      "items": [
        {
          "unit": "LATA",
          "name": "Chiles Jalapeños Enteros La Costeña 2.8 Kg",
          "brand": "LA COSTEÑA",
          "image": "/assets/abarrotes/jalapenos_la_costena.webp"
        },
        {
          "unit": "LATA",
          "name": "Frijoles Bayos Refritos La Costeña 3 Kg",
          "brand": "LA COSTEÑA",
          "image": "/assets/abarrotes/frijoles_la_costena.webp"
        },
        {
          "unit": "CAJA",
          "name": "Atún en Aceite Dolores (Caja 24 Pz)",
          "brand": "DOLORES",
          "image": "/assets/abarrotes/atun_dolores.webp"
        },
        {
          "unit": "CAJA",
          "name": "Chiles Chipotles La Costeña 380 G",
          "brand": "LA COSTEÑA",
          "image": "/assets/abarrotes/8.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Aceituna Sin Hueso 13 Kg",
          "brand": "VALLE VERDE",
          "image": "/assets/abarrotes/aceituna_sin_hueso.webp"
        },
        {
          "unit": "LATA",
          "name": "Leche Condensada La Lechera",
          "brand": "NESTLÉ",
          "image": "/assets/leche_condensada_la_lechera.webp"
        }
      ]
    },
    {
      "id": "sec-secos",
      "title": "Básicos, Secos y Granos",
      "items": [
        {
          "unit": "BULTO",
          "name": "Azúcar Estándar Bulto 25 Kg",
          "brand": "ZULKA",
          "image": "/assets/abarrotes/azucar_25k.webp"
        },
        {
          "unit": "CAJA",
          "name": "Tostadas Charras (Caja)",
          "brand": "CHARRAS",
          "image": "/assets/abarrotes/11.webp"
        },
        {
          "unit": "KILO",
          "name": "Arroz Súper Extra Valle Verde 1 Kg",
          "brand": "POR ASIGNAR",
          "image": "/assets/abarrotes/arroz_valle_verde_1k.webp"
        },
        {
          "unit": "CAJA",
          "name": "Caldo de Pollo Knorr Suiza 1.5 Kg",
          "brand": "KNORR",
          "image": "/assets/abarrotes/caldo_de_polo_knopr.webp"
        },
        {
          "unit": "BULTO",
          "name": "Harina de Trigo Bulto 44 Kg",
          "brand": "POR ASIGNAR",
          "image": "/assets/harina_de_trigo_bulto_44_kg.webp"
        },
        {
          "unit": "CAJA",
          "name": "Pan Blanco Grande Bimbo",
          "brand": "BIMBO",
          "image": "/assets/pan_blanco_grande_bimbo.webp"
        }
      ]
    }
  ],
  "sectionHeader": "TU ALMACÉN SIEMPRE LISTO",
  "benefits": [
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon></svg>",
      "title": "Marcas Confiables",
      "text": "Distribuimos los abarrotes de mayor tradición en México (La Costeña, Heinz, McCormick) para que la base de tus platillos nunca cambie."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"></line><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      "title": "Precios de Bodega",
      "text": "Al no ser productos perecederos de corto plazo, puedes comprar volumen pesado con nosotros y congelar el costo de tus insumos clave."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line></svg>",
      "title": "Stock Ininterrumpido",
      "text": "Contamos con el músculo de almacenamiento de la Central de Abasto para garantizar que tus bidones, bultos y latas gigantes nunca falten."
    }
  ],
  "cta": {
    "title": "¿Necesitas llenar tu almacén seco?",
    "text": "Consolida todas tus compras de despensa en un solo proveedor mayorista y simplifica la logística de tu negocio.",
    "wa": "https://wa.me/525500000000?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20volumen%20de%20abarrotes%20y%20b%C3%A1sicos.",
    "btn": "COTIZAR ABARROTES AHORA"
  }
};

export default function Page() {
  return <SectorPage {...data} />;
}
