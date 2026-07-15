"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = scope.current?.querySelectorAll<HTMLElement>("[data-fx='faq-item']");
      if (!cards?.length) return;
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: "top 85%" },
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="mx-auto flex max-w-[840px] flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            data-fx="faq-item"
            className={`overflow-hidden rounded-2xl border bg-white transition-shadow duration-300 ${
              isOpen
                ? "border-brand-red/20 shadow-[0_12px_32px_rgba(168,18,0,0.1)]"
                : "border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-brand-red/20"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-6 py-5 text-left"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black transition-colors duration-300 ${
                  isOpen ? "bg-brand-red text-white" : "bg-brand-red/5 text-brand-red"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-[0.95rem] leading-snug font-extrabold text-brand-navy lg:text-base">
                {item.q}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-lg font-light transition-all duration-300 ${
                  isOpen
                    ? "rotate-45 border-brand-red bg-brand-red text-white"
                    : "border-slate-200 text-slate-400"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="flex gap-4 px-6 pb-6">
                  <span className="w-9 shrink-0" aria-hidden="true" />
                  <p
                    className="text-[0.95rem] leading-relaxed text-slate-600 [&_strong]:font-extrabold [&_strong]:text-brand-navy"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
