"use client";

import { useEffect, useState } from "react";

export type Slide = { desktop: string; mobile: string; alt: string };

// Reemplaza el slider vanilla (#slider-prev/#slider-next + dots) por estado
// de React con autoplay.
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="w-full shrink-0">
            <picture>
              <source media="(max-width: 768px)" srcSet={s.mobile} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.desktop} alt={s.alt} className="block w-full" />
            </picture>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        aria-label="Anterior"
        className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xl text-white transition-colors hover:bg-black/50"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        aria-label="Siguiente"
        className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xl text-white transition-colors hover:bg-black/50"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-brand-red" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
