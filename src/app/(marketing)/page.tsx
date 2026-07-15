import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import HeroSlider from "@/components/marketing/HeroSlider";
import Marquee from "@/components/marketing/Marquee";

export const metadata: Metadata = {
  title: "Distribuidora de Alimentos por Mayoreo en CDMX | El Zarco",
  description:
    "Surtimos insumos a restaurantes, tiendas y food service. Lácteos, embutidos y abarrotes con precio directo de bodega. Cotiza tu pedido B2B.",
  alternates: { canonical: "/" },
};

const MAIN_SLIDES = [
  { desktop: "/assets/69a8edc6656a008a07600791_BANNER-1.webp", mobile: "/assets/69a8edd0e14ccfa79b9855c1_BANNER-1-MOVIL.webp", alt: "Banner 1" },
  { desktop: "/assets/69a8edc773fdb97d257508f1_BANNER-2.webp", mobile: "/assets/69a8edd02058e4d546198f50_BANNER-2-MOVIL.webp", alt: "Banner 2" },
  { desktop: "/assets/charcuteria_banner.webp", mobile: "/assets/delicatessen-banner-mobile.webp", alt: "Charcutería & Delicatessen" },
  { desktop: "/assets/69ac7810d733ecd545a29aaf_BANNER-5.webp", mobile: "/assets/69ac7821c7dd69a0b51354f7_BANNER-6-MOVIL.webp", alt: "Banner 3" },
];

