import type { Metadata } from "next";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Solicita tu Cotización de Insumos | El Zarco Mayoreo",
  description:
    "¿Buscas un proveedor logístico confiable? Solicita tu cotización por WhatsApp y recibe tus insumos de abarrotes y perecederos al instante.",
  alternates: { canonical: "/contacto" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/contacto/#localbusiness`,
  name: "El Zarco",
  url: `${SITE_URL}/contacto`,
  telephone: "+52-229-847-7440",
  email: "elzarcomayoreo@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Local 2-85, Letra F, Central de Abasto",
    addressLocality: "Iztapalapa",
    addressRegion: "Ciudad de México",
    addressCountry: "MX",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "07:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "07:00", closes: "14:30" },
  ],
};

const CONTACT_ITEMS = [
  {
    label: "Canal de Ventas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    content: (
      <a href="https://wa.me/522298477440" target="_blank" rel="noreferrer" className="font-semibold text-brand-red hover:underline">
        +52 229 847 7440
      </a>
    ),
  },
  {
    label: "Correo Corporativo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    content: (
      <a href="mailto:elzarcomayoreo@gmail.com" className="font-semibold text-brand-red hover:underline">
        elzarcomayoreo@gmail.com
      </a>
    ),
  },
  {
    label: "Horarios de Matriz",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    content: (
      <p className="text-sm text-slate-600">
        <span className="text-slate-400">Lunes a Viernes:</span>{" "}
        <strong className="text-brand-navy">7:00 AM a 6:00 PM</strong>
        <br />
        <span className="text-slate-400">Sábados:</span>{" "}
        <strong className="text-brand-navy">7:00 AM a 5:00 PM</strong>
        <br />
        <span className="text-slate-400">Domingos:</span>{" "}
        <strong className="text-brand-navy">7:00 AM a 2:30 PM</strong>
      </p>
    ),
  },
];

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Navbar />
      <main className="bg-white pt-[calc(var(--navbar-h)+25px)] pb-20">
        <div className="mx-auto w-[90%] max-w-[1300px]">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <Reveal>
              <div>
                <h1 className="mb-4 text-3xl font-black tracking-[-1px] text-brand-navy lg:text-4xl">
                  Solicita tu Cotización
                </h1>
                <p className="mb-10 max-w-md text-slate-500">
                  Comunícate con nuestra matriz operativa para cotizar tu
                  inventario y coordinar la logística de abasto para tu
                  negocio.
                </p>

                <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
                  {CONTACT_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-start gap-4 py-6">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/5 text-brand-red">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="mb-1 text-xs font-extrabold tracking-[1.5px] text-slate-400 uppercase">
                          {item.label}
                        </h3>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <ContactForm />
            </Reveal>
          </div>

          <Reveal>
            <div className="relative mt-16 overflow-hidden rounded-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15057.940562213768!2d-99.09885834999999!3d19.3800632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fe0e5b7b9b1f%3A0x7d8e6a5e1f2b1a0!2sCentral%20de%20Abasto!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
                className="h-[350px] w-full lg:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 flex max-w-[90%] items-start gap-3 rounded-2xl bg-white p-4 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-brand-red">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="text-sm">
                  <strong className="block text-brand-navy">UBICACIÓN ESTRATÉGICA</strong>
                  <span className="text-slate-600">
                    Local 2-85, Letra F. Central de Abasto, Iztapalapa, CDMX.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
