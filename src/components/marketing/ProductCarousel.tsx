"use client";

import { useRef } from "react";

export type ProductItem = {
  unit: string;
  name: string;
  brand: string;
  image: string;
};

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

// Reemplaza scrollCarousel()/renderCarousel() (los scripts inline de Webflow):
// mismos datos hardcodeados de "bestsellers" por sector, ahora como props.
export default function ProductCarousel({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: ProductItem[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("div");
    const cardWidth = card ? card.getBoundingClientRect().width : 240;
    track.scrollBy({ left: dir * (cardWidth + 20), behavior: "smooth" });
  };

  return (
    <section id={id} className="mb-16 w-full">
      <div className="mx-auto mb-6 flex w-[90%] max-w-[1300px] items-center justify-between">
        <h2 className="text-xl font-black tracking-[-0.5px] text-brand-navy lg:text-2xl">
          {title}
        </h2>
        <div className="hidden gap-2 lg:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-brand-navy transition-all hover:border-brand-red hover:bg-brand-red hover:text-white"
          >
            <ArrowIcon dir="left" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-brand-navy transition-all hover:border-brand-red hover:bg-brand-red hover:text-white"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto py-2 pl-[5%] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: "5%" }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            onClick={() => (window.location.href = "/catalogo")}
            className="group w-[270px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(10,34,64,0.06)]"
          >
            <div className="relative h-[220px] overflow-hidden bg-gradient-to-b from-slate-50 to-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-extrabold tracking-[1px] text-brand-navy shadow-sm backdrop-blur">
                {p.unit}
              </span>
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.6rem] font-extrabold tracking-wide text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Disponible
              </span>
            </div>
            <div className="p-4 pt-3.5">
              <p className="mb-1 text-[0.68rem] font-extrabold tracking-[1.5px] text-brand-red uppercase">
                {p.brand}
              </p>
              <h3 className="mb-3 line-clamp-2 min-h-[2.6em] text-[0.92rem] leading-snug font-bold text-brand-navy">
                {p.name}
              </h3>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[0.7rem] font-semibold text-slate-400">
                  Precio en catálogo
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-white transition-colors duration-300 group-hover:bg-brand-red">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
        <div aria-hidden className="w-[1px] shrink-0" />
      </div>
    </section>
  );
}
