"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type {
  CartItem,
  CatalogProduct,
  Pedido,
  UserData,
} from "@/lib/matriz";
import { saveCart, sendOrder, signOutAction } from "./actions";
import Catalog from "./Catalog";
import CartDrawer from "./CartDrawer";
import History from "./History";

type CartMap = Record<string, CartItem>;

export default function PortalShell({
  userData,
  userEmail,
  avatar,
  history,
  catalog,
  initialCart,
}: {
  userData: UserData;
  userEmail: string;
  avatar: string | null;
  history: Pedido[];
  catalog: CatalogProduct[];
  initialCart: CartItem[];
}) {
  const router = useRouter();
  const [cart, setCart] = useState<CartMap>(() =>
    Object.fromEntries(initialCart.map((i) => [i.code, i]))
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  const items = useMemo(() => Object.values(cart), [cart]);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Sincroniza el carrito a la nube (debounced), saltando el render inicial.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = setTimeout(() => {
      void saveCart(items);
    }, 800);
    return () => clearTimeout(t);
  }, [items]);

  const showToast = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const addItem = useCallback(
    (p: CatalogProduct, qty: number) => {
      const q = Math.max(1, Math.floor(qty) || 1);
      setCart((prev) => ({
        ...prev,
        [p.code]: {
          code: p.code,
          name: p.name,
          price: p.price,
          qty: (prev[p.code]?.qty ?? 0) + q,
        },
      }));
      showToast(`${q}× ${p.name} agregado a tu requisición`);
    },
    [showToast]
  );

  const setQty = useCallback((code: string, qty: number) => {
    setCart((prev) => {
      if (!prev[code]) return prev;
      const q = Math.floor(qty);
      if (q <= 0) {
        const next = { ...prev };
        delete next[code];
        return next;
      }
      return { ...prev, [code]: { ...prev[code], qty: q } };
    });
  }, []);

  const removeItem = useCallback((code: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  // Repetir un pedido del historial: parsea el resumen "2x Nombre (CODE), ..."
  // y vuelve a armar el carrito con los precios actuales del catálogo.
  const repeatOrder = useCallback(
    (pedido: Pedido) => {
      const resumen = pedido.resumen ?? "";
      const re = /(\d+)\s*x\s*(.+?)\s*\(([^)]+)\)/g;
      const byCode = new Map(catalog.map((p) => [p.code, p]));
      let added = 0;
      let m: RegExpExecArray | null;
      const additions: CartMap = {};
      while ((m = re.exec(resumen)) !== null) {
        const qty = Math.max(1, parseInt(m[1], 10) || 1);
        const code = m[3].trim();
        const prod = byCode.get(code);
        if (prod) {
          additions[code] = {
            code: prod.code,
            name: prod.name,
            price: prod.price,
            qty,
          };
          added++;
        }
      }
      if (added === 0) {
        showToast("No se pudo reconstruir ese pedido desde el catálogo actual.");
        return;
      }
      setCart((prev) => ({ ...prev, ...additions }));
      setCartOpen(true);
      showToast(`${added} producto(s) cargados a tu requisición`);
    },
    [catalog, showToast]
  );

  const handleSend = useCallback(async () => {
    if (sending || items.length === 0) return;
    setSending(true);
    // Abrimos la pestaña ANTES del await para que el navegador no la bloquee.
    const win = window.open("", "_blank");
    try {
      const res = await sendOrder(items);
      if (res.ok) {
        if (win) win.location.href = res.waUrl;
        else window.location.href = res.waUrl;
        clearCart();
        setCartOpen(false);
        showToast(`Requisición ${res.folio} registrada en la Matriz`);
        router.refresh();
      } else {
        if (win) win.close();
        showToast(res.error);
      }
    } catch {
      if (win) win.close();
      showToast("Error al enviar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }, [sending, items, clearCart, showToast, router]);

  return (
    <div className="min-h-screen bg-slate-100 pb-28">
      {/* ===== Header ===== */}
      <header className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-4">
          <Image
            src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
            alt="Distribuidora El Zarco"
            width={150}
            height={48}
            className="h-11 w-auto object-contain"
            priority
          />
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-bold">{userData.nombre}</p>
              <p className="text-xs text-white/60">{userEmail}</p>
            </div>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt=""
                className="h-10 w-10 rounded-full ring-2 ring-white/20"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-black">
                {userData.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-white/80 transition hover:bg-white/10"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ===== Resumen del cliente ===== */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="-mt-px grid gap-3 py-5 sm:grid-cols-3">
          <StatCard label="Tu estatus" value={userData.estatus} />
          <StatCard label="Cliente" value={userData.id} />
          <StatCard
            label="Pedidos registrados"
            value={String(history.length)}
          />
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-6 px-5">
        <Catalog catalog={catalog} cart={cart} onAdd={addItem} />
        <History history={history} onRepeat={repeatOrder} />
      </main>

      {/* ===== Botón flotante del carrito ===== */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full bg-brand-red px-5 py-4 font-bold text-white shadow-xl transition hover:brightness-110"
      >
        <span className="relative">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6h15l-1.5 9h-12L6 6Zm0 0-.7-3H3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
            <circle cx="18" cy="20" r="1.4" fill="currentColor" />
          </svg>
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-black text-brand-red">
              {count}
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Mi requisición</span>
      </button>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        total={total}
        sending={sending}
        onSetQty={setQty}
        onRemove={removeItem}
        onClear={clearCart}
        onSend={handleSend}
      />

      {/* ===== Toast ===== */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-black text-brand-navy">{value}</p>
    </div>
  );
}
