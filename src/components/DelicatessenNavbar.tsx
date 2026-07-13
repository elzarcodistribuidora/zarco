"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DelicatessenNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);
  const [user, setUser] = useState<{ picture?: string; name?: string; email?: string } | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("zarcoUser");
      if (u) setUser(JSON.parse(u));
    } catch (e) {}
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Hide if scrolling down, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ═══════════════════════════════════════════
           DELI NAVBAR — Scoped + !important to beat
           webflow CSS that loads after this component
           ═══════════════════════════════════════════ */
        .deli-navbar {
          position: fixed !important;
          top: 0 !important;
          width: 100% !important;
          z-index: 2000 !important;
          box-shadow: 0 4px 20px rgba(0,0,0,.15) !important;
          font-family: 'Inter', sans-serif !important;
        }

        /* ── TOP (Gris Oxford) ── */
        .deli-nav-top {
          background: #343a40 !important;
          padding: 20px 0 !important;
          transition: padding 0.3s ease !important;
        }
        .deli-navbar.scrolled .deli-nav-top { padding: 10px 0 !important; }

        .deli-top-grid {
          display: grid !important;
          grid-template-columns: 1fr auto 1fr !important;
          align-items: center !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          width: 90% !important;
        }

        .deli-logo-img {
          height: 100px !important;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,.3)) !important;
          transition: height 0.3s ease !important;
          display: block !important;
        }
        .deli-navbar.scrolled .deli-logo-img { height: 60px !important; }

        .deli-gif {
          height: 100px !important;
          object-fit: contain !important;
          border-radius: 8px !important;
          display: block !important;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,.2)) !important;
          transition: height 0.3s ease !important;
        }
        .deli-navbar.scrolled .deli-gif { height: 60px !important; }

        /* ── BOTTOM (Rojo Zarco) ── */
        .deli-nav-bottom {
          background: #A81200 !important;
          height: 45px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          position: relative !important;
        }
        .deli-bottom-inner {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          position: static !important;
        }

        /* ── MENU HORIZONTAL ── */
        ul.deli-menu {
          display: flex !important;
          flex-direction: row !important;
          list-style: none !important;
          gap: 4rem !important;
          margin: 0 auto !important;
          padding: 0 !important;
          align-items: center !important;
          position: static !important;
          background: none !important;
          height: auto !important;
          width: auto !important;
          max-height: none !important;
          overflow: visible !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        ul.deli-menu > li {
          position: static !important;
          display: list-item !important;
          opacity: 1 !important;
          transform: none !important;
          border: none !important;
          padding: 0 !important;
        }

        /* ── NAV LINKS ── */
        .deli-nav-link {
          color: rgba(255,255,255,.85) !important;
          text-decoration: none !important;
          font-weight: 700 !important;
          font-size: 0.8rem !important;
          letter-spacing: 2.5px !important;
          text-transform: uppercase !important;
          padding: 12px 0 !important;
          position: relative !important;
          transition: color 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          cursor: pointer !important;
          background: none !important;
          border: none !important;
        }
        .deli-nav-link:hover { color: #fff !important; }
        .deli-nav-link::after {
          content: '' !important;
          position: absolute !important;
          width: 0 !important;
          height: 3px !important;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: #fff !important;
          transition: width 0.3s ease !important;
          border-radius: 2px 2px 0 0 !important;
        }
        .deli-nav-link:hover::after { width: 100% !important; }
        .deli-nav-link svg {
          width: 14px !important;
          height: 14px !important;
          transition: transform 0.3s ease !important;
        }

        /* ── DROPDOWN ── */
        li.deli-has-dropdown { position: static !important; }
        li.deli-has-dropdown:hover .deli-dropdown {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }
        li.deli-has-dropdown:hover .deli-nav-link svg {
          transform: rotate(180deg) !important;
        }

        ul.deli-dropdown {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: 55px !important;
          background: rgba(52,58,64,.92) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          display: flex !important;
          flex-direction: row !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 4rem !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: translateY(-5px) !important;
          transition: all 0.3s cubic-bezier(.16,1,.3,1) !important;
          box-shadow: 0 10px 20px rgba(0,0,0,.15) !important;
          z-index: 1999 !important;
          border-top: 1px solid rgba(255,255,255,.08) !important;
          border-radius: 0 !important;
          max-height: none !important;
          overflow: visible !important;
        }
        ul.deli-dropdown > li {
          display: list-item !important;
          border: none !important;
          padding: 0 !important;
          opacity: 1 !important;
          transform: none !important;
        }
        a.deli-drop-link {
          display: inline-block !important;
          color: rgba(255,255,255,.85) !important;
          text-decoration: none !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          letter-spacing: 2px !important;
          padding: 12px 0 !important;
          position: relative !important;
          transition: color 0.3s ease !important;
        }
        a.deli-drop-link:hover { color: #fff !important; }
        a.deli-drop-link::after {
          content: '' !important;
          position: absolute !important;
          width: 0 !important;
          height: 2px !important;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: #A81200 !important;
          transition: width 0.3s ease !important;
        }
        a.deli-drop-link:hover::after { width: 100% !important; }

        /* ── USER BTN + CTA ── */
        .deli-user-btn {
          background: transparent !important;
          border: 1.5px solid rgba(255,255,255,.3) !important;
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          padding: 0 !important;
        }
        .deli-user-btn:hover { border-color: #fff !important; background: rgba(255,255,255,.1) !important; }
        .deli-user-btn svg { width: 20px !important; height: 20px !important; color: #fff !important; }

        a.deli-cta {
          background: #A81200 !important;
          color: #fff !important;
          border: none !important;
          padding: 14px 32px !important;
          font-weight: 900 !important;
          font-size: 0.85rem !important;
          text-transform: uppercase !important;
          letter-spacing: 2px !important;
          border-radius: 6px !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        a.deli-cta:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 25px rgba(168,18,0,.4) !important; }

        /* ── MOBILE / DESKTOP VISIBILITY ── */
        .deli-desktop { display: block !important; }
        .deli-desktop-flex { display: flex !important; }
        .deli-mobile { display: none !important; }

        /* ── MOBILE DRAWER ── */
        .deli-hamburger {
          cursor: pointer; border: none; background: transparent;
          display: flex; flex-direction: column; gap: 6px; z-index: 2002; padding: 5px;
        }
        .deli-hamburger .hbar { width: 26px; height: 3px; background: #fff; border-radius: 2px; transition: all 0.3s ease; }
        .deli-hamburger.active .hbar:nth-child(1) { transform: translateY(9px) rotate(45deg); }
        .deli-hamburger.active .hbar:nth-child(2) { opacity: 0; }
        .deli-hamburger.active .hbar:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

        .deli-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); opacity: 0; visibility: hidden; z-index: 1999; transition: all .3s ease; backdrop-filter: blur(3px); }
        .deli-overlay.active { opacity: 1; visibility: visible; }
        .deli-drawer { position: fixed; top: 0; right: -100%; width: 85%; max-width: 380px; height: 100vh; background: rgba(52,58,64,.97); backdrop-filter: blur(15px); box-shadow: -10px 0 30px rgba(0,0,0,.4); z-index: 2001; display: flex; flex-direction: column; padding: 70px 30px 40px; transition: right .4s ease; overflow-y: auto; font-family: 'Inter', sans-serif; }
        .deli-drawer.active { right: 0; }
        .deli-drawer-link { display: flex; justify-content: space-between; align-items: center; width: 100%; color: #fff; text-decoration: none; font-weight: 700; font-size: 1.2rem; letter-spacing: 2px; padding: 15px 0; cursor: pointer; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,.05); background: none; border-left: none; border-right: none; border-top: none; }
        .deli-drawer-sub { list-style: none; padding: 0; margin: 0; max-height: 0; overflow: hidden; transition: max-height .4s ease; }
        .deli-drawer-sub.open { max-height: 300px; }
        .deli-drawer-sub a { display: block; padding: 12px 0 12px 20px; color: rgba(255,255,255,.7); text-decoration: none; font-size: 1rem; font-weight: 500; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .deli-desktop { display: none !important; }
          .deli-desktop-flex { display: none !important; }
          .deli-mobile { display: flex !important; }
          .deli-nav-top { padding: 12px 0 !important; }
          .deli-top-grid {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
          }
          .deli-logo-img { height: 65px !important; margin: 0 auto !important; }
          .deli-gif { height: 50px !important; margin: 0 auto !important; }
          .deli-nav-bottom { height: 60px !important; }
          .deli-bottom-inner { justify-content: space-between !important; padding: 0 5% !important; }
        }
      `}} />

      <nav className={`deli-navbar ${scrolled ? "scrolled" : ""}`} style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
      }}>
        {/* ── TOP BAR ── */}
        <div className="deli-nav-top">
          <div className="deli-top-grid">
            <div className="deli-desktop" style={{ justifySelf: "start" }}>
              <Link href="/"><img src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp" alt="Logo El Zarco" className="deli-logo-img" /></Link>
            </div>
            <div style={{ justifySelf: "center" }}>
              <img src="/assets/69a9afaad2c75d4f8e8e79ec_GIF-EL-ZARCO-1.webp" alt="Promo El Zarco" className="deli-gif" />
            </div>
            <div className="deli-desktop-flex" style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
              <div className="user-menu-wrapper" style={{ position: "relative" }}>
                <button className="deli-user-btn auth-trigger" id="desktopUserBtn" title="Mi Cuenta" style={{ position: "relative" }}>
                  {!user?.picture ? (
                    <svg className="default-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  ) : (
                    <img src={user.picture} alt="Perfil" className="nav-avatar-img" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                  )}
                  {user && <span className="online-dot" style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, background: '#4CAF50', border: '2px solid #343a40', borderRadius: '50%' }}></span>}
                </button>
              </div>
              <Link href="/contacto" className="deli-cta">COTIZAR</Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="deli-nav-bottom">
          <div className="deli-bottom-inner">
            <Link href="/" className="deli-mobile" style={{ textDecoration: "none" }}>
              <img src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp" alt="Logo" style={{ height: 45, display: "block" }} />
            </Link>

            <ul className="deli-menu deli-desktop">
              <li><Link href="/" className="deli-nav-link">INICIO</Link></li>
              <li className="deli-has-dropdown">
                <span className="deli-nav-link">
                  PRODUCTOS
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
                <ul className="deli-dropdown">
                  <li><Link href="/cremeria" className="deli-drop-link">Cremería</Link></li>
                  <li><Link href="/embutidos" className="deli-drop-link">Embutidos</Link></li>
                  <li><Link href="/abarrotes-basicos" className="deli-drop-link">Abarrotes</Link></li>
                  <li><Link href="/delicatessen" className="deli-drop-link" style={{ color: "#fff", fontWeight: 900 }}>Delicatessen</Link></li>
                  <li><Link href="/catalogo" className="deli-drop-link">Catálogo Completo</Link></li>
                </ul>
              </li>
              <li><Link href="/nosotros" className="deli-nav-link">SOBRE NOSOTROS</Link></li>
              <li><Link href="/guias-de-negocio" className="deli-nav-link">GUÍAS DE NEGOCIO</Link></li>
              <li><Link href="/contacto" className="deli-nav-link">CONTÁCTANOS</Link></li>
            </ul>

            <button className={`deli-hamburger deli-mobile ${drawerOpen ? "active" : ""}`} onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Menú">
              <span className="hbar" /><span className="hbar" /><span className="hbar" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`deli-overlay ${drawerOpen ? "active" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`deli-drawer ${drawerOpen ? "active" : ""}`}>
        <div style={{ marginBottom: 25 }}>
          <img src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp" alt="Logo" style={{ height: 50 }} />
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
          <li><Link href="/" className="deli-drawer-link" onClick={() => setDrawerOpen(false)}>INICIO</Link></li>
          <li>
            <button className="deli-drawer-link" onClick={() => setMobileProdOpen(!mobileProdOpen)}>
              PRODUCTOS
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, transition: "transform .3s", transform: mobileProdOpen ? "rotate(180deg)" : "none", color: "rgba(255,255,255,.5)" }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <ul className={`deli-drawer-sub ${mobileProdOpen ? "open" : ""}`}>
              <li><Link href="/cremeria" onClick={() => setDrawerOpen(false)}>Cremería</Link></li>
              <li><Link href="/embutidos" onClick={() => setDrawerOpen(false)}>Embutidos</Link></li>
              <li><Link href="/abarrotes-basicos" onClick={() => setDrawerOpen(false)}>Abarrotes Básicos</Link></li>
              <li><Link href="/delicatessen" onClick={() => setDrawerOpen(false)}>Delicatessen</Link></li>
              <li><Link href="/catalogo" onClick={() => setDrawerOpen(false)}>Catálogo Completo</Link></li>
            </ul>
          </li>
          <li><Link href="/nosotros" className="deli-drawer-link" onClick={() => setDrawerOpen(false)}>SOBRE NOSOTROS</Link></li>
          <li><Link href="/guias-de-negocio" className="deli-drawer-link" onClick={() => setDrawerOpen(false)}>GUÍAS DE NEGOCIO</Link></li>
          <li><Link href="/contacto" className="deli-drawer-link" onClick={() => setDrawerOpen(false)}>CONTÁCTANOS</Link></li>
        </ul>
        <div style={{ marginTop: 30 }}>
          <Link href="/contacto" className="deli-cta" style={{ width: "100%", padding: 18, fontSize: "1rem", justifyContent: "center" }} onClick={() => setDrawerOpen(false)}>COTIZAR AHORA</Link>
        </div>
      </div>
    </>
  );
}
