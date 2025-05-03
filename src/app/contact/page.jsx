"use client";

import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import "./contact.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sections = document.querySelectorAll("section");

      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      }, observerOptions);

      sections.forEach((section) => {
        observer.observe(section);
      });

      return () => {
        sections.forEach((section) => {
          observer.unobserve(section);
        });
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormStatus({
      submitted: true,
      error: false,
      message: "¡Gracias por tu mensaje! Te responderemos lo antes posible.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contacta con nosotros</h1>
          <p className="subtitle">
            Estamos aquí para ayudarte con cualquier pregunta o inquietud
          </p>
        </div>
      </section>

      <div className="contact-main">
        <section className="contact-info-section">
          <div className="contact-info-card">
            <h2>Información de contacto</h2>
            <p>
              Estamos disponibles para atenderte por diferentes medios. No dudes
              en ponerte en contacto con nosotros.
            </p>

            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h3>Dirección</h3>
                  <p>Calle Principal 123, Barcelona, España</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-content">
                  <h3>Teléfono</h3>
                  <p>+34 912 345 678</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>contacto@eventflix.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div className="info-content">
                  <h3>Horario de Atención</h3>
                  <p>Lun - Vie: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="contact-form-card">
            <h2>Envíanos un mensaje</h2>

            {formStatus.submitted ? (
              <div
                className={`form-message ${
                  formStatus.error ? "error" : "success"
                }`}
              >
                {formStatus.message}
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu.email@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Asunto de tu mensaje"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95780.65560368056!2d2.0701345970804325!3d41.39488200284047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49816718e30e5%3A0x44b0fb3d4f47660a!2sBarcelona%2C%20Espa%C3%B1a!5e0!3m2!1ses!2smx!4v1660000000000!5m2!1ses!2smx"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Eventflix"
          ></iframe>
        </div>
      </section>

      <section className="faq-section">
        <div className="content-wrapper">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Cómo puedo registrarme en Eventflix?</h3>
              <p>
                El registro en Eventflix es muy sencillo. Solo tienes que hacer
                clic en el botón "Registrarse" en la parte superior derecha de
                la página, completar el formulario con tus datos y confirmar tu
                correo electrónico.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Cómo puedo organizar un evento en Eventflix?</h3>
              <p>
                Para organizar un evento, primero debes registrarte como
                organizador. Una vez verificada tu cuenta, podrás acceder al
                panel de control para crear y gestionar tus eventos.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Eventflix cobra comisión por la venta de entradas?</h3>
              <p>
                Sí, cobramos una pequeña comisión por cada entrada vendida a
                través de nuestra plataforma. Esta comisión nos permite mantener
                y mejorar nuestros servicios.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Cómo puedo obtener un reembolso?</h3>
              <p>
                Las políticas de reembolso dependen de cada organizador. Te
                recomendamos revisar las condiciones específicas del evento
                antes de comprar tus entradas. Si necesitas ayuda, nuestro
                equipo de soporte estará encantado de asistirte.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
