"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type GuideArticle = {
  number: string;
  category: string;
  title: string;
  contentHtml: string;
};

const WA_NUMBER = "522298477440";

// Los CTA de cada guía apuntan a wa.me embebidos en el HTML (contentHtml).
// Interceptamos el click aquí: registramos el lead en /api/quote (para que
// aparezca en /admin/cotizaciones, igual que el form de /contacto) y
// personalizamos el mensaje de WhatsApp con el título de la guía.
function handleActionClick(e: React.MouseEvent<HTMLDivElement>, article: GuideArticle) {
  const link = (e.target as HTMLElement).closest("a.zarco-action-link");
  if (!link) return;
  e.preventDefault();

  fetch("/api/quote", {
    method: "POST",
    body: JSON.stringify({
      negocio: "Lead desde Guías de Negocio",
      resumen: `[GUÍA: ${article.category}] ${article.title}`,
    }),
  }).catch(() => {});

  const msg = `Hola, vengo de la guía "${article.title}" y quiero más información.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

// Reemplaza el acordeón `.zarco-article__header` / `.zarco-article__drawer`
// (toggle vía `aria-expanded` + CSS max-height) por estado de React. Lista
// editorial sin tarjetas: separadores finos + número grande como índice.
export default function GuideAccordion({ articles }: { articles: GuideArticle[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rows = scope.current?.querySelectorAll<HTMLElement>("[data-fx='guide-row']");
      if (!rows?.length) return;
      gsap.from(rows, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: "top 85%" },
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="border-t border-slate-200">
      {articles.map((a, i) => {
        const open = openIndex === i;
        return (
          <article key={a.number} data-fx="guide-row" className="border-b border-slate-200">
            <button
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="group flex w-full items-start gap-5 py-7 text-left lg:gap-8"
            >
              <span
                className={`w-12 shrink-0 text-3xl leading-none font-black transition-colors duration-300 lg:w-16 lg:text-4xl ${
                  open ? "text-brand-red" : "text-slate-300 group-hover:text-brand-red/50"
                }`}
              >
                {a.number}
              </span>
              <div className="flex-1">
                <span className="mb-1.5 block text-xs font-extrabold tracking-[1.5px] text-brand-red uppercase">
                  {a.category}
                </span>
                <h3 className="text-lg font-extrabold text-brand-navy lg:text-xl">
                  {a.title}
                </h3>
              </div>
              <span
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-lg font-light transition-all duration-300 ${
                  open
                    ? "rotate-45 border-brand-red bg-brand-red text-white"
                    : "border-slate-200 text-slate-400 group-hover:border-brand-red/40"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div
                  onClick={(e) => handleActionClick(e, a)}
                  className="guide-content pb-8 pl-[68px] text-[0.95rem] leading-[1.7] text-slate-600 lg:pl-24 [&_a]:mt-2 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:font-bold [&_a]:text-brand-red [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-red/30 [&_blockquote]:pl-4 [&_blockquote]:font-semibold [&_blockquote]:text-brand-navy [&_blockquote]:italic [&_p]:mb-4 [&_p:first-child]:font-semibold [&_p:first-child]:text-brand-navy [&_strong]:font-extrabold [&_strong]:text-brand-navy"
                  dangerouslySetInnerHTML={{ __html: a.contentHtml }}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
