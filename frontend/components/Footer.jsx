import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <p>
          &copy; Eventclix
        </p>
      </div>
      
      <div className="footer__center">
        {/* Usar Link (react-router-dom) en lugar de <a> */}
        <Link to="/sobre-nosotros">Sobre nosotros</Link>
        <Link to="/ayuda">Ayuda</Link>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/cookies">Cookies</Link>
      </div>
      
      <div className="footer__right">
        <span className="footer__language">
          Español <span className="language-icon">▼</span>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
