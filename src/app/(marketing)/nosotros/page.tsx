import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import Marquee from "@/components/marketing/Marquee";
import FaqAccordion from "@/components/marketing/FaqAccordion";
import WhatsappCTA from "@/components/marketing/WhatsappCTA";
import ScrollFx from "./ScrollFx";

export const metadata: Metadata = {
  title: "Tu Proveedor de Insumos para Negocios | El Zarco Mayorista",
  description:
    "Conoce la infraestructura logística de El Zarco: transporte propio, cobertura directa en 5 alcaldías de CDMX y más de 30 años de experiencia mayorista.",
  alternates: { canonical: "/nosotros" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

const TIMELINE = [
  {
    year: "1970",
    title: "El Origen Operativo",
    text: "Iniciamos operaciones ganando experiencia pura en el histórico mercado Mayorista de la Merced.",
  },
  {
    year: "1992",
    title: "Consolidación",
    text: "Nace oficialmente Grupo Zarco, estableciendo la matriz estratégica en la Central de Abasto de la CDMX.",
  },
  {
    year: "HOY",
    title: "Líderes Locales",
    text: "Infraestructura, transporte propio y un catálogo robusto dominando el abasto en la capital.",
  },
];

const COVERAGE = ["Iztapalapa", "Benito Juárez", "Coyoacán", "Xochimilco", "Iztacalco"];

const COVERAGE_STATS = [
  { value: "5", label: "Alcaldías con cobertura directa" },
  { value: "100%", label: "Transporte propio, sin terceros" },
  { value: "0", label: "Intermediarios en la cadena de suministro" },
];

const CHECKLIST = [
  <>¿Tienes un <strong className="font-extrabold text-brand-navy">restaurante, cadena o comedor industrial</strong>? Te abastecemos a alto volumen.</>,
  <>¿Tienes una <strong className="font-extrabold text-brand-navy">tienda o mercado</strong>? Te surtimos al detalle, sin mínimos imposibles.</>,
];

const BRANDS = [
  "/assets/69ac8360f65f353d20ddd55d_ELEMENTOS-GRAFICOS.webp",
  "/assets/69ac7bafb697b091bd7609e8_9.webp",
  "/assets/69ac7bafc0e9c14572d27ff1_15.webp",
  "/assets/69ac7baf67eed7319ab35842_13.webp",
  "/assets/69ac7baf75bfef7bb6485e4d_11.webp",
  "/assets/69ac7baf645530e96297cc8b_17.webp",
  "/assets/69ac7baf7cc2901b65209767_16.webp",
  "/assets/69ac7bae6c5fbd9f14cbf68b_12.webp",
  "/assets/69ac7bb03b1feddec9bc5edd_21.webp",
  "/assets/69ac7bafd756d45f8fa46a94_14.webp",
  "/assets/69ac7baf47577ff81fc52758_19.webp",
  "/assets/69ac7baf2afbcb6cf7ce07e6_18.webp",
  "/assets/69ac7bb08156ec8953d3c442_26.webp",
  "/assets/69ac7bb0ecd7a4b4315da15b_25.webp",
  "/assets/69ac7bb08a3346d1c3c03899_23.webp",
  "/assets/69ac7bb05482516a0724e27b_24.webp",
  "/assets/69ac7bb0e497e6345c36f529_22.webp",
];

const FAQS = [
  {
    q: "¿Por qué elegir a El Zarco como mi proveedor mayorista?",
    a: "Porque no solo entregamos producto, entregamos <strong>certidumbre</strong>. Contamos con más de 30 años de experiencia operando desde la Central de Abasto, lo que nos permite ofrecer precios competitivos, atención 100% personalizada y la seguridad de que tu negocio nunca se quedará sin inventario.",
  },
  {
    q: "¿Cómo garantizan la seguridad y puntualidad de la entrega?",
    a: "A diferencia de la competencia, operamos con un <strong>equipo de transporte propio y especializado</strong>. No dependemos de terceros. Esto nos permite trazar rutas eficientes en CDMX y asegurar que la cadena de frío y la integridad de tus productos lleguen impecables a tu almacén.",
  },
  {
    q: "¿Cuál es el proceso exacto para cotizar y realizar un pedido?",
    a: "Nuestro proceso es directo y sin fricciones. A través de nuestro canal corporativo de <strong>WhatsApp</strong>, un asesor te asignará una cotización exacta basada en tu volumen, armará tu pedido en tiempo real y coordinará la logística de recolección en matriz o envío directo a tu negocio.",
  },
  {
    q: "¿A qué giros o tipos de negocio abastecen principalmente?",
    a: "Nuestra infraestructura está diseñada para soportar el ritmo de la <strong>Industria Restaurantera de alto volumen</strong> (cadenas, comedores industriales, cafeterías y delicatessen), así como la <strong>distribución al detalle</strong> (mercados locales, tiendas de abarrotes y cremerías).",
  },
  {
    q: "¿Cuentan con un monto mínimo de compra o venta al menudeo?",
    a: "Nos especializamos en el abasto de gran volumen, sin embargo, entendemos y apoyamos el crecimiento. Atendemos desde <strong>medio mayoreo</strong> para negocios que van iniciando, hasta abasto masivo. Acércate a nuestros asesores para diseñar un plan a tu medida.",
  },
  {
    q: "¿La calidad de sus marcas es original y garantizada?",
    a: "Totalmente. Somos distribuidores mayoristas <strong>directos</strong>. Al trabajar sin intermediarios con firmas de prestigio, garantizamos que el producto que llega a tus manos es fresco, 100% original y con la consistencia que tu cliente final exige.",
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "El Zarco",
      url: SITE_URL,
      logo: `${SITE_URL}/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp`,
      foundingDate: "1992",
      description:
        "Distribuidora mayorista de abarrotes, cremería, embutidos y delicatessen en la Ciudad de México, con transporte propio y más de 30 años de experiencia.",
      areaServed: COVERAGE.map((c) => ({ "@type": "AdministrativeArea", name: c })),
      sameAs: [
        "https://www.facebook.com/profile.php?id=61574700037720",
        "https://www.instagram.com/elzarcodistribuidora/",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) },
      })),
    },
  ],
};

