import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import GuideAccordion, { type GuideArticle } from "@/components/marketing/GuideAccordion";

export const metadata: Metadata = {
  title: "Guías de Negocio para Restaurantes y Tiendas | El Zarco",
  description: "Optimiza tu negocio con nuestras guías de insumos, tips de Food Service y estrategias de rentabilidad para restaurantes y cremerías. Lee a los expertos.",
  alternates: { canonical: "/guias-de-negocio" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const ARTICLES: GuideArticle[] = [
  {
    "number": "01",
    "category": "Exhibición Comercial",
    "title": "La \"Ceguera de Vitrina\": Cómo guiar el ojo de tu cliente",
    "contentHtml": "<p class=\"zarco-lead\">Si tu cliente entra por jamón económico y sale solo con eso, tu vitrina no está haciendo su trabajo. El cliente escanea en 4 segundos; ayúdalo a descubrir más.</p>\n                            <p>El instinto nos dice que pongamos lo que más se vende al frente. Sin embargo, esto hace que el cliente compre y se vaya sin mirar el resto. Tu margen neto apenas sobrevive si solo vendes los productos \"gancho\".</p>\n                            \n                            <blockquote class=\"zarco-quote\">\n                                \"El margen real se construye vendiendo lo que el cliente no sabía que se le iba a antojar.\"\n                            </blockquote>\n\n                            <p>Aplica el <strong>Efecto Ancla Visual</strong>. Manda el volumen a la parte inferior. A la altura de los ojos, exhibe quesos madurados y pechugas premium. Alterna los colores (rojo del embutido junto al blanco del queso) para crear contrastes que obliguen a la vista a detenerse.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Optimizar mi vitrina <span>⟶</span></a>"
  },
  {
    "number": "02",
    "category": "Calidad en Cocina",
    "title": "El costo oculto del queso \"listo para gratinar\"",
    "contentHtml": "<p class=\"zarco-lead\">Para pizzerías y restaurantes, el tiempo vale oro, pero comprar queso pre-rallado es pagar a precio de lácteo por ingredientes que arruinan tu receta.</p>\n                            <p>Las bolsas industriales usan almidón y celulosa para evitar que el queso se apelmace. Al hornearse, este polvo absorbe la humedad, bloquea el fundido, quema la superficie y suelta grasa innecesaria sobre tu comida, bajando la calidad percibida por tu comensal.</p>\n                            <p>Al comprar la horma sellada en <strong class=\"text-red\">El Zarco</strong> y rallarla en tu cocina, garantizas un gratinado sedoso y reduces tu costo unitario al no pagar por procesos industriales extra.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Cotizar hormas HORECA <span>⟶</span></a>"
  },
  {
    "number": "03",
    "category": "Ingeniería de Precios",
    "title": "Vender estatus: Cómo cobrar marcas premium sin asustar",
    "contentHtml": "<p class=\"zarco-lead\">En zonas residenciales, el cliente busca experiencias. Mostrar un precio global muy alto frena la compra por impulso.</p>\n                            <p>Ver una etiqueta de \"$580 por Kilo\" hace que el cliente racionalice el gasto de inmediato. La clave es fragmentar el precio. Mostrar \"$58 pesos por 100g\" se procesa en la mente como un gusto accesible que vale la pena probar para el fin de semana.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Ver catálogo Gourmet <span>⟶</span></a>"
  },
  {
    "number": "04",
    "category": "Cierre de Ventas",
    "title": "El poder de la muestra: Por qué dar a probar triplica tus ventas",
    "contentHtml": "<p class=\"zarco-lead\">El paladar es el mejor vendedor que tienes en tu negocio. Una lámina de 5 gramos puede cerrar una venta de cientos de pesos.</p>\n                            <p>Muchos tenderos ven las degustaciones como un \"gasto\" o merma. Sin embargo, ofrecer una pequeña rebanada de un queso madurado o un embutido artesanal mientras el cliente espera su pedido activa el principio de reciprocidad y elimina la duda sobre la calidad.</p>\n                            <blockquote class=\"zarco-quote\">\n                                \"No le expliques a qué sabe; dáselo a probar. El sabor convence más rápido que cualquier discurso.\"\n                            </blockquote>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Surtir quesos madurados <span>⟶</span></a>"
  },
  {
    "number": "05",
    "category": "Operaciones & Frío",
    "title": "La regla de los 15 minutos: Blindando la frescura",
    "contentHtml": "<p class=\"zarco-lead\">Una vez que la cadena de frío se rompe, el producto inicia un proceso de degradación que no se puede revertir metiéndolo de nuevo al refri.</p>\n                            <p>El estándar es simple: del camión repartidor a tu cámara en menos de 15 minutos. Un embutido que \"suda\" a temperatura ambiente pierde hasta el 25% de su vida útil. En tu vitrina, asegúrate de no bloquear las salidas de aire para que el frío fluya libremente sobre el producto.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Consultar logística de entregas <span>⟶</span></a>"
  },
  {
    "number": "06",
    "category": "Marketing HORECA",
    "title": "Ingeniería de Menú: Vende historias, no solo ingredientes",
    "contentHtml": "<p class=\"zarco-lead\">La forma en que describes un platillo en tu menú determina cuánto está dispuesto a pagar el cliente por él.</p>\n                            <p>No escribas simplemente \"Tabla de Quesos y Carnes\". Escribe: <em>\"Selección de curados artesanales, con Prosciutto de maduración lenta y Queso Brie atemperado\"</em>. Usar palabras que destaquen el origen y el proceso de nuestras marcas premium (como Bernina o Tangamanga) eleva automáticamente el valor percibido de tu cocina.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Cotizar marcas premium <span>⟶</span></a>"
  },
  {
    "number": "07",
    "category": "Rotación de Inventario",
    "title": "El \"Arte del Combo\": Resucitando mercancía lenta",
    "contentHtml": "<p class=\"zarco-lead\">Poner etiquetas fosforescentes de \"Descuento por Caducidad\" abarata la imagen de tu negocio. La clave está en agrupar.</p>\n                            <p>Toma el producto que se vende solo (ej. jamón tradicional) y empaquétalo junto a ese queso que necesitas mover. Véndelos bajo un solo precio como \"Combo Desayuno\". El cliente se lleva una solución práctica y tú evitas que el producto se convierta en pérdida total.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Optimizar mi inventario <span>⟶</span></a>"
  },
  {
    "number": "08",
    "category": "Precisión y Mermas",
    "title": "El peligro de las porciones al \"ojímetro\"",
    "contentHtml": "<p class=\"zarco-lead\">15 gramos extra regalados por plato parecen inofensivos, pero multiplicados por 50 clientes diarios en un mes, son kilos de tus ganancias tirados a la basura.</p>\n                            <p>Estandariza los procesos en tu cocina o mostrador. Pesa las proteínas en las horas tranquilas y guárdalas en bolsas individuales. Así garantizas que cada cliente reciba exactamente la misma porción y que tu margen de utilidad nunca dependa del cálculo de un empleado apresurado.</p>\n                            \n                            <a href=\"https://wa.me/522298477440\" target=\"_blank\" class=\"zarco-action-link\">Hablar con un asesor comercial <span>⟶</span></a>"
  }
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/guias-de-negocio/#page`,
  url: `${SITE_URL}/guias-de-negocio`,
  name: "Manual de Crecimiento Comercial",
  description:
    "Guías prácticas de exhibición, precios, mermas y logística para restaurantes, cremerías y tiendas abastecidos por El Zarco.",
  about: {
    "@type": "Thing",
    name: "Estrategias de venta y operación para negocios de abarrotes y Food Service",
  },
  author: { "@type": "Organization", name: "El Zarco", url: SITE_URL },
  publisher: { "@type": "Organization", name: "El Zarco", url: SITE_URL },
};

export default function GuiasDeNegocioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Navbar />
      <main className="bg-white pt-[calc(var(--navbar-h)+25px)] pb-24">
        <div className="mx-auto grid w-[90%] max-w-[1300px] grid-cols-1 gap-10 lg:grid-cols-[360px_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--navbar-h)+40px)] lg:self-start">
            <Reveal>
              <span className="mb-5 inline-flex items-center gap-2 text-xs font-extrabold tracking-[2px] text-brand-red uppercase">
                <span className="h-px w-6 bg-brand-red" />
                {ARTICLES.length} Guías · por El Zarco
              </span>
              <h1 className="mb-5 text-[2rem] leading-[1.15] font-black tracking-[-1px] text-brand-navy lg:text-[2.6rem]">
                Manual de <br />
                Crecimiento Comercial
              </h1>
              <p className="text-[1.05rem] leading-[1.7] text-slate-500">
                No somos solo tu proveedor; somos tu socio operativo. Hemos
                recopilado las mejores prácticas, estrategias de exhibición y
                consejos tácticos de la Central de Abastos para ayudarte a
                tapar fugas de dinero, atraer mejores clientes y hacer que tu
                negocio crezca con bases sólidas.
              </p>
            </Reveal>
          </div>

          <GuideAccordion articles={ARTICLES} />
        </div>
      </main>
      <Footer />
    </>
  );
}
