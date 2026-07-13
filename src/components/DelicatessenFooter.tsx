"use client";

import React from "react";
import Link from "next/link";

export default function DelicatessenFooter() {
  return (
    <footer className="master-footer" style={{ background: "#343a40" }}>
      <div className="footer-container reveal">
        <div className="footer-col brand-col">
          <Link href="/" className="footer-logo">
            <img
              src="/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp"
              alt="Logo El Zarco Footer"
            />
          </Link>
          <div className="heritage-badge-footer">TRADICIÓN DESDE 1992</div>
          <p className="footer-tagline">
            Más de 30 años de curaduría operativa en la Central de Abasto,
            llevando infraestructura y volumen directo a tu negocio.
          </p>
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/profile.php?id=61574700037720"
              className="social-btn"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 320 512">
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/elzarcodistribuidora/"
              className="social-btn"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-nav-grid">
          <div className="footer-col link-col">
            <h3 className="footer-title">Sectores</h3>
            <ul className="footer-links">
              <li>
                <Link href="/restaurantes">Restaurantes</Link>
              </li>
              <li>
                <Link href="/tiendas">Tiendas</Link>
              </li>
              <li>
                <Link href="/cafeterias">Cafeterías</Link>
              </li>
              <li>
                <Link href="/delicatessen">Delicatessen</Link>
              </li>
              <li>
                <Link href="/catalogo">Catálogo Completo</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col link-col">
            <h3 className="footer-title">Categorías</h3>
            <ul className="footer-links">
              <li>
                <Link href="/cremeria">Lácteos y Cremería</Link>
              </li>
              <li>
                <Link href="/embutidos">Embutidos</Link>
              </li>
              <li>
                <Link href="/abarrotes-basicos">Abarrotes Básicos</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col link-col">
            <h3 className="footer-title">Nosotros</h3>
            <ul className="footer-links">
              <li>
                <Link href="/nosotros">Nuestra Historia</Link>
              </li>
              <li>
                <Link href="/guias-de-negocio">Guías de Negocio</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto y Ubicación</Link>
              </li>
              <li>
                <Link href="/perfil">Portal de Clientes</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-col contact-col">
          <h3 className="footer-title">La Matriz</h3>

          <div className="contact-item">
            <span>Ubicación Operativa</span>
            <p className="footer-address">
              Central de Abasto CDMX
              <br />
              Local 2-85, Letra F<br />
              Iztapalapa, CDMX
            </p>
          </div>

          <div className="contact-item">
            <span>Línea de Ventas</span>
            <a href="tel:+522298477440" className="contact-link">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              (55) 229-847-7440
            </a>
          </div>

          <div className="contact-item">
            <span>Atención a Clientes</span>
            <a href="mailto:elzarcomayoreo@gmail.com" className="contact-link">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              elzarcomayoreo@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="nav-container footer-bottom-container">
          <div className="footer-bottom-left">
            <p className="copyright">
              © 2026 El Zarco Distribuidores. Todos los derechos reservados.
            </p>
            <div className="legal-links desktop-only">
              <Link href="/terminos-del-servicio">Términos de Servicio</Link>
              <Link href="/aviso-de-privacidad">Aviso de Privacidad</Link>
            </div>
          </div>

          <a href="https://flouvia.com/" target="_blank" className="pwrby">
            Powered by <strong>FLOUVIA</strong>
          </a>

          <div></div>
        </div>
      </div>
    </footer>
  );
}
