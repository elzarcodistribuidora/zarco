import type { Metadata } from "next";
import Link from "next/link";
import DelicatessenNavbar from "@/components/DelicatessenNavbar";
import DelicatessenFooter from "@/components/DelicatessenFooter";
import Reveal from "@/components/marketing/Reveal";
import HeroSlider from "@/components/marketing/HeroSlider";
import ProductCarousel from "@/components/marketing/ProductCarousel";
import WhatsappCTA from "@/components/marketing/WhatsappCTA";

export const metadata: Metadata = {
  title: "Delicatessen y Charolas Premium para Eventos | El Zarco",
  alternates: { canonical: "/delicatessen" },
};

const SLIDES = [
  {
    desktop: "/assets/charcuteria_banner.webp",
    mobile: "/assets/delicatessen-banner-mobile.webp",
    alt: "Delicatessen El Zarco",
  },
  {
    desktop: "/assets/deli-banner2-desk.webp",
    mobile: "/assets/deli-banner2-movil.webp",
    alt: "Charolas Premium",
  },
  {
    desktop: "/assets/deli-banner3-desk.webp",
    mobile: "/assets/deli-banner3-movil.webp",
    alt: "Embutidos Finos",
  },
];

const SUBNAV = [
  { href: "/delicatessen/arma-tu-charola", label: "Servicio de Charolas" },
  { href: "#sec-quesos", label: "Quesos Finos" },
  { href: "#sec-embutidos", label: "Embutidos Premium" },
  { href: "#sec-complementos", label: "Complementos" },
  { href: "#sec-beneficios", label: "Tus Beneficios" },
];

const TIERS = [
  {
    popular: false,
    title: "Tabla Clásica",
    text: "Quesos nacionales, jamón de pierna, salami y frutas de temporada. Ideal para reuniones íntimas.",
    badge: "6-10 personas",
  },
  {
    popular: true,
    title: "Charola Premium",
    text: "Quesos maduros, brie, gouda, chorizo español, prosciutto y complementos selectos. Para corporativos.",
    badge: "Más popular",
  },
  {
    popular: false,
    title: "Gran Buffet",
    text: "Montaje de charcutería con variedad extensa. Para bodas, exposiciones y eventos de alto nivel.",
    badge: "20+ personas",
  },
];

