"use client";

import { useEffect } from "react";

/**
 * Recomendaciones del catálogo (cross-sell / upsell), montado SOLO en /catalogo.
 *
 * El catálogo es HTML/JS de Webflow; este componente NO renderiza en React, sino
 * que manipula el DOM (como PageScripts). Para ser robusto NO depende de poder
 * leer variables léxicas del JS de Webflow:
 *   - LEE el carrito de `localStorage.zarcoCartObjects` (el catálogo lo escribe
 *     en cada cambio vía saveCartToStorage).
 *   - DETECTA cambios con un MutationObserver sobre `#cartItemsList` (updateCartUI
 *     reescribe su contenido en cada cambio) + el evento `zarco:cart-updated`.
 *   - AGREGA vía el puente `window.zarcoCatalog.add` (→ handleProductSelection),
 *     que es una función global del catálogo.
 *
 * Las recomendaciones precalculadas vienen en /api/inventory (recs_comp para
 * cross-sell / complementos, recs_sim para upsell / similares).
 *
 * Superficies:
 *   1. Strip "Completa tu pedido" dentro del carrito (cross-sell del carrito).
 *   2. Popover "Combina bien con…" al agregar un producto (upsell puntual).
 */

type Prod = { name: string; price: number; comp: string[]; sim: string[] };
type CartItem = { name: string; price: number; qty: number };

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export default function CatalogRecs() {
  useEffect(() => {
    if (!location.pathname.replace(/\/+$/, "").endsWith("/catalogo")) return;

    const index = new Map<string, Prod>();
    let prevKeys = new Set<string>();
    let suppressUntil = 0; // evita popover al agregar desde una recomendación
    let popoverTimer: ReturnType<typeof setTimeout> | null = null;
    let mo: MutationObserver | null = null;
    let cancelled = false;

    const win = window as unknown as {
      zarcoCatalog?: {
        add?: (id: string, name: string, price: number, qty?: number) => boolean;
      };
    };

    // ---------- estilos (una vez) ----------
    function ensureStyles() {
      if (document.getElementById("zarco-recs-css")) return;
      const s = document.createElement("style");
      s.id = "zarco-recs-css";
      s.textContent = `
        #zarco-xsell{padding:6px 24px 14px;border-top:1px solid rgba(0,0,0,.06);background:rgba(255,255,255,.6);}
        #zarco-xsell .zr-h{display:flex;align-items:center;gap:8px;margin:8px 0 12px;font:700 13px/1.2 Inter,system-ui,sans-serif;color:#0A2240;letter-spacing:.02em;}
        #zarco-xsell .zr-h svg{flex:0 0 auto;color:#A81200;}
        .zr-track{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;scrollbar-width:thin;-webkit-overflow-scrolling:touch;}
        .zr-track::-webkit-scrollbar{height:6px;}
        .zr-track::-webkit-scrollbar-thumb{background:rgba(10,34,64,.2);border-radius:3px;}
        .zr-card{position:relative;flex:0 0 150px;width:150px;box-sizing:border-box;background:#fff;border:1px solid rgba(10,34,64,.10);border-radius:14px;padding:11px 11px 12px;display:flex;flex-direction:column;gap:7px;box-shadow:0 4px 14px rgba(10,34,64,.06);cursor:pointer;transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease;}
        .zr-card:hover{border-color:rgba(168,18,0,.25);transform:translateY(-2px);box-shadow:0 8px 20px rgba(10,34,64,.1);}
        .zr-card.zr-selected{border-color:rgba(26,127,70,.35);box-shadow:0 8px 20px rgba(26,127,70,.15);}
        .zr-card .zr-name{font:600 12px/1.3 Inter,system-ui,sans-serif;color:#1f2a37;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:31px;}
        .zr-card .zr-price{font:700 13px/1 Inter,system-ui,sans-serif;color:#0A2240;}
        .zr-check{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border-radius:9999px;background:linear-gradient(135deg,#1a7f46,#22c55e);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(26,127,70,.45);opacity:0;transform:scale(.4);transition:opacity .25s ease,transform .3s cubic-bezier(.34,1.56,.64,1);pointer-events:none;}
        .zr-card.zr-selected .zr-check{opacity:1;transform:scale(1);}
        .zr-add{margin-top:auto;border:none;cursor:pointer;background:#0A2240;color:#fff;font:700 12px/1 Inter,system-ui,sans-serif;padding:9px 10px;border-radius:9999px;width:100%;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .15s ease,transform .15s ease;}
        .zr-card:hover .zr-add{background:#A81200;transform:translateY(-1px);}
        .zr-add.zr-done{background:linear-gradient(135deg,#1a7f46,#22c55e);}
        .zr-card:hover .zr-add.zr-done{background:linear-gradient(135deg,#1a7f46,#22c55e);transform:none;}
        #zarco-upsell{position:fixed;left:50%;bottom:92px;transform:translateX(-50%) translateY(12px);width:min(420px,calc(100vw - 32px));z-index:2040;background:rgba(255,255,255,.98);backdrop-filter:blur(16px);border:1px solid rgba(10,34,64,.12);border-radius:18px;box-shadow:0 18px 50px rgba(5,18,38,.28);padding:14px 14px 12px;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .35s cubic-bezier(.16,1,.3,1);}
        #zarco-upsell.zr-show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto;}
        #zarco-upsell .zr-h{display:flex;align-items:center;gap:8px;margin:0 0 10px;font:700 13px/1.25 Inter,system-ui,sans-serif;color:#0A2240;padding-right:22px;}
        #zarco-upsell .zr-h svg{flex:0 0 auto;color:#A81200;}
        #zarco-upsell .zr-x{position:absolute;top:9px;right:10px;border:none;background:none;cursor:pointer;font-size:20px;line-height:1;color:#8aa0b8;padding:2px 6px;border-radius:8px;}
        #zarco-upsell .zr-x:hover{background:rgba(10,34,64,.06);color:#0A2240;}
        @media (max-width:520px){ .zr-card{flex-basis:138px;width:138px;} }
      `;
      document.head.appendChild(s);
    }

    // ---------- estado del carrito (desde localStorage) ----------
    function getCartEntries(): Array<[string, CartItem]> {
      try {
        const raw = localStorage.getItem("zarcoCartObjects");
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) return arr as Array<[string, CartItem]>;
        }
      } catch {
        /* ignore */
      }
      return [];
    }

    function addRec(code: string) {
      const p = index.get(code);
      if (!p) return;
      suppressUntil = Date.now() + 1500;
      win.zarcoCatalog?.add?.(code, p.name, p.price);
    }

    function card(code: string): HTMLElement | null {
      const p = index.get(code);
      if (!p) return null;
      const el = document.createElement("div");
      el.className = "zr-card";
      el.setAttribute("role", "button");
      el.tabIndex = 0;

      const check = document.createElement("span");
      check.className = "zr-check";
      check.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

      const name = document.createElement("div");
      name.className = "zr-name";
      name.textContent = p.name;

      const price = document.createElement("div");
      price.className = "zr-price";
      price.textContent = mxn.format(p.price);

      const btn = document.createElement("button");
      btn.className = "zr-add";
      btn.type = "button";
      btn.tabIndex = -1;
      btn.innerHTML = "＋ Agregar";

      const select = () => {
        if (el.dataset.added === "1") return;
        el.dataset.added = "1";
        addRec(code);
        el.classList.add("zr-selected");
        btn.classList.add("zr-done");
        btn.innerHTML =
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Agregado';
      };

      el.addEventListener("click", select);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      });

      el.append(check, name, price, btn);
      return el;
    }

    // ---------- 1) Cross-sell dentro del carrito ----------
    function renderCrossSell() {
      const drawer = document.getElementById("cartDrawer");
      const footer = drawer?.querySelector(".cart-footer");
      if (!drawer || !footer) return;

      const entries = getCartEntries();
      const inCart = new Set(entries.map(([id]) => id));

      let box = document.getElementById("zarco-xsell");
      if (entries.length === 0) {
        box?.remove();
        return;
      }

      // Agrega complementos de todo el carrito (más peso si lo sugieren varios).
      const score = new Map<string, number>();
      for (const [id] of entries) {
        const p = index.get(id);
        if (!p) continue;
        p.comp.forEach((c, rank) => {
          if (inCart.has(c) || !index.has(c)) return;
          score.set(c, (score.get(c) || 0) + (10 - Math.min(rank, 9)));
        });
      }
      let ranked = [...score.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
      // Si hay pocos complementos, rellena con similares (upsell).
      if (ranked.length < 4) {
        for (const [id] of entries) {
          const p = index.get(id);
          if (!p) continue;
          for (const c of p.sim) {
            if (!inCart.has(c) && index.has(c) && !ranked.includes(c)) ranked.push(c);
          }
        }
      }
      ranked = ranked.slice(0, 8);

      if (ranked.length === 0) {
        box?.remove();
        return;
      }

      if (!box) {
        box = document.createElement("div");
        box.id = "zarco-xsell";
        drawer.insertBefore(box, footer);
      }
      box.innerHTML = "";
      const h = document.createElement("div");
      h.className = "zr-h";
      h.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg><span>Completa tu pedido</span>';
      const track = document.createElement("div");
      track.className = "zr-track";
      track.setAttribute("data-lenis-prevent", "");
      for (const code of ranked) {
        const c = card(code);
        if (c) track.appendChild(c);
      }
      box.append(h, track);
    }

    // ---------- 2) Upsell al agregar un producto ----------
    function showUpsell(code: string) {
      const p = index.get(code);
      if (!p) return;
      const entries = getCartEntries();
      const inCart = new Set(entries.map(([id]) => id));
      let recs = p.comp.filter((c) => !inCart.has(c) && index.has(c));
      if (recs.length === 0) recs = p.sim.filter((c) => !inCart.has(c) && index.has(c));
      recs = recs.slice(0, 4);
      if (recs.length === 0) return;

      let pop = document.getElementById("zarco-upsell");
      if (!pop) {
        pop = document.createElement("div");
        pop.id = "zarco-upsell";
        pop.setAttribute("data-lenis-prevent", "");
        document.body.appendChild(pop);
      }
      pop.innerHTML = "";
      const x = document.createElement("button");
      x.className = "zr-x";
      x.type = "button";
      x.innerHTML = "&times;";
      x.addEventListener("click", () => hideUpsell());
      const h = document.createElement("div");
      h.className = "zr-h";
      const safe = document.createElement("span");
      safe.textContent = `Combina bien con ${p.name}`;
      h.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
      h.appendChild(safe);
      const track = document.createElement("div");
      track.className = "zr-track";
      track.setAttribute("data-lenis-prevent", "");
      for (const c of recs) {
        const el = card(c);
        if (el) track.appendChild(el);
      }
      pop.append(x, h, track);
      requestAnimationFrame(() => pop?.classList.add("zr-show"));
      if (popoverTimer) clearTimeout(popoverTimer);
      popoverTimer = setTimeout(hideUpsell, 7000);
    }

    function hideUpsell() {
      const pop = document.getElementById("zarco-upsell");
      if (!pop) return;
      pop.classList.remove("zr-show");
      if (popoverTimer) clearTimeout(popoverTimer);
    }

    // ---------- reacción a cambios del carrito ----------
    function onCartUpdated() {
      ensureStyles();
      renderCrossSell();
      const entries = getCartEntries();
      const keys = new Set<string>(entries.map(([id]) => id));
      const added = [...keys].filter((k) => !prevKeys.has(k));
      prevKeys = keys;
      if (added.length && Date.now() > suppressUntil) {
        showUpsell(added[added.length - 1]);
      }
    }

    // ---------- arranque: observar #cartItemsList + sembrar estado ----------
    function attach() {
      if (cancelled) return false;
      const list = document.getElementById("cartItemsList");
      if (!list) return false;
      ensureStyles();
      prevKeys = new Set<string>(getCartEntries().map(([id]) => id)); // sin popover inicial
      mo = new MutationObserver(() => onCartUpdated());
      mo.observe(list, { childList: true, subtree: true });
      renderCrossSell();
      return true;
    }

    // El #cartItemsList viene en el HTML inicial; reintenta por si aún no montó.
    let tries = 0;
    function tryAttach() {
      if (attach()) return;
      if (tries++ < 40) setTimeout(tryAttach, 150);
    }

    // ---------- carga del índice de recomendaciones ----------
    fetch("/api/inventory")
      .then((r) => r.json())
      .then((rows: Record<string, unknown>[]) => {
        if (cancelled) return;
        for (const row of rows) {
          const code = String(row["CODIGO"] ?? "");
          if (!code) continue;
          index.set(code, {
            name: String(row["NOMBRE PARA WEB"] ?? code),
            price: Number(row["PRECIO FINAL"] ?? 0),
            comp: Array.isArray(row["recs_comp"]) ? (row["recs_comp"] as string[]) : [],
            sim: Array.isArray(row["recs_sim"]) ? (row["recs_sim"] as string[]) : [],
          });
        }
        renderCrossSell();
      })
      .catch(() => {});

    // Evento del puente (refuerzo del MutationObserver).
    document.addEventListener("zarco:cart-updated", onCartUpdated);
    tryAttach();

    return () => {
      cancelled = true;
      document.removeEventListener("zarco:cart-updated", onCartUpdated);
      mo?.disconnect();
      if (popoverTimer) clearTimeout(popoverTimer);
      document.getElementById("zarco-xsell")?.remove();
      document.getElementById("zarco-upsell")?.remove();
    };
  }, []);

  return null;
}
