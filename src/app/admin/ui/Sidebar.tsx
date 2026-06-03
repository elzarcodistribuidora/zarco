"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconHome,
  IconBox,
  IconUsers,
  IconTruck,
  IconInbox,
  IconLogout,
  IconMenu,
  IconClose,
} from "./icons";

type NavItem = {
  href: string;
  label: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Inicio", Icon: IconHome },
  { href: "/admin/productos", label: "Productos", Icon: IconBox },
  { href: "/admin/clientes", label: "Clientes", Icon: IconUsers },
  { href: "/admin/pedidos", label: "Pedidos", Icon: IconTruck },
  { href: "/admin/cotizaciones", label: "Cotizaciones", Icon: IconInbox },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  userName,
  email,
}: {
  userName: string;
  email: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cierra el drawer móvil al navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
              active
                ? "bg-[#0A2240] text-white shadow-sm shadow-[#0A2240]/20"
                : "text-slate-500 hover:bg-slate-100 hover:text-[#0A2240]"
            }`}
          >
            <Icon
              className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                active ? "text-white" : "text-slate-400 group-hover:text-[#A81200]"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto space-y-3 pt-4">
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0A2240] text-sm font-bold text-white">
          {(userName || email || "?").charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-700">
            {userName || "Admin"}
          </span>
          <span className="block truncate text-xs text-slate-400">{email}</span>
        </span>
      </div>
      <form action="/auth/signout" method="post">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:border-[#A81200]/40 hover:bg-[#A81200]/5 hover:text-[#A81200] active:scale-[0.98]">
          <IconLogout width={18} height={18} />
          Salir
        </button>
      </form>
    </div>
  );

  const brand = (
    <Link
      href="/"
      title="Volver al inicio del sitio"
      className="group flex items-center gap-2 px-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/admin-logo.webp"
        alt="El Zarco — ir al inicio"
        className="h-9 w-9 object-contain transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
      />
      <span className="text-lg font-black leading-none tracking-tight text-[#0A2240]">
        El Zarco
        <span className="ml-1 text-[#A81200]">Admin</span>
      </span>
    </Link>
  );

  return (
    <>
      {/* Top bar móvil */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        {brand}
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 active:scale-95"
        >
          <IconMenu />
        </button>
      </header>

      {/* Sidebar fijo (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        {brand}
        <div className="mt-7">{nav}</div>
        {footer}
      </aside>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="admin-drawer-in absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between">
              {brand}
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 active:scale-95"
              >
                <IconClose />
              </button>
            </div>
            <div className="mt-7">{nav}</div>
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
