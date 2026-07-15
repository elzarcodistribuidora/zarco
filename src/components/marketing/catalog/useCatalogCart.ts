"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CartItem = { name: string; price: number; qty: number };
export type CartEntry = [string, CartItem];

const STORAGE_KEY = "zarcoCartObjects";

function loadFromStorage(): Map<string, CartItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    return new Map(JSON.parse(raw));
  } catch {
    return new Map();
  }
}

// Carrito del catálogo: local (localStorage, mismo formato que usaba el JS de
// Webflow) + nube (/api/cart) cuando hay sesión. Expone window.zarcoCatalog.add
// para que CatalogRecs.tsx (cross-sell/upsell) siga funcionando sin cambios.
export function useCatalogCart(isLoggedIn: boolean) {
  const [cart, setCart] = useState<Map<string, CartItem>>(() => new Map());
  const [hydrated, setHydrated] = useState(false);
  const cartRef = useRef(cart);
  cartRef.current = cart;

  useEffect(() => {
    setCart(loadFromStorage());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Map<string, CartItem>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next.entries())));
    document.dispatchEvent(new Event("zarco:cart-updated"));
  }, []);

  // Sincroniza con /api/cart en cada cambio, si hay sesión.
  useEffect(() => {
    if (!hydrated || !isLoggedIn) return;
    const t = setTimeout(() => {
      fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ cart: JSON.stringify(Array.from(cart.entries())) }),
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [cart, hydrated, isLoggedIn]);

  // Al iniciar sesión, si el carrito local está vacío, trae el de la nube.
  useEffect(() => {
    if (!hydrated || !isLoggedIn || cartRef.current.size > 0) return;
    fetch("/api/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.savedCart || data.savedCart === "[]" || data.savedCart === "{}") return;
        const entries: CartEntry[] = JSON.parse(data.savedCart);
        if (!entries.length) return;
        setCart((prev) => {
          if (prev.size > 0) return prev;
          const next = new Map(prev);
          entries.forEach(([id, item]) => next.set(id, item));
          persist(next);
          return next;
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, hydrated]);

  const addItem = useCallback(
    (id: string, name: string, price: number, qty = 1) => {
      setCart((prev) => {
        const next = new Map(prev);
        next.set(id, { name, price, qty });
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      setCart((prev) => {
        const next = new Map(prev);
        next.delete(id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateQty = useCallback(
    (id: string, qty: number) => {
      if (qty <= 0) {
        removeItem(id);
        return;
      }
      setCart((prev) => {
        const item = prev.get(id);
        if (!item) return prev;
        const next = new Map(prev);
        next.set(id, { ...item, qty });
        persist(next);
        return next;
      });
    },
    [persist, removeItem]
  );

  const clear = useCallback(() => {
    setCart(new Map());
    persist(new Map());
  }, [persist]);

  // Puente para CatalogRecs.tsx (cross-sell/upsell), que llama
  // window.zarcoCatalog.add(id, name, price, qty) para agregar sugerencias.
  useEffect(() => {
    const win = window as unknown as {
      zarcoCatalog?: { add: (id: string, name: string, price: number, qty?: number) => boolean };
    };
    win.zarcoCatalog = {
      add: (id, name, price, qty = 1) => {
        addItem(id, name, price, qty);
        return true;
      },
    };
    return () => {
      delete win.zarcoCatalog;
    };
  }, [addItem]);

  return { cart, addItem, removeItem, updateQty, clear };
}
