"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ZONES = [
  "Recoger en Matriz (Central Abasto)",
  "Envío: Iztapalapa",
  "Envío: Benito Juárez",
  "Envío: Coyoacán",
  "Envío: Xochimilco",
  "Envío: Iztacalco",
  "Otra zona (Sujeto a volumen)",
];

const WA_NUMBER = "522298477440";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pr-4 pl-11 text-sm text-brand-navy placeholder:text-slate-400 transition-colors focus:border-brand-red focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10";

// Reemplaza el <form id="zarcoContactForm"> + su listener inline: arma la
// misma solicitud a /api/quote (guarda el lead) y abre WhatsApp con el
// resumen, con fallback si /api/quote falla.
export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [zone, setZone] = useState(ZONES[0]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const fields = scope.current?.querySelectorAll<HTMLElement>("[data-fx='field']");
      if (!fields?.length) return;
      gsap.from(fields, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: "top 85%" },
      });
    },
    { scope }
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("f_name") as HTMLInputElement).value.trim();
    const empresa =
      (form.elements.namedItem("f_company") as HTMLInputElement).value.trim() ||
      "Cliente B2B";
    const mensaje = (form.elements.namedItem("f_message") as HTMLTextAreaElement).value.trim();

    const fieldErrors = { f_name: !nombre, f_message: !mensaje };
    if (fieldErrors.f_name || fieldErrors.f_message) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    const resumen = `[COTIZACIÓN / ${zone}] ${mensaje}`;
    let folio = `COT-${Date.now().toString().slice(-4)}`;

    try {
      const r = await fetch("/api/quote", {
        method: "POST",
        body: JSON.stringify({
          negocio: `${empresa} (${nombre})`,
          resumen,
        }),
      });
      const result = await r.json();
      if (result.folio) folio = result.folio;
    } catch {
      // sin red: igual abrimos WhatsApp con el detalle.
    }

    const msg =
      `*NUEVA SOLICITUD ${folio}*\n` +
      `Nombre: ${nombre}\n` +
      `Negocio: ${empresa}\n` +
      `Logística: ${zone}\n\n` +
      `*Requerimiento:*\n${mensaje}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    form.reset();
    setZone(ZONES[0]);
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div ref={scope} className="border-t-2 border-brand-red pt-8">
      <div data-fx="field" className="mb-9 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/5 text-brand-red">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 12h6M9 16h6M9 8h6" />
            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
          </svg>
        </span>
        <div>
          <h2 className="mb-1.5 text-2xl font-black tracking-[-0.5px] text-brand-navy">
            Arma tu Requisición
          </h2>
          <p className="text-sm text-slate-500">
            Proporciona tus datos. El sistema organizará tu solicitud para una
            atención ejecutiva inmediata.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div data-fx="field" className="min-w-0">
            <label htmlFor="f_name" className="mb-2 block text-xs font-extrabold tracking-wide text-slate-400 uppercase">
              Nombre del Comprador
            </label>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-red/50">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="f_name"
                name="f_name"
                onChange={() => errors.f_name && setErrors((p) => ({ ...p, f_name: false }))}
                placeholder="Ej. Roberto Sánchez"
                className={`${inputClass} ${errors.f_name ? "border-brand-red bg-brand-red/5" : ""}`}
              />
            </div>
            {errors.f_name && <p className="mt-1.5 text-xs font-semibold text-brand-red">Completa este campo.</p>}
          </div>
          <div data-fx="field" className="min-w-0">
            <label htmlFor="f_company" className="mb-2 block text-xs font-extrabold tracking-wide text-slate-400 uppercase">
              Razón Social / Negocio
            </label>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-red/50">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9v.01M9 12v.01M9 15v.01" />
              </svg>
              <input
                id="f_company"
                name="f_company"
                placeholder="Ej. Grupo Gastronómico SC"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div data-fx="field">
          <label htmlFor="f_zone" className="mb-2 block text-xs font-extrabold tracking-wide text-slate-400 uppercase">
            Logística de Entrega
          </label>
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-red/50">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <select
              id="f_zone"
              name="f_zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className={`${inputClass} appearance-none pr-11`}
            >
              {ZONES.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div data-fx="field">
          <label htmlFor="f_message" className="mb-2 block text-xs font-extrabold tracking-wide text-slate-400 uppercase">
            Detalle del Requerimiento
          </label>
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-4 left-4 h-4 w-4 text-brand-red/50">
              <path d="M4 4h16v12H8l-4 4V4z" />
            </svg>
            <textarea
              id="f_message"
              name="f_message"
              rows={4}
              onChange={() => errors.f_message && setErrors((p) => ({ ...p, f_message: false }))}
              placeholder="Ej. Necesito cotizar 100 kg de Queso manchego y 50 kg de Pechuga de Pavo..."
              className={`w-full rounded-xl border bg-slate-50/60 py-3.5 pr-4 pl-11 text-sm text-brand-navy placeholder:text-slate-400 transition-colors focus:border-brand-red focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10 ${
                errors.f_message ? "border-brand-red bg-brand-red/5" : "border-slate-200"
              }`}
            />
          </div>
          {errors.f_message && <p className="mt-1.5 text-xs font-semibold text-brand-red">Completa este campo.</p>}
        </div>

        <div data-fx="field" className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={sending}
            className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-br from-brand-green to-[#1da851] py-4 font-black tracking-[1px] text-white uppercase shadow-[0_10px_28px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(37,211,102,0.45)] disabled:opacity-70"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.82-.12-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.15-4.94-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.58-.36.77-.36.19 0 .39 0 .55.01.18.01.42-.07.65.5.24.58.83 2.01.9 2.16.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.63-.08.17-.2.72-.84.92-1.13.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.72-.17 1.4z" />
            </svg>
            {sending ? "Procesando..." : "Cotizar por WhatsApp"}
          </button>
          {sent && (
            <p className="text-center text-sm font-semibold text-emerald-600">
              Solicitud enviada a la Matriz.
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 text-emerald-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Respuesta en &lt; 15 min.
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-emerald-600">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Cotización sin compromiso
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
