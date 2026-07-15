import Navbar from "./Navbar";
import Footer from "./Footer";
import Reveal from "./Reveal";
import ProductCarousel, { type ProductItem } from "./ProductCarousel";
import WhatsappCTA from "./WhatsappCTA";

export type SectorPageProps = {
  hero: { desktop: string; mobile: string; alt: string };
  subnavLinks: { href: string; label: string }[];
  carousels: { id: string; title: string; items: ProductItem[] }[];
  sectionHeader: string;
  benefits: { iconSvg: string; title: string; text: string }[];
  cta: { title: string; text: string; wa: string; btn: string };
};

export default function SectorPage({
  hero,
  subnavLinks,
  carousels,
  sectionHeader,
  benefits,
  cta,
}: SectorPageProps) {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-[var(--navbar-h)]">
        <Reveal>
          <header className="w-full overflow-hidden">
            <picture>
              <source media="(max-width: 768px)" srcSet={hero.mobile} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.desktop} alt={hero.alt} className="block w-full" />
            </picture>
          </header>
        </Reveal>

        <Reveal>
          <nav className="sticky top-[var(--navbar-h)] z-10 mt-6 mb-10 flex justify-center px-4">
            <ul className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-slate-100 bg-white p-1.5 shadow-[0_8px_24px_rgba(10,34,64,0.08)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {subnavLinks.map((l, i) => (
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

        {carousels.map((c) => (
          <Reveal key={c.id}>
            <ProductCarousel id={c.id} title={c.title} items={c.items} />
          </Reveal>
        ))}

        <section id="sec-beneficios" className="bg-white py-16 lg:py-20">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h2 className="mb-16 text-center text-2xl font-black tracking-[1px] text-brand-navy uppercase lg:text-3xl">
                {sectionHeader}
              </h2>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200">
                {benefits.map((b, i) => (
                  <div key={i} className="text-center md:px-10">
                    <span className="block text-[4rem] leading-none font-black text-brand-red/10 select-none lg:text-[4.5rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="-mt-7 mb-3 text-lg font-extrabold tracking-wide text-brand-navy uppercase lg:-mt-8">
                      {b.title}
                    </h3>
                    <div className="mx-auto mb-4 h-[3px] w-10 bg-brand-red" />
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-600">
                      {b.text}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <WhatsappCTA title={cta.title} href="/contacto" btnLabel="Contáctanos" />
      <Footer />
    </>
  );
}
