"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Animaciones GSAP + ScrollTrigger propias de /nosotros (parallax del banner,
// entrada de la línea de tiempo, chips de cobertura y checklist). Todo
// escaneado dentro de este contenedor via data-fx="..." — Reveal.tsx sigue
// siendo el fade genérico del resto del sitio, esto es un extra puntual.
export default function ScrollFx({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const hero = root.querySelector<HTMLElement>("[data-fx='hero-img']");
      if (hero) {
        gsap.to(hero, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const timelineGroup = root.querySelector("[data-fx='timeline-group']");
      const timelineItems = root.querySelectorAll<HTMLElement>("[data-fx='timeline-item']");
      if (timelineGroup && timelineItems.length) {
        gsap.from(timelineItems, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: { trigger: timelineGroup, start: "top 82%" },
        });
      }

      const years = root.querySelectorAll<HTMLElement>("[data-fx='year']");
      years.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          scale: 0.6,
          duration: 0.7,
          delay: 0.15,
          ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      const statGroup = root.querySelector("[data-fx='stat-group']");
      const stats = root.querySelectorAll<HTMLElement>("[data-fx='stat']");
      if (statGroup && stats.length) {
        gsap.from(stats, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: statGroup, start: "top 85%" },
        });
      }

      const chipGroup = root.querySelector("[data-fx='chip-group']");
      const chips = root.querySelectorAll<HTMLElement>("[data-fx='chip']");
      if (chipGroup && chips.length) {
        gsap.from(chips, {
          opacity: 0,
          y: 14,
          scale: 0.85,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: 0.06,
          scrollTrigger: { trigger: chipGroup, start: "top 85%" },
        });
      }

      const checkGroup = root.querySelector("[data-fx='check-group']");
      const checks = root.querySelectorAll<HTMLElement>("[data-fx='check-item']");
      if (checkGroup && checks.length) {
        gsap.from(checks, {
          opacity: 0,
          x: -24,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: checkGroup, start: "top 85%" },
        });
      }

      const cta = root.querySelector<HTMLElement>("[data-fx='cta']");
      if (cta) {
        gsap.from(cta, {
          opacity: 0,
          y: 10,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: cta, start: "top 90%" },
        });
      }
    },
    { scope }
  );

  return (
    <main ref={scope} className={className}>
      {children}
    </main>
  );
}
