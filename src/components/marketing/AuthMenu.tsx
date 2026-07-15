"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useZarcoAuth, type ZarcoUser } from "./useZarcoAuth";

function initialOf(u: ZarcoUser) {
  return (u.name || u.email || "U").trim()[0]?.toUpperCase() || "U";
}

// Botón de cuenta del navbar de escritorio: sin sesión abre el popup de
// Google; con sesión abre un popover (perfil / admin / cerrar sesión).
export function DesktopAuthTrigger() {
  const { user, login, logout } = useZarcoAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        title="Mi Cuenta"
        onClick={() => (user ? setOpen((v) => !v) : login())}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] transition-all hover:-translate-y-0.5 ${
          user
            ? "border-transparent bg-gradient-to-br from-emerald-500 to-emerald-600 p-0.5"
            : "border-white/30 hover:border-white hover:bg-white/10"
        }`}
      >
        {user ? (
          <>
            {user.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.picture}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full border-2 border-brand-navy-light object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-red font-black text-white">
                {initialOf(user)}
              </span>
            )}
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-brand-navy-light bg-brand-green" />
          </>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5 text-white"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>

      {open && user && (
        <div className="absolute top-[calc(100%+15px)] right-0 z-[2005] w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-10px_rgba(10,34,64,0.25),0_5px_15px_rgba(0,0,0,0.06)]">
          <div className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-light p-5 text-left">
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-red/20 blur-2xl" />
            <div className="relative h-11 w-11 shrink-0 rounded-full border-2 border-white/30 p-0.5">
              {user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-red font-black text-white">
                  {initialOf(user)}
                </span>
              )}
            </div>
            <div className="relative min-w-0">
              <span className="block truncate font-extrabold text-white">
                {user.name || user.email || "Mi cuenta"}
              </span>
              {user.email && (
                <span className="block truncate text-[0.8rem] font-medium text-white/60">
                  {user.email}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2.5">
            <Link
              href="/perfil"
              className="group flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-navy/10 group-hover:text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M3 9.5 12 3l9 6.5" />
                  <path d="M5 9.5V21h14V9.5" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </span>
              Ir a mi Portal B2B
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="group flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-navy/10 group-hover:text-brand-navy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
                Panel admin
              </Link>
            )}
            <button
              onClick={logout}
              className="group mt-1 flex items-center gap-3 rounded-[10px] border-t border-slate-100 px-3.5 py-3 pt-4 text-left text-sm font-semibold text-brand-red"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Bloque de auth dentro del drawer móvil.
export function MobileAuthBlock() {
  const { user, login, logout } = useZarcoAuth();

  if (!user) {
    return (
      <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-5 text-center">
        <p className="mb-3 text-[0.85rem] font-medium text-white/70">
          Acceso a Socios Comerciales
        </p>
        <button
          onClick={login}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 py-3 font-bold text-white transition-colors hover:bg-white/10"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-full border-2 border-brand-green p-0.5">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-red font-black text-white">
              {initialOf(user)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-extrabold text-white">
            {user.name || "Usuario"}
          </span>
          {user.email && (
            <span className="block truncate text-xs text-white/60">
              {user.email}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href="/perfil"
          className="block rounded-lg bg-white py-2.5 text-center text-[0.85rem] font-extrabold text-brand-navy transition-transform hover:-translate-y-0.5"
        >
          Ir a mi Portal B2B
        </Link>
        <button
          onClick={logout}
          className="rounded-lg border border-white/10 py-2.5 text-[0.85rem] font-semibold text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-brand-red"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
