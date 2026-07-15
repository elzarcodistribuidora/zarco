import type { Metadata } from "next";
import SectorPage from "@/components/marketing/SectorPage";

export const metadata: Metadata = {
  title: "Proveedores de Insumos para Cafeterías | El Zarco Mayorista",
  description: "Ingredientes, lácteos y delicatessen para cafeterías y panaderías. Surtimos calidad constante para que tus clientes siempre regresen.",
  alternates: { canonical: "/cafeterias" },
};

const data = {
  "hero": {
    "desktop": "/assets/banner_cafeterias_desk.webp",
    "mobile": "/assets/banner_cafeterias_movil.webp",
    "alt": "Cafeterías El Zarco"
  },
  "subnavLinks": [
    {
      "href": "#sec-lacteos",
      "label": "Leches y Lácteos"
    },
    {
      "href": "#sec-embutidos",
      "label": "Para Paninis"
    },
    {
      "href": "#sec-abarrotes",
      "label": "Endulzantes"
    },
    {
      "href": "#sec-beneficios",
      "label": "Tus Beneficios"
    }
  ],
  "carousels": [
    {
      "id": "sec-lacteos",
      "title": "Leches, Cremas y Lácteos",
      "items": [
        {
          "unit": "CAJA",
          "name": "Leche Entera Alpura (Caja 12 Litros)",
          "brand": "ALPURA",
          "image": "/assets/6a04de937bb3ccfbc9e8b5f8_62.webp"
        },
        {
          "unit": "CAJA",
          "name": "Leche Deslactosada Lala (Caja 12 Litros)",
          "brand": "LALA",
          "image": "/assets/6a04de9382c90de2920c38bb_63.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Crema Barra Institucional 1.9 Kg",
          "brand": "PHILADELPHIA",
          "image": "/assets/6a04a49a8d75bcdf871816f0_31.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Mantequilla Pura de Vaca Bloque 1 Kg",
          "brand": "GLORIA",
          "image": "/assets/6a04de9228b265688a8fd620_64.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Crema para Batir Lyncott 1 L",
          "brand": "LYNCOTT",
          "image": "/assets/6a04de92dadbca97252becd3_65.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Gouda Kilo",
          "brand": "LA VILLITA",
          "image": "/assets/6a04de934689b24a1a2be31e_66.webp"
        }
      ]
    },
    {
      "id": "sec-embutidos",
      "title": "Embutidos para Chapatas y Paninis",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Pechuga de Pavo Virginia Barra",
          "brand": "ZWAN",
          "image": "/assets/6a04d4c1ce8a2be40b21c1ae_52.webp"
        },
        {
          "unit": "KILO",
          "name": "Chorizo español 1Kg",
          "brand": "TANGAMANGA",
          "image": "/assets/6a04e0bd298a8b0eb91405f6_72.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Jamón de Pierna Horneado Barra",
          "brand": "FUD",
          "image": "/assets/6a04de96ca91860d3a58b416_67.webp"
        },
        {
          "unit": "KILO",
          "name": "Pepperoni Rebanado",
          "brand": "TANGAMANGA",
          "image": "/assets/6a04ab375f621091434ab42d_36.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Jamón de Pavo Americano Barra 5 Kg",
          "brand": "FUD",
          "image": "/assets/6a04ab36375b172db000c47c_35.webp"
        },
        {
          "unit": "PAQUETE",
          "name": "Tocino Ahumado a Granel",
          "brand": "FUD",
          "image": "/assets/6a04ab369dbaf4a05fcff2f7_37.webp"
        }
      ]
    },
    {
      "id": "sec-abarrotes",
      "title": "Bases Culinarias y Endulzantes",
      "items": [
        {
          "unit": "CUBETA",
          "name": "Leche Condensada",
          "brand": "NESTLÉ",
          "image": "/assets/6a04de93fe832c5409cb5699_68.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Cajeta Quemada Cubeta 5 Kg",
          "brand": "CORONADO",
          "image": "/assets/6a04de934d46fc735d86cb37_69.webp"
        },
        {
          "unit": "CAJA",
          "name": "Chiles Chipotle 380g",
          "brand": "LA COSTEÑA",
          "image": "/assets/6a04d4c127ac8660fc8f2817_56.webp"
        },
        {
          "unit": "LATA",
          "name": "Duraznos Mitad 3Kg",
          "brand": "LA COSTEÑA",
          "image": "/assets/6a04e0bd3079d756edb20c1f_73.webp"
        },
        {
          "unit": "LATA",
          "name": "Crema para Café 250pz",
          "brand": "LYNCOTT",
          "image": "/assets/6a04de93c22d06e9ee632e0d_71.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Mermelada de Fresa Institucional 5 Kg",
          "brand": "MCCORMICK",
          "image": "/assets/6a04de931faeedfc91c18ffe_70.webp"
        }
      ]
    }
  ],
  "sectionHeader": "TU BARRA OPERANDO AL 100%",
  "benefits": [
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      "title": "Ahorro que se Nota",
      "text": "Deja de comprar cajas de leche a precio de supermercado. Nuestro volumen de matriz te permite bajar el costo por taza y aumentar tu margen operativo."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path></svg>",
      "title": "Calidad Constante",
      "text": "Garantiza que cada sándwich, cuernito y bebida sepa exactamente igual siempre, utilizando las mismas marcas premium en cada preparación."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"></path><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"></line></svg>",
      "title": "Stock Ininterrumpido",
      "text": "Evita compras de emergencia que rompen tu día. Te entregamos el volumen exacto que tu menú necesita para no negar ni un solo servicio."
    }
  ],
  "cta": {
    "title": "¿Tu cafetería tiene alto flujo?",
    "text": "Protege tu barra de los faltantes y mejora tu costo. Habla con un ejecutivo especializado en cafeterías y armemos el pedido ideal para tu menú.",
    "wa": "https://wa.me/525500000000?text=Hola,%20tengo%20una%20cafeter%C3%ADa%20y%20me%20gustar%C3%ADa%20cotizar%20mis%20insumos.",
    "btn": "COTIZAR INSUMOS AHORA"
  }
};

export default function Page() {
  return <SectorPage {...data} />;
}
