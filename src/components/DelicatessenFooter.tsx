import Link from "next/link";
import Reveal from "./marketing/Reveal";

// Mismo footer que el resto del sitio, recoloreado a la paleta gris oxford
// de Delicatessen (en vez del degradado rojo).

const SECTOR_LINKS = [
  { href: "/restaurantes", label: "Restaurantes" },
  { href: "/tiendas", label: "Tiendas" },
  { href: "/cafeterias", label: "Cafeterías" },
  { href: "/catalogo", label: "Catálogo Completo" },
];

const CATEGORY_LINKS = [
  { href: "/cremeria", label: "Lácteos y Cremería" },
  { href: "/embutidos", label: "Embutidos" },
  { href: "/abarrotes-basicos", label: "Abarrotes Básicos" },
];

const ABOUT_LINKS = [
  { href: "/nosotros", label: "Nuestra Historia" },
  { href: "/guias-de-negocio", label: "Guías de Negocio" },
  { href: "/contacto", label: "Contacto y Ubicación" },
  { href: "/perfil", label: "Portal de Clientes" },
];

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col">
      <h3 className="relative mb-6 pb-2.5 text-[1.05rem] font-black tracking-[2px] text-white uppercase after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-[35px] after:rounded after:bg-white md:after:left-1/2 md:after:-translate-x-1/2 lg:after:left-0 lg:after:translate-x-0">
        {title}
      </h3>
      <ul className="flex flex-col gap-3.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-block text-[0.95rem] font-medium text-white/75 transition-all hover:translate-x-1.5 hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DelicatessenFooter() {
  return (
    <footer className="relative mt-auto bg-gradient-to-br from-[#3A3D42] to-[#212327] pt-20 font-[Inter,sans-serif] text-white shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
      <Reveal>
        <div className="mx-auto grid w-[90%] max-w-[1300px] grid-cols-1 gap-10 pb-16 text-center md:grid-cols-2 md:text-left lg:grid-cols-[1.5fr_2fr_1fr] lg:gap-[50px]">
          <div className="flex flex-col items-center border-b border-white/10 pb-8 text-center md:col-span-2 md:border-b-0 md:pb-0 lg:col-span-1 lg:items-start lg:text-left">
            <Link href="/delicatessen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
                alt="Logo El Zarco Delicatessen Footer"
                className="mb-5 block h-[60px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] lg:h-20"
              />
            </Link>
            <div className="mb-5 inline-block self-center rounded-[20px] border border-white/40 bg-white/5 px-3.5 py-1.5 text-[0.75rem] font-extrabold tracking-[2px] text-white uppercase lg:self-start">
              Charcutería & Quesos Finos
            </div>
            <p className="mb-7 max-w-[350px] text-[0.95rem] leading-[1.7] text-white/80">
              Charolas y tablas premium con quesos finos y embutidos
              seleccionados, directo de la Central de Abasto a tu evento.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61574700037720"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/25 bg-white/10 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <svg viewBox="0 0 320 512" className="h-5 w-5 fill-white transition-all hover:fill-[#1C1610]">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/elzarcodistribuidora/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/25 bg-white/10 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <svg viewBox="0 0 448 512" className="h-5 w-5 fill-white transition-all hover:fill-[#1C1610]">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-8 md:border-b-0 md:pb-0 lg:grid-cols-3">
            <FooterCol title="Sectores" links={SECTOR_LINKS} />
            <FooterCol title="Categorías" links={CATEGORY_LINKS} />
            <div className="col-span-2 lg:col-span-1">
              <FooterCol title="Nosotros" links={ABOUT_LINKS} />
            </div>
          </div>

          <div className="flex flex-col items-center pt-8 md:items-center lg:items-start lg:pt-0">
            <h3 className="relative mb-6 pb-2.5 text-[1.05rem] font-black tracking-[2px] text-white uppercase">
              La Matriz
            </h3>
            <div className="mb-5">
              <span className="mb-1.5 block text-[0.75rem] font-extrabold tracking-[1px] text-white/60 uppercase">
                Ubicación Operativa
              </span>
              <p className="text-[0.95rem] leading-[1.6] text-white">
                Central de Abasto CDMX
                <br />
                Local 2-85, Letra F
                <br />
                Iztapalapa, CDMX
              </p>
            </div>
            <div className="mb-5">
              <span className="mb-1.5 block text-[0.75rem] font-extrabold tracking-[1px] text-white/60 uppercase">
                Línea de Ventas
              </span>
              <a
                href="tel:+522298477440"
                className="inline-flex items-center gap-2 font-bold text-white transition-all hover:translate-x-1 hover:opacity-80"
              >
                (55) 229-847-7440
              </a>
            </div>
            <div>
              <span className="mb-1.5 block text-[0.75rem] font-extrabold tracking-[1px] text-white/60 uppercase">
                Atención a Clientes
              </span>
              <a
                href="mailto:elzarcomayoreo@gmail.com"
                className="inline-flex items-center gap-2 font-bold text-white transition-all hover:translate-x-1 hover:opacity-80"
              >
                elzarcomayoreo@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="border-t border-white/5 bg-black/30 py-6">
        <div className="mx-auto flex w-[90%] max-w-[1300px] flex-col items-center gap-5 text-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:text-left">
          <p className="text-[0.85rem] text-white/60 lg:justify-self-start">
            © 2026 El Zarco Distribuidores. Todos los derechos reservados.
          </p>
          <a
            href="https://flouvia.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-semibold text-white/60 transition-all hover:-translate-y-0.5 hover:opacity-80 lg:justify-self-center"
          >
            Powered by <strong className="font-black tracking-[1px] text-white">FLOUVIA</strong>
          </a>
          <div className="hidden lg:block" />
        </div>
        <div className="mt-3 flex justify-center gap-4">
          <Link
            href="/terminos-del-servicio"
            className="text-[0.8rem] text-white/60 hover:text-white hover:underline"
          >
            Términos de Servicio
          </Link>
          <Link
            href="/aviso-de-privacidad"
            className="text-[0.8rem] text-white/60 hover:text-white hover:underline"
          >
            Aviso de Privacidad
          </Link>
        </div>
      </div>

      <a
        href="https://wa.me/522298477440"
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 z-[9999] flex items-center gap-2.5 rounded-full bg-brand-green px-6 py-3 font-black tracking-[1px] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all hover:-translate-y-1 hover:bg-[#20ba56] hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)] sm:right-[30px] sm:bottom-[30px]"
      >
        <svg viewBox="0 0 448 512" className="h-[22px] w-[22px] fill-current">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        <span className="hidden sm:inline">Atención a Clientes</span>
      </a>
    </footer>
  );
}
