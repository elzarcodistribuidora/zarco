import type { Metadata } from "next";
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
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="15" rx="3" fill="currentColor" fill-opacity="0.1" /><rect x="4" y="6" width="16" height="15" rx="3" /><path d="M10 6V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" /><circle cx="12" cy="4" r="0.5" fill="currentColor" /><path d="M14.5 17.5l-5-2.5v-3.5l5 2.5v3.5z" fill="currentColor" fill-opacity="0.2"/><path d="M14.5 17.5l-5-2.5v-3.5l5 2.5v3.5z" /><path d="M9.5 11.5l3.5-3 5 3-3.5 3-5-3z" fill="currentColor" fill-opacity="0.1"/><path d="M9.5 11.5l3.5-3 5 3-3.5 3-5-3z" /><path d="M18 14.5l-3.5 3" /><circle cx="12" cy="15" r="0.5" fill="currentColor" /><circle cx="14" cy="13.5" r="0.75" fill="currentColor" /><circle cx="7" cy="15" r="1" fill="currentColor"/><circle cx="8" cy="16.5" r="1" fill="currentColor"/><circle cx="6" cy="16.5" r="1" fill="currentColor"/><circle cx="7" cy="18" r="1" fill="currentColor"/></svg>',
    title: "Tabla Clásica",
    text: "Quesos nacionales, jamón de pierna, salami y frutas de temporada. Ideal para reuniones íntimas.",
    badge: "6-10 PERSONAS",
  },
  {
    popular: true,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10c0-1.5 1-2.5 1-4V3h2v3c0 1.5 1 2.5 1 4v11H4V10z" fill="currentColor" fill-opacity="0.1" /><path d="M4 10c0-1.5 1-2.5 1-4V3h2v3c0 1.5 1 2.5 1 4v11H4V10z" /><path d="M4 14h4" /><path d="M11 9l.5 3c.3 1.5-.5 3-2 3.5h0c-1.5-.5-2.3-2-2-3.5L8 9h3z" fill="currentColor" fill-opacity="0.1" /><path d="M11 9l.5 3c.3 1.5-.5 3-2 3.5h0c-1.5-.5-2.3-2-2-3.5L8 9h3z" /><path d="M9.5 15.5v4.5" /><path d="M8 20h3" /><path d="M14 18c0-2 2-3 4-3s4 1 4 3v3H14v-3z" fill="currentColor" fill-opacity="0.1" /><path d="M14 18c0-2 2-3 4-3s4 1 4 3v3H14v-3z" /><circle cx="16" cy="19" r="1" fill="currentColor" /><circle cx="19" cy="19" r="1" fill="currentColor" /><path d="M18 4l1 2h2l-1.5 1.5.5 2L18 8.5 16 9.5l.5-2L15 6h2l1-2z" fill="currentColor" /></svg>',
    title: "Charola Premium",
    text: "Quesos maduros, brie, gouda, chorizo español, prosciutto y complementos selectos. Para corporativos.",
    badge: "✦ MÁS POPULAR ✦",
  },
  {
    popular: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16c0-5 4-9 9-9s9 4 9 9" fill="currentColor" fill-opacity="0.1" /><path d="M3 16c0-5 4-9 9-9s9 4 9 9" /><path d="M10 7a2 2 0 1 1 4 0" /><path d="M2 16h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" fill="currentColor" fill-opacity="0.2" /><path d="M2 16h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" /><path d="M6 20v1" /><path d="M18 20v1" /><path d="M20 5l1 1 1-1-1-1-1 1z" fill="currentColor" /><path d="M4 8l1 1 1-1-1-1-1 1z" fill="currentColor" /></svg>',
    title: "Gran Buffet",
    text: "Montaje de charcutería con variedad extensa. Para bodas, exposiciones y eventos de alto nivel.",
    badge: "20+ PERSONAS",
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
          <nav className="sticky top-[var(--navbar-h)] z-10 mt-6 mb-10 flex justify-center px-4">
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

        <section
          id="servicio-charolas"
          className="mx-auto mb-16 w-[90%] max-w-[1200px] rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:p-14"
        >
          <Reveal>
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-2xl font-black tracking-[-1px] text-brand-navy uppercase lg:text-4xl">
                Charolas &amp; Tablas <span className="text-brand-red">Premium</span>
              </h2>
              <p className="mx-auto max-w-2xl text-slate-500">
                Nuestras charolas de quesos finos y embutidos premium son el
                centro de atención perfecto para bodas, brindis corporativos y
                reuniones íntimas.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {TIERS.map((t) => (
                <div
                  key={t.title}
                  className={`flex flex-col items-center rounded-2xl border p-8 text-center transition-transform hover:-translate-y-2 ${
                    t.popular
                      ? "-translate-y-1 border-brand-red/30 shadow-[0_10px_25px_rgba(168,18,0,0.1)]"
                      : "border-slate-100 shadow-[0_5px_15px_rgba(10,34,64,0.04)]"
                  }`}
                >
                  <div
                    className="mb-4 h-10 w-10 text-brand-red [&>svg]:h-10 [&>svg]:w-10"
                    dangerouslySetInnerHTML={{ __html: t.icon }}
                  />
                  <h3 className="mb-2 text-xl font-extrabold text-brand-navy">{t.title}</h3>
                  <p className="mb-4 text-sm text-slate-500">{t.text}</p>
                  <p
                    className={`mt-auto w-full border-t pt-4 text-xs font-extrabold tracking-[2px] uppercase ${
                      t.popular ? "border-brand-red/10 text-brand-navy" : "border-brand-red/10 text-brand-red"
                    }`}
                  >
                    {t.badge}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-10 grid grid-cols-2 gap-5 border-y border-slate-200 py-8 lg:grid-cols-4">
              {[
                { n: "48h", l: "Preparación" },
                { n: "100%", l: "Frescura" },
                { n: "CDMX", l: "Cobertura" },
                { n: "A tu medida", l: "Personalización" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="mb-1 text-2xl font-black text-brand-red">{s.n}</div>
                  <p className="text-xs font-extrabold tracking-[1px] text-slate-500 uppercase">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center">
              <a
                href="https://wa.me/522298477440?text=Hola%2C%20estoy%20interesado%20en%20cotizar%20una%20Charola%20Premium."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-brand-red px-10 py-4 font-black tracking-[2px] text-white uppercase transition-transform hover:-translate-y-1 hover:bg-[#7a0a00]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Cotizar mi Charola Ahora
              </a>
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

      <a
        href="https://wa.me/522298477440?text=Hola%2C%20quiero%20info%20sobre%20delicatessen."
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 z-[9999] flex items-center gap-2.5 rounded-full bg-brand-green px-6 py-3 font-black tracking-[1px] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all hover:-translate-y-1 hover:bg-[#20ba56] sm:right-[30px] sm:bottom-[30px]"
      >
        <svg viewBox="0 0 448 512" className="h-[22px] w-[22px] fill-current">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        <span className="hidden sm:inline">Atención a Clientes</span>
      </a>

      <DelicatessenFooter />
    </>
  );
}