const CAROUSELS = [
  {
    id: "sec-quesos",
    title: "Quesos Finos para Tu Vitrina",
    items: [
      { unit: "KILO", name: "Queso Brie Danés 125 g", brand: "IMPORTADO", image: "/assets/delicatessen/quesos/1.png" },
      { unit: "KILO", name: "Queso Gouda al Pesto Kilo", brand: "PREMIUM", image: "/assets/delicatessen/quesos/2.png" },
      { unit: "KILO", name: "Queso Gouda Hierbas Finas Kilo", brand: "PREMIUM", image: "/assets/delicatessen/quesos/3.png" },
      { unit: "KILO", name: "Queso Manchego Uruguayo Kilo", brand: "IMPORTADO", image: "/assets/delicatessen/quesos/4.png" },
      { unit: "KILO", name: "Queso Chihuahua Menonita Kilo", brand: "MENONITA", image: "/assets/delicatessen/quesos/5.png" },
      { unit: "KILO", name: "Queso Cheddar Extra Añejo 400 g", brand: "NAVARRO", image: "/assets/delicatessen/quesos/6.png" },
      { unit: "KILO", name: "Queso Mozzarella Belgioioso 454 g", brand: "BELGIOIOSO", image: "/assets/delicatessen/quesos/7.png" },
      { unit: "KILO", name: "Queso Panela Artesanal Kilo", brand: "EL ZARCO", image: "/assets/delicatessen/quesos/8.png" },
    ],
  },
  {
    id: "sec-embutidos",
    title: "Embutidos & Carnes Frías",
    items: [
      { unit: "KILO", name: "Chorizo Español Maestro Choricero", brand: "MAESTRO CHORICERO", image: "/assets/delicatessen/embutidos/1.png" },
      { unit: "PIEZA", name: "Chorizo Español El Mexicano", brand: "EL MEXICANO", image: "/assets/delicatessen/embutidos/2.png" },
      { unit: "KILO", name: "Salami Calabrese Kilo", brand: "ARTESANAL", image: "/assets/delicatessen/embutidos/3.png" },
      { unit: "PIEZA", name: "Salami Ungaro 2.5 kg", brand: "PREMIUM", image: "/assets/delicatessen/embutidos/4.png" },
      { unit: "KILO", name: "Jamón de Pierna Fud Rebanado 1 kg", brand: "FUD", image: "/assets/delicatessen/embutidos/5.png" },
      { unit: "PIEZA", name: "Jamón Holandés de Pierna Fud", brand: "FUD", image: "/assets/delicatessen/embutidos/6.png" },
      { unit: "KILO", name: "Jamón Serrano Tangamanga", brand: "TANGAMANGA", image: "/assets/delicatessen/embutidos/7.png" },
      { unit: "KILO", name: "Pepperoni Peñaranda", brand: "PEÑARANDA", image: "/assets/delicatessen/embutidos/8.png" },
    ],
  },
  {
    id: "sec-complementos",
    title: "Complementos & Bases Gourmet",
    items: [
      { unit: "PIEZA", name: "Queso de Cabra con Arándano 200 g", brand: "ARTESANAL", image: "/assets/delicatessen/complementos/1.png" },
      { unit: "PIEZA", name: "Almendra Entera 1 kg", brand: "PREMIUM", image: "/assets/delicatessen/complementos/2.png" },
      { unit: "PIEZA", name: "Nuez de la India Kilo", brand: "PREMIUM", image: "/assets/delicatessen/complementos/3.png" },
      { unit: "PIEZA", name: "Arándanos 1 kg", brand: "PREMIUM", image: "/assets/delicatessen/complementos/4.png" },
      { unit: "PIEZA", name: "Higos Cristalizados Kilo", brand: "ARTESANAL", image: "/assets/delicatessen/complementos/5.png" },
      { unit: "PIEZA", name: "Vino Tinto Santa Rita 750 ml", brand: "SANTA RITA", image: "/assets/delicatessen/complementos/6.png" },
    ],
  },
];

const BENEFITS = [
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    title: "Precios de Mayorista",
    text: "Accede a precios de central de abasto en quesos finos y embutidos premium.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    title: "Variedad Inigualable",
    text: "Desde quesos europeos hasta embutidos artesanales. Todo en un solo proveedor.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    title: "Frescura Garantizada",
    text: "Cadena de frío desde la Central de Abasto hasta tu puerta.",
  },
];

