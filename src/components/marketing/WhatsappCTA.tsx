import Link from "next/link";
import Reveal from "./Reveal";

// Banner de cierre que va SIEMPRE pegado justo arriba del Footer, a todo el
// ancho — delgado, pregunta a la izquierda + botón pill a la derecha. Mismo
// componente en todas las páginas, solo cambian texto/link/variante de color.
export default function WhatsappCTA({
  title,
  href = "/contacto",
  btnLabel,
  variant = "navy",
}: {
  title: string;
  href?: string;
  btnLabel: string;
  variant?: "navy" | "red";
}) {
  const bg =
    variant === "red"
      ? "bg-gradient-to-br from-brand-red to-brand-red-dark"
      : "bg-gradient-to-br from-brand-navy to-brand-navy-light";
  const pillText = variant === "red" ? "text-slate-700" : "text-brand-red";
  const circle =
    variant === "red"
      ? "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
      : "bg-brand-red text-white group-hover:bg-brand-red-dark";

  return (
    <Reveal>
      <section className={`${bg} px-6 py-6 text-white lg:py-7`}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
          <h2 className="text-center text-base font-black sm:text-left sm:text-lg lg:text-xl">
            {title}
          </h2>
          <Link
            href={href}
            className={`group inline-flex shrink-0 items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-[0.8rem] font-extrabold tracking-wide uppercase ${pillText} shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-0.5`}
          >
            {btnLabel}
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${circle} group-hover:translate-x-0.5`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