const SECONDARY_SLIDES = [
  { desktop: "/assets/69a8edc70144cfbc89256968_4.webp", mobile: "/assets/69a91e7596a6833fdc6d124a_BANNER-MOVIL.webp", alt: "Promo Secundaria 1" },
  { desktop: "/assets/69ac95d36498982a0552cf3e_BANNER-COMPUTADORA.webp", mobile: "/assets/69acefd202a94e8677d90627_BANNER-MOVIL.webp", alt: "Promo Secundaria 2" },
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

const SECTOR_CARDS = [
  {
    href: "/restaurantes",
    img: "/assets/69ac7eba05dea11f5c5cb6bf_Diseno-sin-titulo.webp",
    title: "Restaurantes",
    desc: "Rendimiento y especialidad. Desde alto volumen para línea de cocina, hasta curaduría de quesos finos.",
    cta: "Ver Selección",
  },
  {
    href: "/tiendas",
    img: "/assets/69ac89a8760a05cf8dd617ac_Diseno-sin-titulo-2.webp",
    title: "Tiendas",
    desc: "Maximizamos tu margen. Volúmenes grandes, marcas líderes y precios directos para rotación diaria.",
    cta: "Ver Catálogo",
  },
  {
    href: "/cafeterias",
    img: "/assets/69ac80f7994d44765138aece_Diseno-sin-titulo-1.webp",
    title: "Cafeterías",
    desc: "Lácteos de textura ideal, carnes frías artesanales y complementos precisos para brunches memorables.",
    cta: "Ver Opciones",
  },
];

const PRODUCT_CATS = [
  { href: "/cremeria", img: "/assets/69b8685e22264d37d865cb5b_1.webp", title: "Cremería" },
  { href: "/embutidos", img: "/assets/69b8685eb599790685db108b_2.webp", title: "Embutidos" },
  { href: "/abarrotes-basicos", img: "/assets/69b8685e8a9b3fe4cdd2e271_3.webp", title: "Abarrotes Básicos" },
];

const BRAND_LOGOS = [
  { src: "/assets/69a9232b124bea8176afebef_BANNER-FUD.webp", alt: "Logo Fud" },
  { src: "/assets/69a9232b252a01253145d1ac_BANNER-LALA.webp", alt: "Logo Lala" },
  { src: "/assets/69ac96cfb4f565cb525c5ac9_BANNER-LA-COSTENA.webp", alt: "Logo La Costeña" },
  { src: "/assets/69ac74fb90b95e8a64a1b33a_BANNER-ALPURA.webp", alt: "Logo Alpura" },
  { src: "/assets/69ac74fb7dc019bff8677aac_BANNER-HEINZ.webp", alt: "Logo Heinz" },
  { src: "/assets/69ac74fa8ca936a8b0a7995f_BANNER-NOCHEBUENA.webp", alt: "Logo Nochebuena" },
  { src: "/assets/69ac74faf0f31535d2d5b678_BANNER-BERNINA.webp", alt: "Logo Bernina" },
  { src: "/assets/69ac74fa3986fdb451b0e9ac_BANNER-TANGAMANGA.webp", alt: "Logo Tangamanga" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-[var(--navbar-h)]">
        <Reveal>
          <section className="w-full overflow-hidden">
            <HeroSlider slides={MAIN_SLIDES} />
          </section>
        </Reveal>

        <section className="bg-white py-14">
          <Reveal>
            <h2 className="mb-6 text-center text-sm font-black tracking-[3px] text-slate-400 uppercase">
              Algunas de Nuestras Marcas
            </h2>
          </Reveal>
          <Marquee images={BRANDS} />
        </section>

        <section className="mx-auto my-16 w-[90%] max-w-[1300px]">
          <Reveal>
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-black tracking-[-1px] text-brand-navy uppercase lg:text-3xl">
                Nuestras Líneas de Negocio
              </h2>
              <p className="mx-auto max-w-xl text-slate-500">
                Selecciona tu sector. Garantizamos frescura, volumen y precios
                competitivos directos desde el corazón de la Central.
              </p>
            </div>
          </Reveal>
          <div className="-mx-[5%] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[5%] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {SECTOR_CARDS.map((c) => (
              <Reveal key={c.href} className="w-[78%] shrink-0 snap-start md:w-auto md:shrink">
                <Link
                  href={c.href}
                  className="group relative flex h-[380px] flex-col justify-end overflow-hidden rounded-xl p-8 text-white shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-500 hover:-translate-y-2.5 hover:shadow-[0_20px_40px_rgba(10,34,64,0.15)] md:h-[500px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img}
                    alt=""
                    className="absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-[2] h-4/5 bg-gradient-to-t from-[rgba(10,34,64,0.95)] via-[rgba(10,34,64,0.5)] via-40% to-transparent transition-[height] duration-500 group-hover:h-full" />
                  <div className="relative z-[3]">
                    <h3 className="mb-3 text-2xl font-black uppercase transition-transform duration-500 group-hover:-translate-y-1">
                      {c.title}
                    </h3>
                    <p className="mb-0 text-[0.95rem] leading-snug text-white/85 transition-transform duration-500 group-hover:-translate-y-1">
                      {c.desc}
                    </p>
                    <span className="mt-5 inline-flex translate-y-[15px] items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-[0.85rem] font-extrabold tracking-wide text-brand-navy uppercase opacity-0 shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-400 group-hover:translate-y-0 group-hover:bg-brand-red group-hover:text-white group-hover:opacity-100">
                      {c.cta} <span>→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto my-16 w-[90%] max-w-[1300px]">
          <Reveal>
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-black tracking-[-1px] text-brand-navy uppercase lg:text-3xl">
                Familias de Productos
              </h2>
              <p className="text-slate-500">
                Explora nuestras principales categorías de abasto para tu negocio.
              </p>
            </div>
          </Reveal>
          <div className="-mx-[5%] flex snap-x snap-mandatory gap-8 overflow-x-auto px-[5%] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {PRODUCT_CATS.map((c) => (
              <Reveal key={c.href} className="w-[60%] shrink-0 snap-start sm:w-auto sm:shrink">
                <Link href={c.href} className="group flex flex-col items-center gap-2 text-center">
                  <div className="flex w-full items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full max-w-[280px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-400 group-hover:-translate-y-2.5 group-hover:scale-105 group-hover:drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-wide text-brand-navy uppercase transition-colors group-hover:text-brand-red">
                    {c.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="mx-auto my-8 w-[90%] max-w-[1200px]">
            <Link
              href="/delicatessen/arma-tu-charola"
              className="group relative block overflow-hidden rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]"
            >
              <picture>
                <source media="(max-width: 768px)" srcSet="/banners/charolas-promo-movil.webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/banners/charolas-promo-desk.webp"
                  alt="Arma tu Charola de Charcutería"
                  className="block h-auto w-full object-cover"
                />
              </picture>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <span className="flex translate-y-2 items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-[0.85rem] font-black tracking-[1.5px] text-brand-navy uppercase opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Arma tu Charola
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
          </section>
        </Reveal>

        <section className="bg-white py-16">
          <Reveal>
            <h2 className="mb-10 text-center text-2xl font-black tracking-[1px] text-brand-navy uppercase lg:text-3xl">
              Líderes Que Confían en Nuestra Red
            </h2>
          </Reveal>
          <Reveal>
            <div className="mx-auto flex w-[90%] max-w-[1400px] snap-x snap-mandatory gap-[30px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {BRAND_LOGOS.map((b) => (
                <div
                  key={b.src}
                  className="flex w-[62%] shrink-0 snap-start items-center justify-center sm:w-auto sm:shrink"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.src}
                    alt={b.alt}
                    className="w-full max-w-[280px] rounded-[10px] object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <Reveal>
          <section className="my-16 w-full overflow-hidden">
            <HeroSlider slides={SECONDARY_SLIDES} />
          </section>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
