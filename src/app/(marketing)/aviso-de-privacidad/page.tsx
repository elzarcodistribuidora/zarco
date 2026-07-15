import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  alternates: { canonical: "/aviso-de-privacidad" },
};

const sections: LegalSection[] = [
  {
    id: "datos-pedimos",
    navLabel: "1. ¿Qué datos pedimos?",
    title: "1. ¿Qué datos te pedimos?",
    paragraphs: [
      "No te pedimos nada raro. Solo recopilamos la información básica y necesaria para poder surtirte y facturarte sin contratiempos:",
    ],
    items: [
      <>
        <strong className="font-extrabold text-brand-navy">Datos de Contacto:</strong> Tu
        nombre, el nombre de tu negocio, tu número de celular (WhatsApp) y
        correo electrónico (cuando inicias sesión con Google en nuestro
        portal).
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Datos Operativos:</strong> La
        dirección exacta de entrega para que nuestro camión sepa a dónde
        llevar tu mercancía.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Datos de Facturación:</strong> Si
        requieres factura, te pediremos tu RFC, Razón Social, Régimen Fiscal
        y Código Postal.
      </>,
    ],
  },
  {
    id: "para-que",
    navLabel: "2. ¿Para qué los usamos?",
    title: "2. ¿Para qué usamos tu información?",
    paragraphs: [
      "Tus datos son tu herramienta de trabajo, y los usamos estrictamente para darte servicio:",
    ],
    items: [
      <>
        <strong className="font-extrabold text-brand-navy">Para cotizarte y venderte:</strong>{" "}
        Usamos tu WhatsApp para mandarte el total de tu pedido, confirmar si
        hay existencias y avisarte cuando tu pedido vaya en camino.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Para entregar:</strong> Compartimos
        tu dirección con nuestra flotilla para la logística de ruta.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Para facturación:</strong> Usamos
        tus datos fiscales exclusivamente para generar tus facturas ante el
        SAT.
      </>,
      <>
        <strong className="font-extrabold text-brand-navy">Para el Portal B2B:</strong> Tu
        cuenta de Google nos sirve para guardarte un &quot;Historial de
        Pedidos&quot; y que no tengas que empezar de cero cada semana.
      </>,
    ],
  },
  {
    id: "compartimos",
    navLabel: "3. ¿Con quién los compartimos?",
    title: "3. ¿Se los pasamos a alguien más?",
    paragraphs: [
      "Cero ventas de bases de datos. En El Zarco nos tomamos la privacidad muy en serio:",
    ],
    items: [
      <>
        No vendemos, rentamos ni prestamos tu número de WhatsApp ni tu
        información a ninguna otra empresa o proveedor.
      </>,
      <>
        Tu información <strong className="font-extrabold text-brand-navy">no sale de nuestra matriz</strong>. Las
        únicas personas que ven tus datos son nuestros ejecutivos de ventas,
        los choferes (para saber dónde entregar) y nuestro departamento
        contable (para tus facturas).
      </>,
    ],
  },
  {
    id: "tus-derechos",
    navLabel: "4. Tus Derechos (ARCO)",
    title: "4. Tus Derechos (ARCO)",
    paragraphs: [
      "Tú eres el dueño de tus datos. En cualquier momento puedes pedirnos que modifiquemos o borremos tu información de nuestra base:",
    ],
    items: [
      <>
        Si cambiaste de dirección o de teléfono, solo avísale a tu ejecutivo
        para <strong className="font-extrabold text-brand-navy">Actualizar</strong> tu ficha.
      </>,
      <>
        Si ya no quieres ser cliente o no quieres que te mandemos mensajes
        de promociones, mándanos un WhatsApp o un correo a{" "}
        <strong className="font-extrabold text-brand-navy">elzarcomayoreo@gmail.com</strong> y{" "}
        <strong className="font-extrabold text-brand-navy">Borraremos</strong> tus datos de
        nuestra agenda.
      </>,
      <>
        Para eliminar tu cuenta del Portal B2B vinculada a Google, puedes
        solicitarlo por la misma vía y borraremos tu historial al instante.
      </>,
    ],
  },
];

export default function AvisoDePrivacidadPage() {
  return (
    <LegalPage
      title="Aviso de"
      titleAccent="Privacidad"
      description={
        <>
          Última actualización: Abril 2026. <br />
          En El Zarco Mayoreo respetamos tu negocio y cuidamos tu
          información. Aquí te explicamos claro y sin rodeos cómo lo
          hacemos.
        </>
      }
      sections={sections}
    />
  );
}
