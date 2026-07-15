import type { Metadata } from "next";
import SectorPage from "@/components/marketing/SectorPage";

export const metadata: Metadata = {
  title: "Mayoristas para Abarrotes, Tiendas y Cremerías | El Zarco",
  description: "Surte tu negocio con los mejores márgenes. Distribución de quesos, carnes frías y abarrotes básicos directo hasta la puerta de tu local.",
  alternates: { canonical: "/tiendas" },
};

const data = {
  "hero": {
    "desktop": "/assets/banner_tiendas_desk.webp",
    "mobile": "/assets/banner_tiendas_movil.webp",
    "alt": "Tiendas El Zarco"
  },
  "subnavLinks": [
    {
      "href": "#sec-lacteos",
      "label": "Quesos y Lácteos"
    },
    {
      "href": "#sec-embutidos",
      "label": "Salchichonería"
    },
    {
      "href": "#sec-abarrotes",
      "label": "Abarrotes Básicos"
    },
    {
      "href": "#sec-beneficios",
      "label": "Tus Beneficios"
    }
  ],
  "carousels": [
    {
      "id": "sec-lacteos",
      "title": "Quesos y Lácteos para Vitrina",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Queso Oaxaca Tradicional",
          "brand": "EL ZARCO",
          "image": "/assets/6a04a49a569d5532861a9cce_34.webp"
        },
        {
          "unit": "CAJA",
          "name": "Yogurt Alpura 125 G (Caja 24 Pz)",
          "brand": "ALPURA",
          "image": "/assets/6a04d4c1c4528c80818f0ef0_47.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Panela a Granel",
          "brand": "LA VILLITA",
          "image": "/assets/6a04d4c0a50da9d064471037_48.webp"
        },
        {
          "unit": "CAJA",
          "name": "Crema Lala 200 Ml (Caja 24 Pz)",
          "brand": "LALA",
          "image": "/assets/6a04d4c19be6afa34f418e92_49.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Canasto Barra para Rebanar",
          "brand": "CAMELIA",
          "image": "/assets/6a04d4c034d88bd3bbbba718_50.webp"
        },
        {
          "unit": "CAJA",
          "name": "Danonino Bebible 90 G (Pack)",
          "brand": "DANONINO",
          "image": "/assets/6a04d4c0bb29f6a60ace70f2_51.webp"
        }
      ]
    },
    {
      "id": "sec-embutidos",
      "title": "Salchichonería de Alta Rotación",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Jamón Americano Fud Barra 5 Kg",
          "brand": "FUD",
          "image": "/assets/6a04ab36375b172db000c47c_35.webp"
        },
        {
          "unit": "PAQUETE",
          "name": "Salchicha Viena 2 Kg",
          "brand": "FUD",
          "image": "/assets/6a04d4c11a1088138321ca6f_53.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Jamón Virginia de Pavo Barra",
          "brand": "ZWAN",
          "image": "/assets/6a04d4c1ce8a2be40b21c1ae_52.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso de Puerco Tradicional",
          "brand": "FUD",
          "image": "/assets/6a04d4c14077de30942f44db_54.webp"
        },
        {
          "unit": "KILO",
          "name": "Tocino Ahumado a Granel",
          "brand": "BERNINA",
          "image": "/assets/6a04d4c1f3dcbd6b5827c696_55.webp"
        },
        {
          "unit": "KILO",
          "name": "Chorizo Ranchero",
          "brand": "EL MEXICANO",
          "image": "/assets/6a04ab3634e96d2a6cab2738_40.webp"
        }
      ]
    },
    {
      "id": "sec-abarrotes",
      "title": "Abarrotes y Básicos",
      "items": [
        {
          "unit": "CAJA",
          "name": "Chiles Chipotles 380 G ",
          "brand": "LA COSTEÑA",
          "image": "/assets/6a04d4c127ac8660fc8f2817_56.webp"
        },
        {
          "unit": "CAJA",
          "name": "Boing Sabores Caja 12 pz / 1 L",
          "brand": "BOING",
          "image": "/assets/6a04d4c18a0a2a0734525a1a_60.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Mayonesa Clásica 3.4 KG",
          "brand": "MCCORMICK",
          "image": "/assets/6a04d4c1cbbf97d43381a03a_57.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Pan Blanco Grande",
          "brand": "BIMBO",
          "image": "/assets/6a04d4c1810bc21d93f754d8_58.webp"
        },
        {
          "unit": "CAJA",
          "name": "Café Olé Sabores Caja 12 pz",
          "brand": "OLE",
          "image": "/assets/6a04d4c197edbfd1320f1858_61.webp"
        },
        {
          "unit": "CAJA",
          "name": "Tostada Charras (Caja 18 Pz)",
          "brand": "CHARRAS",
          "image": "/assets/6a04d4c14076a0b8182558cc_59.webp"
        }
      ]
    }
  ],
  "sectionHeader": "TU LOCAL COMPITIENDO AL MÁXIMO NIVEL",
  "benefits": [
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      "title": "Máxima Utilidad",
      "text": "Compra volumen a precio de matriz. Al despachar por cuartos o medios kilos, tu margen de ganancia se multiplica significativamente."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path></svg>",
      "title": "Rotación Constante",
      "text": "Te abastecemos de los productos que la gente realmente busca todos los días. Cero merma en tus refrigeradores."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"></path><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"></line></svg>",
      "title": "Portafolio Completo",
      "text": "Desde marcas económicas de batalla hasta las líneas premium que exigen los clientes más selectos de tu zona."
    }
  ],
  "cta": {
    "title": "¿Necesitas surtir tu local hoy mismo?",
    "text": "Atrae más clientes a tu negocio con vitrinas llenas y productos frescos. Habla con un asesor y diseñemos tu esquema de abasto ideal.",
    "wa": "https://wa.me/525500000000?text=Hola,%20tengo%20una%20tienda/cremer%C3%ADa%20y%20me%20gustar%C3%ADa%20cotizar%20surtido.",
    "btn": "COTIZAR SURTIDO AHORA"
  }
};

export default function Page() {
  return <SectorPage {...data} />;
}
