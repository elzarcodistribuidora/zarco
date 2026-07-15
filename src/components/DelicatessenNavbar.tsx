"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DesktopAuthTrigger, MobileAuthBlock } from "./marketing/AuthMenu";
import { MAIN_LINKS, PRODUCT_LINKS } from "./marketing/navData";

// Mismo navbar que el resto del sitio (misma lógica de scroll/drawer/auth/
// --navbar-h), solo que recoloreado para Delicatessen: barra del logo en
// gris oxford, barra de links en rojo Zarco.
const BG_TOP = "#3A3D42"; // gris oxford
const BG_BOTTOM = "#A81200"; // rojo Zarco

export default function DelicatessenNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const lastScrollY = useRef(0);
  const scrolledRef = useRef(false);
  scrolledRef.current = scrolled;
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastScrollY.current && y > 160) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      if (scrolledRef.current) return;
      document.documentElement.style.setProperty("--navbar-h", `${el.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 z-[2000] w-full font-[Inter,sans-serif] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          style={{ backgroundColor: BG_TOP }}
          className={`overflow-x-hidden transition-[padding] duration-300 ${scrolled ? "py-2.5" : "py-5"}`}
        >
          <div
            style={{ backgroundColor: BG_TOP }}
            className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_auto_1fr]"
          >
            <div className="hidden justify-self-start lg:block">
              <Link href="/delicatessen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
                  alt="Logo El Zarco Delicatessen"
                  className={`block drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-all duration-300 ${scrolled ? "h-[60px]" : "h-[100px]"}`}
                />
              </Link>
            </div>
            <div className="flex max-w-full justify-center lg:justify-self-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/69a9afaad2c75d4f8e8e79ec_GIF-EL-ZARCO-1.webp"
                alt="Promo El Zarco"
                className={`block max-w-full rounded-lg object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-300 ${scrolled ? "h-[38px] lg:h-[60px]" : "h-[65px] lg:h-[100px]"}`}
              />
            </div>
            <div className="hidden items-center justify-self-end gap-4 lg:flex">
              <DesktopAuthTrigger />
              <Link
                href="/delicatessen/arma-tu-charola"
                className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-[0.85rem] font-black tracking-[1.5px] text-slate-700 uppercase shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Arma tu Charola
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all duration-300 group-hover:bg-slate-300 group-hover:translate-x-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{ backgroundColor: BG_BOTTOM }}
          className="relative flex items-center justify-center py-[5px] lg:py-1"
        >
          <div
            style={{ backgroundColor: BG_BOTTOM }}
            className="flex w-full items-center justify-between px-[5%] lg:w-auto lg:justify-center lg:px-0"
          >
            <Link href="/delicatessen" className="lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
                alt="Logo El Zarco Delicatessen Móvil"
                className="block h-[45px]"
              />
            </Link>

            <ul className="hidden items-center gap-16 lg:flex">
              {MAIN_LINKS.slice(0, 1).map((l) => (
                <li key={l.href}>
                  <DeliNavLink href={l.href}>{l.label.toUpperCase()}</DeliNavLink>
                </li>
              ))}
              <li
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button
                  type="button"
                  className="group flex h-full appearance-none items-center gap-1.5 border-0 bg-transparent py-1.5 text-[0.8rem] leading-none font-bold tracking-[2.5px] text-white/85 uppercase outline-none transition-colors hover:text-white"
                >
                  Productos
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`h-3.5 w-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <ul
                  style={{ backgroundColor: `${BG_TOP}f0` }}
                  className={`absolute top-full left-0 z-[1999] flex w-full items-stretch justify-center gap-16 border-t border-white/5 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all ${
                    productsOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  {PRODUCT_LINKS.map((l) => (
                    <li key={l.href} className="flex items-center">
                      <Link
                        href={l.href}
                        className="relative inline-block py-1.5 text-[0.8rem] font-bold tracking-[2px] text-white/85 transition-colors after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-white after:transition-all hover:text-white hover:after:w-full"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {MAIN_LINKS.slice(1).map((l) => (
                <li key={l.href}>
                  <DeliNavLink href={l.href}>{l.label.toUpperCase()}</DeliNavLink>
                </li>
              ))}
            </ul>

            <button
              aria-label="Abrir menú"
              onClick={() => setDrawerOpen(true)}
              className="z-[2002] flex flex-col gap-1.5 border-none bg-transparent p-1.5 lg:hidden"
            >
              <span className="h-[3px] w-[26px] rounded bg-white" />
              <span className="h-[3px] w-[26px] rounded bg-white" />
              <span className="h-[3px] w-[26px] rounded bg-white" />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[1999] bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          drawerOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <div
        style={{ backgroundColor: `${BG_TOP}f2` }}
        className={`fixed top-0 right-0 z-[2001] flex h-screen w-[74%] max-w-[320px] flex-col overflow-y-auto rounded-l-[28px] border-l border-white/10 px-7 pt-[70px] pb-10 shadow-[-16px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 ease-out will-change-transform lg:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          aria-label="Cerrar menú"
          onClick={() => setDrawerOpen(false)}
          className="absolute top-5 right-5 text-2xl text-white/70"
        >
          ×
        </button>
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
            alt="Logo El Zarco Delicatessen"
            className="h-[50px]"
          />
        </div>

        <MobileAuthBlock />

        <ul className="mb-auto flex w-full flex-col">
          <li className="border-b border-white/5">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex w-full items-center justify-between py-4 text-lg font-bold tracking-[2px] text-white uppercase"
            >
              Inicio
            </Link>
          </li>
          <li className="border-b border-white/5">
            <button
              onClick={() => setProductsOpen((v) => !v)}
              className="flex w-full items-center justify-between py-4 text-lg font-bold tracking-[2px] text-white uppercase"
            >
              Productos
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-5 w-5 text-white/50 transition-transform ${productsOpen ? "rotate-180 text-white" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <ul
              className={`overflow-hidden transition-[max-height] duration-300 ${productsOpen ? "max-h-96" : "max-h-0"}`}
            >
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    className="block py-3 pl-5 text-white/70"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {MAIN_LINKS.slice(1).map((l) => (
            <li key={l.href} className="border-b border-white/5">
              <Link
                href={l.href}
                onClick={() => setDrawerOpen(false)}
                className="flex w-full items-center justify-between py-4 text-lg font-bold tracking-[2px] text-white uppercase"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 w-full">
          <Link href="/delicatessen/arma-tu-charola" onClick={() => setDrawerOpen(false)}>
            <button className="w-full rounded-md bg-brand-red py-4.5 text-base font-black tracking-[2px] text-white uppercase">
              Arma tu Charola
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

function DeliNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative flex items-center gap-1.5 py-1.5 text-[0.8rem] leading-none font-bold tracking-[2.5px] text-white/85 uppercase transition-colors after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-0 after:-translate-x-1/2 after:rounded-t after:bg-white after:transition-all hover:text-white hover:after:w-full"
    >
      {children}
    </Link>
  );
}