export default function NosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Navbar />
      <ScrollFx className="bg-white pt-[var(--navbar-h)]">
        <Reveal>
          <header className="w-full overflow-hidden">
            <picture>
              <source media="(max-width: 768px)" srcSet="/assets/69f56fbd533f27ed6af8fa68_BANNER-MOVIL.webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/69f56fbd233f675b259ce6b2_BANNER-COMPUTADORA.webp"
                alt="Sobre Nosotros - El Zarco Mayoreo"
                data-fx="hero-img"
                className="block w-full scale-110"
              />
            </picture>
          </header>
        </Reveal>

        <section className="mx-auto my-20 w-[90%] max-w-[1200px] lg:my-28">
          <Reveal>
            <h1 className="mb-3 text-3xl font-black text-brand-navy lg:text-4xl">
              Nuestras Raíces
            </h1>
            <p className="max-w-md text-slate-500">
              Forjados en las entrañas del comercio mayorista capitalino.
            </p>
          </Reveal>

          <div data-fx="timeline-group" className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {TIMELINE.map((t) => (
              <div key={t.year} data-fx="timeline-item" className="border-t-2 border-brand-red pt-6">
                <div data-fx="year" className="mb-3 text-4xl leading-none font-black text-brand-red lg:text-5xl">
                  {t.year}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-brand-navy">
                  {t.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto my-20 w-[90%] max-w-[1200px] lg:my-28">
          <Reveal>
            <h2 className="mb-3 text-3xl font-black text-brand-navy lg:text-4xl">
              Dominio Logístico
            </h2>
            <p className="max-w-xl text-slate-500">
              Nuestra red de distribución propia garantiza entregas exactas y
              seguras en los polos comerciales más importantes de la ciudad.
              Como distribuidor mayorista en la Ciudad de México, cubrimos
              directamente las alcaldías de mayor movimiento comercial, sin
              depender de paqueterías ni intermediarios.
            </p>
          </Reveal>

          <div data-fx="stat-group" className="mt-10 grid grid-cols-3 gap-6 border-y border-slate-100 py-8">
            {COVERAGE_STATS.map((s) => (
              <div key={s.label} data-fx="stat">
                <div className="mb-1 text-3xl font-black text-brand-red lg:text-4xl">
                  {s.value}
                </div>
                <div className="text-xs leading-snug font-semibold text-slate-500 lg:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <span className="mb-4 block text-xs font-extrabold tracking-[2px] text-slate-400 uppercase">
              Cobertura por alcaldía
            </span>
            <div data-fx="chip-group" className="flex flex-nowrap gap-2.5 overflow-x-auto pb-1 lg:flex-wrap">
              {COVERAGE.map((c) => (
                <span
                  key={c}
                  data-fx="chip"
                  className="shrink-0 rounded-full border border-brand-red/15 bg-brand-red/5 px-4 py-1.5 text-sm font-bold text-brand-red"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-8 border-t border-slate-100 pt-10 lg:flex-row lg:items-center">
            <div data-fx="check-group" className="flex flex-col gap-5">
              {CHECKLIST.map((item, i) => (
                <div key={i} data-fx="check-item" className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-[0.95rem] text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/contacto"
              data-fx="cta"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-brand-red py-3.5 pr-3.5 pl-7 text-[0.8rem] font-black tracking-[1.5px] text-white uppercase shadow-[0_10px_25px_rgba(168,18,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ba1400]"
            >
              Solicitar Cobertura
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        <section className="bg-white py-16">
          <Reveal>
            <div className="mx-auto mb-8 w-[90%] max-w-[1300px] text-center">
              <h2 className="mb-2 text-2xl font-black text-brand-navy">Portafolio Premium</h2>
              <p className="text-slate-500">
                Socios estratégicos de las marcas más prestigiosas.
              </p>
            </div>
          </Reveal>
          <Marquee images={BRANDS} />
        </section>

        <section className="py-16">
          <Reveal>
            <div className="mx-auto mb-10 w-[90%] max-w-[1300px] text-center">
              <h2 className="mb-2 text-2xl font-black text-brand-navy">El Estándar Operativo</h2>
              <p className="text-slate-500">
                Resolvemos tus dudas frecuentes sobre nuestra logística y
                capacidad de respuesta para negocios.
              </p>
            </div>
          </Reveal>
          <div className="mx-auto w-[90%]">
            <FaqAccordion items={FAQS} />
          </div>
        </section>

        <WhatsappCTA
          title="¿Listo para asegurar el abasto de tu negocio?"
          btnLabel="Solicitar Cobertura"
          variant="red"
        />
      </ScrollFx>
      <Footer />
    </>
  );
}
