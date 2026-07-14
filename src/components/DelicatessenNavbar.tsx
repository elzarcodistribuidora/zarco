
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DelicatessenNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);
  const [user, setUser] = useState<{ picture?: string; name?: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const u = localStorage.getItem("zarcoUser");
      if (u) setUser(JSON.parse(u));
    } catch (e) {}
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;
    
    const onScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setScrolled(currentScrollY > 80);
      
      // nav-hidden logic identical to Webflow's setupScrollAndMenu
      if (currentScrollY > 250 && currentScrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = Math.max(0, currentScrollY);
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Sobrescribir colores para la sección Delicatessen */
        #deli-navbar .nav-top { background-color: #343a40 !important; }
        #deli-navbar .nav-bottom { background-color: #A81200 !important; }
        #deli-navbar .dropdown-menu { background-color: rgba(52, 58, 64, 0.95) !important; }
        
        /* Mobile Drawer en Gris */
        #deli-mobile-drawer { background-color: rgba(52, 58, 64, 0.98) !important; }
        #deli-mobile-drawer .mobile-dropdown-menu { background-color: rgba(33, 37, 41, 0.95) !important; border-radius: 8px; margin: 0 15px; }
        
        /* Bypass the broken global .desktop-only class from delicatessen.css */
        @media (max-width: 1024px) {
          #deli-navbar .deli-desktop-only { display: none !important; }
          #deli-navbar .deli-mobile-only { display: flex !important; }
          #deli-navbar .nav-logo-mobile.deli-mobile-only { display: block !important; }
        }
        @media (min-width: 1025px) {
          #deli-navbar .deli-mobile-only { display: none !important; }
        }
      `}} />

      <nav className={`navbar ${scrolled ? "scrolled" : ""} ${hidden ? "nav-hidden" : ""}`} id="deli-navbar">
        <div className="nav-top">
          <div className="nav-container top-container">
            <div className="nav-left deli-desktop-only">
              <Link href="/" className="nav-logo">
                <img src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp" alt="Logo El Zarco" />
              </Link>
            </div>
            <div className="nav-center">
              <img src="/assets/69a9afaad2c75d4f8e8e79ec_GIF-EL-ZARCO-1.webp" alt="Promo El Zarco" className="nav-gif" />
            </div>
            <div className="nav-right deli-desktop-only">
              <div className="user-menu-wrapper">
                <button className="user-trigger auth-trigger" id="desktopUserBtn" title="Mi Cuenta">
                  {!user?.picture ? (
                    <svg className="default-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  ) : (
                    <>
                      <img src={user.picture} alt="Perfil" className="nav-avatar-img" referrerPolicy="no-referrer" style={{ display: "block" }} />
                      <span className="online-dot" style={{ display: "block" }}></span>
                    </>
                  )}
                </button>
                {/* Popover es manejado por el script global de Auth si es necesario, 
                    o simplemente confía en la clase global .auth-trigger */}
              </div>
              <button className="btn-primary" onClick={() => router.push('/contacto')}>COTIZAR</button>
            </div>
          </div>
        </div>
        <div className="nav-bottom">
          <div className="nav-container bottom-container">
            <Link href="/" className="nav-logo-mobile deli-mobile-only">
              <img src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp" alt="Logo El Zarco Móvil" />
            </Link>
            
            <ul className="nav-menu deli-desktop-only">
              <li><Link href="/" className="nav-link">INICIO</Link></li>
              <li className="has-dropdown">
                <span className="nav-link" style={{cursor: "pointer"}}>PRODUCTOS <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                <ul className="dropdown-menu">
                  <li><Link href="/cremeria" className="dropdown-link">Cremería</Link></li>
                  <li><Link href="/embutidos" className="dropdown-link">Embutidos</Link></li>
                  <li><Link href="/abarrotes-basicos" className="dropdown-link">Abarrotes</Link></li>
                  <li><Link href="/delicatessen" className="dropdown-link" style={{ color: "#fff", fontWeight: 900 }}>Delicatessen</Link></li>
                  <li><Link href="/catalogo" className="dropdown-link">Catálogo Completo</Link></li>
                </ul>
              </li>
              <li><Link href="/nosotros" className="nav-link">SOBRE NOSOTROS</Link></li>
              <li><Link href="/guias-de-negocio" className="nav-link">GUÍAS DE NEGOCIO</Link></li>
              <li><Link href="/contacto" className="nav-link">CONTÁCTANOS</Link></li>
            </ul>
            
            <button className={`hamburger deli-mobile-only ${drawerOpen ? "active" : ""}`} aria-label="Abrir menú" onClick={toggleDrawer}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`drawer-overlay ${drawerOpen ? "active" : ""}`} onClick={closeDrawer}></div>
      <div className={`mobile-drawer ${drawerOpen ? "active" : ""}`} id="deli-mobile-drawer" data-lenis-prevent="true">
        <div className="drawer-header">
          <img src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp" alt="Logo El Zarco" />
        </div>
        <div className="drawer-auth-module">
          {!user ? (
            <div className="drawer-unauth" style={{ display: "block" }}>
              <p>Acceso a Socios Comerciales</p>
              <button className="btn-outline-white auth-trigger" onClick={closeDrawer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 
                Iniciar Sesión
              </button>
            </div>
          ) : (
            <div className="drawer-auth active">
              <div className="drawer-user-info">
                <div className="drawer-avatar-wrapper">
                  <img src={user.picture} alt="Avatar" />
                  <span className="online-dot" style={{display: "block"}}></span>
                </div>
                <div className="drawer-user-text">
                  <span className="drawer-name">{user.name}</span>
                  <span className="drawer-email">{user.email}</span>
                </div>
              </div>
              <div className="drawer-user-actions">
                <Link href="/perfil" className="btn-drawer-portal" onClick={closeDrawer}>Ir a mi Portal B2B</Link>
                <button className="btn-drawer-logout global-logout-btn" onClick={closeDrawer}>Cerrar Sesión Corporativa</button>
              </div>
            </div>
          )}
        </div>
        <ul className="mobile-menu">
          <li style={{ "--delay": "0.1s" } as any}><Link href="/" className="mobile-link" onClick={closeDrawer}>INICIO</Link></li>
          <li style={{ "--delay": "0.15s" } as any} className="mobile-has-dropdown">
            <div className="mobile-dropdown-toggle" onClick={() => setMobileProdOpen(!mobileProdOpen)}>
              PRODUCTOS 
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: mobileProdOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <ul className={`mobile-dropdown-menu ${mobileProdOpen ? "open" : ""}`} style={{ maxHeight: mobileProdOpen ? "500px" : "0px" }}>
              <li><Link href="/cremeria" className="mobile-dropdown-link" onClick={closeDrawer}>Cremería</Link></li>
              <li><Link href="/embutidos" className="mobile-dropdown-link" onClick={closeDrawer}>Embutidos</Link></li>
              <li><Link href="/abarrotes-basicos" className="mobile-dropdown-link" onClick={closeDrawer}>Abarrotes Básicos</Link></li>
              <li><Link href="/delicatessen" className="mobile-dropdown-link" onClick={closeDrawer}>Delicatessen</Link></li>
              <li><Link href="/catalogo" className="mobile-dropdown-link" onClick={closeDrawer}>Catálogo Completo</Link></li>
            </ul>
          </li>
          <li style={{ "--delay": "0.2s" } as any}><Link href="/nosotros" className="mobile-link" onClick={closeDrawer}>SOBRE NOSOTROS</Link></li>
          <li style={{ "--delay": "0.25s" } as any}><Link href="/guias-de-negocio" className="mobile-link" onClick={closeDrawer}>GUÍAS DE NEGOCIO</Link></li>
          <li style={{ "--delay": "0.3s" } as any}><Link href="/contacto" className="mobile-link" onClick={closeDrawer}>CONTÁCTANOS</Link></li>
        </ul>
        <div className="mobile-cta" style={{ "--delay": "0.4s" } as any}>
          <button className="btn-primary" onClick={() => { closeDrawer(); router.push('/contacto'); }}>COTIZAR AHORA</button>
        </div>
      </div>
    </>
  );
}
