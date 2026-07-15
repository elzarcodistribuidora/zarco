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
        <div className="absolute top-[calc(100%+15px)] right-0 z-[2005] w-[280px] rounded-2xl border border-slate-200 bg-white shadow-[0_15px_35px_-5px_rgba(10,34,64,0.15),0_5px_15px_rgba(0,0,0,0.05)]">
          <div className="border-b border-slate-100 p-5 text-left">
            <span className="block truncate font-extrabold text-brand-navy">
              {user.name || user.email || "Mi cuenta"}
            </span>
            {user.email && (
              <span className="block truncate text-[0.8rem] font-medium text-slate-500">
                {user.email}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 p-2.5">
            <Link
              href="/perfil"
              className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-brand-navy"
            >
              Ir a mi Portal B2B
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-brand-navy"
              >
                Panel admin
              </Link>
            )}
            <button
              onClick={logout}
              className="mt-1 flex items-center gap-3 rounded-b-[10px] rounded-t-none border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-brand-red hover:bg-red-50"
            >
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
