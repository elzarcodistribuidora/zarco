import type { Metadata } from "next";
import SectorPage from "@/components/marketing/SectorPage";

export const metadata: Metadata = {
  title: "Proveedor de Alimentos para Restaurantes CDMX | El Zarco",
  description: "Soluciones de abasto para el sector restaurantero. Carnes frías, lácteos y básicos por mayoreo para optimizar el costo de tu menú. Pide hoy.",
  alternates: { canonical: "/restaurantes" },
};

const data = {
  "hero": {
    "desktop": "/assets/banner_restaurantes_desk.webp",
    "mobile": "/assets/banner_restaurantes_movil.webp",
    "alt": "Restaurantes El Zarco"
  },
  "subnavLinks": [
    {
      "href": "#sec-lacteos",
      "label": "Lácteos"
    },
    {
      "href": "#sec-embutidos",
      "label": "Embutidos"
    },
    {
      "href": "#sec-abarrotes",
      "label": "Abarrotes"
    },
    {
      "href": "#sec-beneficios",
      "label": "Beneficios"
    }
  ],
  "carousels": [
    {
      "id": "sec-lacteos",
      "title": "Lácteos para Alto Rendimiento",
      "items": [
        {
          "unit": "CUBETA",
          "name": "Crema Entera Alpura 4 Litros",
          "brand": "ALPURA",
          "image": "/assets/6a04a49ab7ede5b5ee0a965a_29.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Manchego Nochebuena Barra 4Kg",
          "brand": "NOCHEBUENA",
          "image": "/assets/6a04a49a69f73472295e287a_30.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Queso Philadelphia 1.9Kg",
          "brand": "PHILADELPHIA",
          "image": "/assets/6a04a49a8d75bcdf871816f0_31.webp"
        },
        {
          "unit": "KILO",
          "name": "Queso Oaxaca El Zarco Alto Rendimiento",
          "brand": "EL ZARCO",
          "image": "/assets/6a04a49a569d5532861a9cce_34.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Leche Alpura Entera Caja 12 pz / 1 L",
          "brand": "Alpura",
          "image": "/assets/6a04a49a8a8f909a3fe62c13_33.webp"
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
      "id": "sec-embutidos",
      "title": "Cortes y Embutidos",
      "items": [
        {
          "unit": "PIEZA",
          "name": "Jamón Americano Fud Barra 5 Kg",
          "brand": "FUD",
          "image": "/assets/6a04ab36375b172db000c47c_35.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Pepperoni Tangamanga 500g",
          "brand": "TANGAMANGA",
          "image": "/assets/6a04ab375f621091434ab42d_36.webp"
        },
        {
          "unit": "KILO",
          "name": "Tocino Ahumado Fud Paquete Institucional",
          "brand": "FUD",
          "image": "/assets/6a04ab369dbaf4a05fcff2f7_37.webp"
        },
        {
          "unit": "KILO",
          "name": "Jamón de Pierna Zwan Barra 5.97 Kg",
          "brand": "ZWAN",
          "image": "/assets/6a04ab36d8d389663b121550_38.webp"
        },
        {
          "unit": "PIEZA",
          "name": "Salchicha Frankfurt Pavo Alpino 2.4 kg",
          "brand": "Alpino",
          "image": "/assets/6a04ab366965456032fc76a0_39.webp"
        },
        {
          "unit": "KILO",
          "name": "Chorizo Ranchero El Mexicano Granel",
          "brand": "EL MEXICANO",
          "image": "/assets/6a04ab3634e96d2a6cab2738_40.webp"
        }
      ]
    },
    {
      "id": "sec-abarrotes",
      "title": "Bases Culinarias y Abarrotes",
      "items": [
        {
          "unit": "LATA",
          "name": "Chiles Jalapeños La Costeña 3.65 Kg",
          "brand": "LA COSTEÑA",
          "image": "/assets/6a04ab36ca250945d80a0b20_41.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Chiles Chipotles Carey 2.8 kg",
          "brand": "CAREY",
          "image": "/assets/6a04ab368bf2169d4af7d554_46.webp"
        },
        {
          "unit": "CUBETA",
          "name": "Aderezo Bachi Mayonesa 3.8 Kg",
          "brand": "BACHI",
          "image": "/assets/6a04ab367f95969dd5bfeaa3_42.webp"
        },
        {
          "unit": "CAJA",
          "name": "Aceite Oliva Carbonell Caja 12 pz / 500 ml",
          "brand": "CARBONELL",
          "image": "/assets/6a04ab36bb3c9dfacc92cd91_43.webp"
        },
        {
          "unit": "LATA",
          "name": "Frijoles Bayos Refritos La Costeña 820 g",
          "brand": "LA COSTEÑA",
          "image": "/assets/6a04ab36a1648860e9da16f0_44.webp"
        },
        {
          "unit": "LATA",
          "name": "Salsa Catsup Bachi 3.8 kg",
          "brand": "BACHI",
          "image": "/assets/6a04ab3607188bb753c35761_45.webp"
        }
      ]
    }
  ],
  "sectionHeader": "TU COMPRA INTELIGENTE EN LA CENTRAL",
  "benefits": [
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"></line><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      "title": "Precios Directos",
      "text": "Cero revendedores. Compras directo desde bodega para que el costo de tu platillo baje y tu margen crezca."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path></svg>",
      "title": "Inventario Seguro",
      "text": "Tu cocina no puede parar. Tenemos el volumen pesado que tu restaurante necesita para operar sin pausas ni excusas."
    },
    {
      "iconSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5\"></path><path d=\"M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0017 4h-10c-.8 0-1.5.5-1.8 1.1z\"></path></svg>",
      "title": "Cuidado del Producto",
      "text": "Refrigeración impecable que protege la vida útil, textura y rendimiento de cada queso y embutido que despachamos."
    }
  ],
  "cta": {
    "title": "¿Tu cocina exige alto volumen?",
    "text": "No te quedes sin inventario en fin de semana. Habla con un ejecutivo especializado en el sector restaurantero y diseñemos tu logística de abasto.",
    "wa": "https://wa.me/525500000000?text=Hola,%20tengo%20un%20restaurante%20y%20me%20gustar%C3%ADa%20cotizar%20volumen%20de%20abasto.",
    "btn": "COTIZAR POR WHATSAPP"
  }
};

export default function Page() {
  return <SectorPage {...data} />;
}
