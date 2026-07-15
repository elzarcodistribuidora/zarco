"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cheeses, meats, extras, type Ingredient } from "./trayData";

/* ── Types ── */
type BoardSize = "pequeña" | "mediana" | "grande" | "jumbo" | null;

const MIN_TRAYS = 5;

interface SelectedItem {
  id: string;
  name: string;
  category: "cheese" | "meat" | "extra";
  quantity: number;
  unit: string;
  step: number;
  min: number;
}

/* ── Colors ── */
const C = {
  blue: "#0A2240",
  blueLight: "#16365C",
  red: "#A81200",
  redDark: "#8A0F00",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  text: "#0F172A",
  green: "#25D366",
};

/* ── Animation Variants ── */
const slideVariants = {
  enter: (d: number) => ({ opacity: 0, y: d > 0 ? 40 : -40 }),
  center: { opacity: 1, y: 0 },
  exit: (d: number) => ({ opacity: 0, y: d > 0 ? -40 : 40 }),
};

// Al avanzar/retroceder solo queremos volver al tope del formulario (justo
// debajo del navbar fijo), NO al tope absoluto de la página — eso arrastraba
// de vuelta el banner de arriba y se sentía como una recarga. El sitio usa
// Lenis para el scroll suave, que lleva su propio estado de scroll "virtual";
// un window.scrollTo nativo pelea contra ese estado y el scroll rebota de
// vuelta a donde estaba. Hay que usar la API de Lenis (expuesta en
// window.__lenis por SmoothScroll.tsx) para que quede sincronizado.
function scrollToBuilderTop() {
  const el = document.getElementById("charola-builder");
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { immediate: true });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function TrayBuilder() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [size, setSize] = useState<BoardSize>(null);
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const [trayCount, setTrayCount] = useState(MIN_TRAYS);
  const totalSteps = 7;

  const updateTrayCount = useCallback((delta: number) => {
    setTrayCount((c) => Math.max(MIN_TRAYS, c + delta));
  }, []);

  const next = useCallback(() => {
    if (step < totalSteps - 1) { setDir(1); setStep((s) => s + 1); scrollToBuilderTop(); }
  }, [step]);

  const prev = useCallback(() => {
    if (step > 0) { setDir(-1); setStep((s) => s - 1); scrollToBuilderTop(); }
  }, [step]);

  const toggleItem = useCallback((ing: Ingredient) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === ing.id);
      if (exists) return prev.filter((i) => i.id !== ing.id);
      return [...prev, { id: ing.id, name: ing.name, category: ing.category, quantity: ing.min, unit: ing.defaultUnit, step: ing.step, min: ing.min }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const nq = i.quantity + delta * i.step;
        return { ...i, quantity: nq >= i.min ? nq : i.min };
      })
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const sendWhatsApp = useCallback(() => {
    if (!size) return;
    const fmt = (i: SelectedItem) => `  · ${i.name} — ${i.quantity}${i.unit}/charola × ${trayCount} = ${i.quantity * trayCount}${i.unit}`;
    let t = `Hola, quiero cotizar charolas:\n\n`;
    t += `*Tamaño:* ${size.charAt(0).toUpperCase() + size.slice(1)}\n`;
    t += `*Número de charolas:* ${trayCount} (pedido mínimo: ${MIN_TRAYS})\n\n`;
    const c = items.filter((i) => i.category === "cheese");
    if (c.length) t += `*Quesos:*\n${c.map(fmt).join("\n")}\n\n`;
    const m = items.filter((i) => i.category === "meat");
    if (m.length) t += `*Carnes Frías:*\n${m.map(fmt).join("\n")}\n\n`;
    const e = items.filter((i) => i.category === "extra");
    if (e.length) t += `*Acompañamientos:*\n${e.map(fmt).join("\n")}\n\n`;
    if (notes.trim()) t += `*Notas adicionales:*\n${notes.trim()}\n\n`;
    t += `¿Me pueden dar precio?`;
    window.open(`https://wa.me/522298477440?text=${encodeURIComponent(t)}`, "_blank");
  }, [size, items, notes, trayCount]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTextarea = target.tagName === "TEXTAREA";
      const isInput = target.tagName === "INPUT";

      // Paso 1 (tamaño): teclas 1-4 seleccionan y avanzan, como en Typeform.
      if (step === 1 && /^[1-4]$/.test(e.key)) {
        const chosen = sizes[Number(e.key) - 1];
        if (chosen) {
          setSize(chosen.id);
          setTimeout(next, 250);
        }
        return;
      }

      if (e.key === "Enter") {
        if (isTextarea && e.shiftKey) return; // Shift+Enter = salto de línea
        if (isTextarea) e.preventDefault(); // Enter solo = avanzar, no salto de línea
        // Si el foco quedó en un <button> (p.ej. justo después de clickear un
        // ingrediente), el navegador dispara su propio click al presionar
        // Enter — eso des-seleccionaba el ingrediente justo al avanzar.
        if (target.tagName === "BUTTON") e.preventDefault();

        if (step === 1) { if (size) next(); return; }
        if (step === 6) { if (items.length > 0) sendWhatsApp(); return; }
        next();
        return;
      }

      if (!isTextarea && !isInput) {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          if (step === 1 && !size) return;
          next();
        }
        if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          prev();
        }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [step, size, items, next, prev, sendWhatsApp]);

  const progress = step / (totalSteps - 1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        #charola-builder .tb-container {
          position: relative;
          font-family: 'Inter', sans-serif;
          color: ${C.text};
          background: ${C.bg};
          overflow-x: hidden;
        }
        
        #charola-builder .tb-slide {
          min-height: 100vh;
          display: flex !important;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 100%;
        }

        #charola-builder .tb-slide-center {
          justify-content: flex-start !important;
          padding: 240px 24px 120px;
        }
        
        #charola-builder .tb-slide-center > div {
          margin-top: auto;
          margin-bottom: auto;
        }

        #charola-builder .tb-slide-top {
          justify-content: flex-start !important;
          padding: 240px 24px 120px;
        }

        #charola-builder .tb-intro-slide {
          justify-content: flex-start !important;
          padding-top: 180px !important;
        }
        #charola-builder .tb-intro-slide > div {
          margin-top: auto;
          margin-bottom: auto;
        }

        #charola-builder .tb-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          padding-bottom: 100px;
        }

        #charola-builder .tb-nav-container {
          position: fixed;
          bottom: 100px;
          right: 24px;
          z-index: 9000;
          display: flex !important;
          align-items: center;
          gap: 10px;
        }

        #charola-builder .tb-h1 { font-size: clamp(2.4rem, 8vw, 4rem); font-weight: 900; color: ${C.blue}; line-height: 1.05; letter-spacing: -2px; margin-bottom: 24px; }
        #charola-builder .tb-h2 { font-size: clamp(2rem, 7vw, 3rem); font-weight: 900; color: ${C.blue}; line-height: 1.1; margin-bottom: 12px; letter-spacing: -1px; }

        #charola-builder .tb-textarea {
          border: none !important;
          border-bottom: 2px solid ${C.border} !important;
          background: transparent !important;
          border-radius: 0 !important;
          padding: 12px 0 !important;
        }
        #charola-builder .tb-textarea:focus {
          border-bottom-color: ${C.blue} !important;
        }

        #charola-builder .tb-hint {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 700;
          color: ${C.mutedLight};
        }
        #charola-builder .tb-hint kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 5px;
          border-radius: 6px;
          border: 1px solid ${C.border};
          background: ${C.white};
          font-family: inherit;
          font-size: 0.72rem;
          font-weight: 800;
          color: ${C.muted};
        }

        @media (max-width: 768px) {
          #charola-builder .tb-hint { display: none !important; }
          #charola-builder .tb-slide-center {
            padding: 140px 16px 140px !important;
          }
          #charola-builder .tb-slide-top {
            padding: 140px 16px 140px !important;
          }
          #charola-builder .tb-intro-slide {
            min-height: 0 !important;
            padding-top: 32px !important;
          }
          #charola-builder .tb-intro-slide > div {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          #charola-builder .tb-nav-container {
            bottom: 24px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.9);
            padding: 8px 12px;
            border-radius: 40px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
          }
          #charola-builder .tb-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          #charola-builder .tb-btn {
            width: 100%;
            justify-content: center !important;
          }
        }
      `}} />

      <div className="tb-container">
        {/* ── Fixed progress bar ── */}
        {step > 0 && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 5, background: C.border, zIndex: 9000 }}>
            <div style={{ height: "100%", background: C.red, transition: "width .4s ease", width: `${progress * 100}%` }} />
          </div>
        )}

        {/* ── Fixed step counter + nav ── */}
        {step > 0 && step < totalSteps - 1 && (
          <div className="tb-nav-container">
            <span className="tb-hint">
              Presiona <kbd>↵</kbd> o <kbd>↓</kbd>
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.mutedLight, marginRight: 4 }}>
              {step} / {totalSteps - 2}
            </span>
            <button onClick={prev} style={navBtnStyle} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={next} style={{ ...navBtnStyle, background: C.blue, color: C.white, borderColor: C.blue }} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {step === 0 && <IntroSlide onStart={next} />}
            {step === 1 && <SizeSlide size={size} setSize={setSize} onNext={next} trayCount={trayCount} updateTrayCount={updateTrayCount} />}
            {step === 2 && <IngredientSlide title="¿Qué quesos quieres?" subtitle="Selecciona todos los que necesites." items={cheeses} selected={items} toggle={toggleItem} />}
            {step === 3 && <IngredientSlide title="¿Carnes frías?" subtitle="Elige tus favoritas." items={meats} selected={items} toggle={toggleItem} />}
            {step === 4 && <IngredientSlide title="Acompañamientos" subtitle="Todo lo que complementa tu tabla." items={extras} selected={items} toggle={toggleItem} />}
            {step === 5 && <NotesSlide notes={notes} setNotes={setNotes} onNext={next} />}
            {step === 6 && (
              <ReviewSlide
                size={size}
                items={items}
                notes={notes}
                trayCount={trayCount}
                updateTrayCount={updateTrayCount}
                updateQty={updateQty}
                removeItem={removeItem}
                onSend={sendWhatsApp}
                onBack={prev}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: "50%",
  border: `2px solid ${C.border}`,
  background: C.white,
  color: C.blue,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all .2s ease",
};

/* ═══════════════════════════════════════════════════════════
   SLIDE 0 — INTRO
   ═══════════════════════════════════════════════════════════ */
function IntroSlide({ onStart }: { onStart: () => void }) {
  return (
    <div className="tb-slide tb-slide-center tb-intro-slide" style={{ background: C.white }}>
      <div style={{ maxWidth: 640, textAlign: "center", width: "100%" }}>
        <div style={{ width: 60, height: 4, background: C.red, borderRadius: 2, margin: "0 auto 30px" }} />
        <h1 className="tb-h1">
          Arma tu<br />Charola
        </h1>
        <p style={{ fontSize: "clamp(1rem, 4vw, 1.15rem)", color: C.muted, lineHeight: 1.6, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
          Elige los quesos, carnes frías y acompañamientos que más te gusten. Nosotros nos encargamos del resto.
        </p>
        <button
          className="tb-btn"
          onClick={onStart}
          style={{
            background: C.red,
            color: C.white,
            border: "none",
            padding: "18px 48px",
            borderRadius: 14,
            fontWeight: 900,
            fontSize: "1rem",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 12px 30px rgba(168,18,0,.2)",
            display: "inline-flex",
          }}
        >
          Comenzar
        </button>
        <p style={{ marginTop: 16, fontSize: "0.8rem", fontWeight: 700, color: C.red, letterSpacing: 0.5 }}>
          Pedido mínimo: {MIN_TRAYS} charolas
        </p>
        <p className="tb-hint" style={{ marginTop: 10, justifyContent: "center", width: "100%" }}>
          Presiona <kbd>↵</kbd> para comenzar
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 1 — SIZE
   ═══════════════════════════════════════════════════════════ */
const sizes: { id: BoardSize; label: string; pax: string; letter: string }[] = [
  { id: "pequeña", label: "Pequeña", pax: "2 – 4 personas", letter: "A" },
  { id: "mediana", label: "Mediana", pax: "5 – 8 personas", letter: "B" },
  { id: "grande", label: "Grande", pax: "9 – 15 personas", letter: "C" },
  { id: "jumbo", label: "Jumbo", pax: "16 – 25 personas", letter: "D" },
];

function SizeSlide({
  size,
  setSize,
  onNext,
  trayCount,
  updateTrayCount,
}: {
  size: BoardSize;
  setSize: (s: BoardSize) => void;
  onNext: () => void;
  trayCount: number;
  updateTrayCount: (delta: number) => void;
}) {
  return (
    <div className="tb-slide tb-slide-center">
      <div style={{ maxWidth: 600, width: "100%" }}>
        <p style={{ color: C.red, fontWeight: 800, fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Paso 1
        </p>
        <h2 className="tb-h2">
          ¿Para cuántas personas?
        </h2>
        <p style={{ color: C.muted, fontSize: "1.05rem", marginBottom: 12 }}>
          Selecciona el tamaño de tu tabla.
        </p>
        <p className="tb-hint" style={{ marginBottom: 20 }}>
          Presiona <kbd>1</kbd>–<kbd>4</kbd> para elegir
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sizes.map((s) => {
            const sel = size === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSize(s.id); setTimeout(onNext, 250); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 16,
                  border: `2px solid ${sel ? C.blue : C.border}`,
                  background: sel ? C.blue : C.white,
                  cursor: "pointer",
                  transition: "all .2s ease",
                  textAlign: "left",
                  boxShadow: sel ? "0 8px 25px rgba(10,34,64,.2)" : "0 2px 8px rgba(0,0,0,.04)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: `2px solid ${sel ? "rgba(255,255,255,.3)" : C.border}`,
                    background: sel ? "rgba(255,255,255,.15)" : C.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                    color: sel ? C.white : C.muted,
                    flexShrink: 0,
                  }}
                >
                  {s.letter}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: sel ? C.white : C.text, marginBottom: 2 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: sel ? "rgba(255,255,255,.6)" : C.muted, fontWeight: 500 }}>
                    {s.pax}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 24, padding: "16px 20px", background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: C.text }}>Número de charolas</div>
            <div style={{ fontSize: "0.78rem", color: C.red, fontWeight: 700, marginTop: 2 }}>Pedido mínimo: {MIN_TRAYS} charolas</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", flexShrink: 0 }}>
            <button onClick={() => updateTrayCount(-1)} style={qtyBtnStyle} aria-label="Menos charolas">−</button>
            <span style={{ minWidth: 40, textAlign: "center", fontWeight: 900, fontSize: "0.95rem", color: C.red, padding: "6px 4px" }}>
              {trayCount}
            </span>
            <button onClick={() => updateTrayCount(1)} style={qtyBtnStyle} aria-label="Más charolas">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 2,3,4 — INGREDIENT SELECTOR
   ═══════════════════════════════════════════════════════════ */
function IngredientSlide({
  title,
  subtitle,
  items,
  selected,
  toggle,
}: {
  title: string;
  subtitle: string;
  items: Ingredient[];
  selected: SelectedItem[];
  toggle: (i: Ingredient) => void;
}) {
  const count = selected.filter((s) => items.some((i) => i.id === s.id)).length;

  return (
    <div className="tb-slide tb-slide-top">
      <div style={{ maxWidth: 720, width: "100%" }}>
        <p style={{ color: C.red, fontWeight: 800, fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          {count > 0 ? `${count} seleccionados` : "Selecciona"}
        </p>
        <h2 className="tb-h2">{title}</h2>
        <p style={{ color: C.muted, fontSize: "1.05rem", marginBottom: 8 }}>{subtitle}</p>
        <p className="tb-hint" style={{ marginBottom: 20 }}>
          Presiona <kbd>↵</kbd> o <kbd>↓</kbd> para continuar
        </p>

        <div className="tb-grid">
          {items.map((item) => {
            const isSel = selected.some((s) => s.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "16px 8px",
                  border: "none",
                  borderBottom: `2px solid ${isSel ? C.blue : C.borderLight}`,
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "border-color .15s ease",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: isSel ? C.blue : C.text, lineHeight: 1.25 }}>
                    {item.name}
                  </div>
                  {item.origin && (
                    <div style={{ fontSize: "0.75rem", color: C.mutedLight, fontWeight: 600, marginTop: 2 }}>
                      {item.origin}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: isSel ? C.blue : "transparent",
                    flexShrink: 0,
                    opacity: isSel ? 1 : 0,
                    transform: isSel ? "scale(1)" : "scale(0.5)",
                    transition: "opacity .15s ease, transform .15s ease, background .15s ease",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 5 — NOTES
   ═══════════════════════════════════════════════════════════ */
function NotesSlide({ notes, setNotes, onNext }: { notes: string; setNotes: (n: string) => void; onNext: () => void }) {
  return (
    <div className="tb-slide tb-slide-center">
      <div style={{ maxWidth: 600, width: "100%" }}>
        <p style={{ color: C.red, fontWeight: 800, fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Opcional
        </p>
        <h2 className="tb-h2">¿Algo más que debamos saber?</h2>
        <p style={{ color: C.muted, fontSize: "1.05rem", marginBottom: 24 }}>
          Decoración especial, alergias, fecha del evento, o cualquier detalle.
        </p>

        <textarea
          className="tb-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escribe aquí tus notas..."
          rows={3}
          autoFocus
          style={{
            width: "100%",
            fontSize: "1.3rem",
            fontFamily: "'Inter', sans-serif",
            color: C.text,
            resize: "vertical",
            outline: "none",
            lineHeight: 1.5,
          }}
        />
        <p className="tb-hint" style={{ marginTop: 10 }}>
          Presiona <kbd>↵</kbd> para continuar · <kbd>⇧</kbd>+<kbd>↵</kbd> para salto de línea
        </p>

        <button
          className="tb-btn"
          onClick={onNext}
          style={{
            marginTop: 20,
            background: C.blue,
            color: C.white,
            border: "none",
            padding: "16px 32px",
            borderRadius: 14,
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Revisar mi charola
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 6 — REVIEW + SEND
   ═══════════════════════════════════════════════════════════ */
function ReviewSlide({
  size,
  items,
  notes,
  trayCount,
  updateTrayCount,
  updateQty,
  removeItem,
  onSend,
  onBack,
}: {
  size: BoardSize;
  items: SelectedItem[];
  notes: string;
  trayCount: number;
  updateTrayCount: (delta: number) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  onSend: () => void;
  onBack: () => void;
}) {
  const groups: { label: string; cat: "cheese" | "meat" | "extra" }[] = [
    { label: "Quesos", cat: "cheese" },
    { label: "Carnes Frías", cat: "meat" },
    { label: "Acompañamientos", cat: "extra" },
  ];

  return (
    <div className="tb-slide tb-slide-top">
      <div style={{ maxWidth: 640, width: "100%" }}>
        <p style={{ color: C.red, fontWeight: 800, fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Resumen
        </p>
        <h2 className="tb-h2">Tu charola</h2>
        <p style={{ color: C.muted, fontSize: "1.05rem", marginBottom: 24 }}>
          Revisa todo y ajusta las cantidades antes de enviar.
        </p>

        {/* Size */}
        <div style={{ padding: "16px 20px", background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, color: C.muted, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Tamaño</span>
          <span style={{ fontWeight: 900, color: C.blue, fontSize: "1rem", textTransform: "capitalize" }}>{size || "—"}</span>
        </div>

        {/* Tray count */}
        <div style={{ padding: "16px 20px", background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <span style={{ fontWeight: 700, color: C.muted, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, display: "block" }}>Charolas</span>
            <span style={{ fontSize: "0.72rem", color: C.red, fontWeight: 700 }}>Pedido mínimo: {MIN_TRAYS}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", flexShrink: 0 }}>
            <button onClick={() => updateTrayCount(-1)} style={qtyBtnStyle} aria-label="Menos charolas">−</button>
            <span style={{ minWidth: 40, textAlign: "center", fontWeight: 900, fontSize: "0.95rem", color: C.red, padding: "6px 4px" }}>
              {trayCount}
            </span>
            <button onClick={() => updateTrayCount(1)} style={qtyBtnStyle} aria-label="Más charolas">+</button>
          </div>
        </div>

        {/* Groups */}
        {groups.map((g) => {
          const groupItems = items.filter((i) => i.category === g.cat);
          if (groupItems.length === 0) return null;
          return (
            <div key={g.cat} style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: C.mutedLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
                {g.label}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: C.white,
                      borderRadius: 12,
                      border: `1px solid ${C.borderLight}`,
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{item.name}</span>

                    {/* Qty controls (por charola) */}
                    <div style={{ display: "flex", alignItems: "center", gap: 0, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                      <button onClick={() => updateQty(item.id, -1)} style={qtyBtnStyle}>−</button>
                      <div style={{ minWidth: 76, textAlign: "center", padding: "4px 4px" }}>
                        <div style={{ fontWeight: 900, fontSize: "0.78rem", color: C.red, lineHeight: 1.15 }}>
                          {item.quantity * trayCount}{item.unit}
                        </div>
                        <div style={{ fontSize: "0.58rem", color: C.mutedLight, fontWeight: 700, lineHeight: 1 }}>
                          {item.quantity}{item.unit}/charola
                        </div>
                      </div>
                      <button onClick={() => updateQty(item.id, 1)} style={qtyBtnStyle}>+</button>
                    </div>

                    <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: 18, padding: 4, lineHeight: 1 }} title="Quitar">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Notes */}
        {notes.trim() && (
          <div style={{ padding: "14px 20px", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A", marginBottom: 20 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: 1 }}>Notas</span>
            <p style={{ color: "#78350F", fontSize: "0.9rem", marginTop: 4, lineHeight: 1.5 }}>{notes}</p>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.mutedLight }}>
            <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>Tu charola está vacía</p>
            <button onClick={onBack} style={{ background: "none", border: `2px solid ${C.border}`, padding: "10px 24px", borderRadius: 10, fontWeight: 700, color: C.blue, cursor: "pointer" }}>
              Regresar a seleccionar
            </button>
          </div>
        )}

        {/* Action buttons */}
        {items.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 12, paddingBottom: 80, flexWrap: "wrap" }}>
            <button className="tb-btn" onClick={onBack} style={{ flex: "0 0 auto", background: "none", border: `2px solid ${C.border}`, padding: "16px 24px", borderRadius: 14, fontWeight: 700, color: C.blue, cursor: "pointer", fontSize: "0.9rem", minWidth: 100, textAlign: "center" }}>
              Editar
            </button>
            <button
              className="tb-btn"
              onClick={onSend}
              style={{
                flex: 1,
                minWidth: 200,
                background: C.green,
                color: C.white,
                border: "none",
                padding: "16px 24px",
                borderRadius: 14,
                fontWeight: 900,
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(37,211,102,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <svg width="19" height="22" viewBox="0 0 448 512" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zM223.9 436.8c-31.9 0-63.1-8.5-90.6-24.6l-6.5-3.9-67.3 17.6 18-65.6-4.2-6.7C56.2 325.3 46 295 46 262.1c0-98.1 79.9-178 178.1-178 47.6 0 92.2 18.5 125.8 52.2 33.6 33.6 52.1 78.2 52.1 125.8-.1 98.2-79.9 178.1-178.1 178.1zM311.9 256.2c-4.8-2.4-28.5-14.1-32.9-15.7-4.4-1.6-7.6-2.4-10.8 2.4-3.2 4.8-12.4 15.7-15.3 18.9-2.8 3.2-5.6 3.6-10.4 1.2-4.8-2.4-20.3-7.5-38.7-24.1-14.3-12.9-24-28.8-26.8-33.6-2.8-4.8-.3-7.4 2.1-9.8 2.2-2.2 4.8-5.6 7.2-8.4 2.4-2.8 3.2-4.8 4.8-8 1.6-3.2.8-6-.4-8.4-1.2-2.4-10.8-26.1-14.8-35.7-4-9.3-8-8-10.8-8.1-2.8-.1-6-.1-9.2-.1-3.2 0-8.4 1.2-12.8 6-4.4 4.8-16.8 16.4-16.8 40.1 0 23.7 17.2 46.5 19.6 49.7 2.4 3.2 34 51.9 82.3 72.7 11.5 4.9 20.5 7.9 27.5 10.1 11.5 3.7 22 3.1 30.3 1.9 9.3-1.3 28.5-11.6 32.5-22.8 4-11.2 4-20.8 2.8-22.8-1.2-2.4-4.4-3.6-9.2-6z"/>
              </svg>
              Enviar por WhatsApp
            </button>
            <p className="tb-hint" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              Presiona <kbd>↵</kbd> para enviar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: C.white,
  border: "none",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: 16,
  color: C.blue,
};
