import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Terminos del servicio",
  alternates: { canonical: "/terminos-del-servicio" },
};

const sections: LegalSection[] = [
  {
    id: "precios",
    navLabel: "1. Sobre los Precios",
    title: "1. Sobre los Precios de la Página",
    paragraphs: [
      "Sabemos que en la Central de Abasto los precios cambian todos los días dependiendo del mercado. Por eso, queremos ser muy claros contigo:",
    ],
    items: [
      <>
        <strong className="font-extrabold text-brand-navy">Precios de Guía:</strong> Los
        precios que ves en esta página son para que te des una idea y
        calcules tu pedido, pero{" "}
        <strong className="font-extrabold text-brand-navy">no son definitivos</strong>.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">El Precio Final:</strong> Cuando
        nos mandes tu pedido por WhatsApp, tu vendedor te va a confirmar el
        total exacto con los precios de ese mismo día. Ese será el total a
        pagar.
      </>,
      <>
        Nos reservamos el derecho de corregir cualquier precio si hubo
        algún error al subirlo a la página.
      </>,
    ],
  },
  {
    id: "devoluciones",
    navLabel: "2. Entregas y Devoluciones",
    title: "2. Entregas, Caducidades y Devoluciones",
    paragraphs: [
      "Manejamos quesos, lácteos y carnes frías que necesitan refrigeración. Para proteger la salud de tus clientes y la nuestra, trabajamos así:",
    ],
    items: [
      <>
        <strong className="font-extrabold text-brand-navy">Zonas y Mínimos:</strong> Entregamos
        en la CDMX y Área Metropolitana. Dependiendo de dónde estés, tu
        vendedor te dirá si hay un mínimo de compra para que el envío sea
        gratis.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Revisa frente al chofer:</strong>{" "}
        Cuando llegue tu pedido, por favor revisa que todo venga completo,
        bien pesado y fresco.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">
          Firmado y Recibido, NO hay devoluciones:
        </strong>{" "}
        Una vez que firmas de recibido o el chofer se retira,{" "}
        <strong className="font-extrabold text-brand-navy">
          no aceptamos devoluciones de productos refrigerados
        </strong>
        . Esto es porque nosotros no podemos garantizar si el producto se
        quedó fuera del refri en tu negocio.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Defectos de fábrica:</strong> Si
        una lata sale golpeada por dentro o un producto viene mal de
        fábrica, repórtalo el mismo día para hacerte el cambio con la
        marca.
      </>,
    ],
  },
  {
    id: "pagos",
    navLabel: "3. Formas de Pago",
    title: "3. Formas de Pago",
    paragraphs: ["En El Zarco Mayoreo nos gusta hacer negocios claros y rápidos:"],
    items: [
      <>
        <strong className="font-extrabold text-brand-navy">Nuevos Clientes:</strong> Todo
        pedido se paga{" "}
        <strong className="font-extrabold text-brand-navy">de contado a la entrega</strong> (le
        pagas al chofer) o mediante{" "}
        <strong className="font-extrabold text-brand-navy">Transferencia Electrónica</strong>{" "}
        (nos mandas el comprobante antes de que salga el camión).
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Créditos:</strong> Si quieres
        crédito para tu restaurante o negocio, necesitas llenar una
        solicitud, darnos papelería y pasar por una revisión. Hasta no
        tener el crédito aprobado por escrito, todo es de contado.
      </>,
    ],
  },
  {
    id: "uso-pagina",
    navLabel: "4. Uso de la Página",
    title: "4. Sobre el Uso de esta Página",
    paragraphs: [
      "Esta página web es una herramienta para que armes tu lista del mandado fácil y rápido.",
    ],
    items: [
      <>
        El &quot;Carrito&quot; de esta página no cobra ni te pide tarjeta.
        Solo arma un resumen en texto para mandarlo directo a nuestro
        WhatsApp.
      </>,
      <>
        Las fotos que usamos son de referencia. La presentación o la
        etiqueta de la marca pueden cambiar un poco dependiendo del lote
        que nos llegue de fábrica.
      </>,
    ],
  },
];

const priceNotice = (
  <div className="mx-auto mb-10 max-w-[700px] border-l-2 border-amber-500 pl-5">
    <h3 className="mb-1 text-[0.95rem] font-bold text-amber-800">
      Nota Importante de Precios
    </h3>
    <p className="text-[0.85rem] leading-[1.5] text-amber-900/80">
      <strong>Los precios mostrados son exclusivamente de referencia.</strong>{" "}
      Debido a la constante actualización y volatilidad del mercado en
      tienda física, el total final de su pedido podría tener
      variaciones. El precio definitivo será confirmado por nuestros
      agentes al procesar su solicitud.
    </p>
  </div>
);

export default function TerminosDelServicioPage() {
  return (
    <LegalPage
      title="Nuestras Políticas de"
      titleAccent="Venta"
      description={
        <>
          Última actualización: Abril 2026. <br />
          Aquí te explicamos de forma sencilla cómo trabajamos en El Zarco
          para darte el mejor servicio.
        </>
      }
      sections={sections}
      notice={priceNotice}
    />
  );
}
