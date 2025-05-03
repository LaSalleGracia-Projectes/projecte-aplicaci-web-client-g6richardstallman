import React from "react";
import Link from "next/link";
import {
  FiMail,
  FiTwitter,
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import Logo from "../../ui/Logo/Logo";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <Logo size={120} />
          </div>
          <p className="footer-description">
            Descubre, asiste y organiza los mejores eventos en un solo lugar. Tu
            plataforma completa para experiencias inolvidables.
          </p>
          <div className="footer-social">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FiTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FiFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FiInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FiLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Enlaces rápidos</h3>
          <ul className="footer-links">
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/events">Eventos</Link>
            </li>
            <li>
              <Link href="/about">Sobre nosotros</Link>
            </li>
            <li>
              <Link href="/contact">Contacto</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Legal</h3>
          <ul className="footer-links">
            <li>
              <Link href="/privacy">Política de privacidad</Link>
            </li>
            <li>
              <Link href="/terms">Términos y condiciones</Link>
            </li>
            <li>
              <Link href="/cookies">Política de cookies</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <div className="contact-info">
            <p>
              <FiMapPin className="contact-icon" /> Barcelona, España
            </p>
            <p>
              <FiPhone className="contact-icon" /> +34 612 345 678
            </p>
            <p>
              <FiMail className="contact-icon" /> info@eventflix.com
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">
            &copy; {currentYear} EventFlix. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