export default function DelicatessenPage() {
  return (
    <>
      <DelicatessenNavbar />
      <main className="bg-white pt-[var(--navbar-h)]">
        <Reveal>
          <header className="w-full overflow-hidden">
            <HeroSlider slides={SLIDES} />
          </header>
        </Reveal>

        <Reveal>
          <nav className="sticky top-[var(--navbar-h)] z-10 mt-4 mb-3 flex justify-center px-4 lg:mt-6 lg:mb-10">
            <ul className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-slate-100 bg-white p-1.5 shadow-[0_8px_24px_rgba(10,34,64,0.08)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SUBNAV.map((l, i) => (
                <li key={l.href} className="shrink-0">
                  <a
                    href={l.href}
                    className={`block rounded-full px-5 py-2.5 text-[0.75rem] font-extrabold tracking-[1.5px] whitespace-nowrap uppercase transition-all duration-300 ${
                      i === 0
                        ? "bg-brand-red text-white shadow-[0_4px_14px_rgba(168,18,0,0.35)]"
                        : "text-brand-navy/70 hover:bg-brand-red/10 hover:text-brand-red"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <section id="servicio-charolas" className="mx-auto mb-16 w-[90%] max-w-[1200px] py-2 lg:py-14">
          <Reveal>
            <div className="mb-4 text-center lg:mb-10">
              <h2 className="mb-2 text-2xl font-black tracking-[-1px] text-brand-navy uppercase lg:mb-3 lg:text-4xl">
                Charolas &amp; Tablas <span className="text-brand-red">Premium</span>
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-500 lg:text-base">
                Nuestras charolas de quesos finos y embutidos premium son el
                centro de atención perfecto para bodas, brindis corporativos y
                reuniones íntimas.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-4 divide-y divide-slate-200 border-y border-slate-200 lg:mb-10">
              {TIERS.map((t) => (
                <Link
                  key={t.title}
                  href="/delicatessen/arma-tu-charola"
                  className={`group relative flex flex-col gap-2 py-4 pr-14 pl-5 transition-colors md:flex-row md:items-center md:gap-10 md:py-8 md:pr-16 md:pl-6 ${
                    t.popular ? "bg-brand-red/[0.03] hover:bg-brand-red/[0.05]" : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`absolute top-0 left-0 h-full w-1 ${t.popular ? "bg-brand-red" : "bg-transparent"}`}
                  />
                  <h3 className="flex items-center gap-2 text-lg font-black tracking-wide text-brand-navy uppercase md:w-64 md:shrink-0 lg:text-2xl">
                    {t.title}
                    {t.popular && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-red">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </h3>
                  <p className="flex-1 text-sm leading-snug text-slate-500 md:leading-relaxed md:text-base">
                    {t.text}
                  </p>
                  <span
                    className={`inline-flex w-fit shrink-0 items-center rounded-full px-4 py-1.5 text-[0.7rem] font-extrabold tracking-[1.5px] uppercase ${
                      t.popular ? "bg-brand-red text-white" : "border border-slate-200 text-slate-500"
                    }`}
                  >
                    {t.badge}
                  </span>
                  <span
                    className={`absolute top-1/2 right-5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 md:right-6 md:h-9 md:w-9 ${
                      t.popular
                        ? "bg-brand-red text-white"
                        : "bg-slate-100 text-brand-navy opacity-0 group-hover:opacity-100"
                    } translate-x-1 group-hover:translate-x-0`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-4 grid grid-cols-2 gap-3 border-y border-slate-200 py-4 lg:mb-10 lg:grid-cols-4 lg:gap-5 lg:py-8">
              {[
                { n: "48h", l: "Preparación" },
                { n: "100%", l: "Frescura" },
                { n: "CDMX", l: "Cobertura" },
                { n: "A tu medida", l: "Personalización" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="mb-1 text-xl font-black text-brand-red lg:text-2xl">{s.n}</div>
                  <p className="text-[0.65rem] font-extrabold tracking-[1px] text-slate-500 uppercase lg:text-xs">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center">
              <Link
                href="/delicatessen/arma-tu-charola"
                className="inline-flex items-center gap-3 rounded-full bg-brand-red px-8 py-3 text-sm font-black tracking-[2px] text-white uppercase transition-transform hover:-translate-y-1 hover:bg-[#7a0a00] lg:px-10 lg:py-4 lg:text-base"
              >
                Cotizar mi Charola Ahora
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </section>

        {CAROUSELS.map((c) => (
          <Reveal key={c.id}>
            <ProductCarousel id={c.id} title={c.title} items={c.items} />
          </Reveal>
        ))}

        <section id="sec-beneficios" className="bg-white py-16 lg:py-20">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h2 className="mb-16 text-center text-2xl font-black tracking-[1px] text-brand-navy uppercase lg:text-3xl">
                Tu Delicatessen al Siguiente Nivel
              </h2>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="text-center md:px-10">
                    <span className="block text-[4rem] leading-none font-black text-brand-red/10 select-none lg:text-[4.5rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="-mt-7 mb-3 text-lg font-extrabold tracking-wide text-brand-navy uppercase lg:-mt-8">
                      {b.title}
                    </h3>
                    <div className="mx-auto mb-4 h-[3px] w-10 bg-brand-red" />
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-600">{b.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <WhatsappCTA
        title="¿Listo para surtir tu delicatessen?"
        href="/contacto"
        btnLabel="Contáctanos"
        variant="red"
      />

      <DelicatessenFooter />
    </>
  );
}
