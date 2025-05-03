"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  FaUsers,
  FaCalendarAlt,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa";
import "./about.css";

const AboutPage = () => {
  const teamMembers = [
    { id: 1, name: "Arnau Gil", role: "Web Developer" },
    { id: 2, name: "Yago Alonso", role: "App Developer" },
    { id: 3, name: "Álex Vila", role: "App Developer" },
  ];

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

  return (
    <div className="about-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sobre Eventflix</h1>
          <p className="subtitle">
            Conectando personas a través de experiencias inolvidables
          </p>
        </div>
      </section>

      <section className="mission-section">
        <div className="content-wrapper">
          <h2>Nuestra Misión</h2>
          <p>
            En Eventflix, creemos en el poder de los eventos para unir a las
            personas, compartir conocimientos y crear momentos memorables.
            Nuestra misión es hacer que la búsqueda y reserva de eventos sea
            sencilla e intuitiva, permitiendo a los organizadores llegar a su
            público ideal y a los asistentes descubrir experiencias que
            enriquezcan sus vidas.
          </p>
        </div>
      </section>

      <section className="values-section">
        <div className="content-wrapper">
          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="icon-wrapper">
                <FaUsers />
              </div>
              <h3>Comunidad</h3>
              <p>
                Creamos espacios para conectar personas con intereses comunes
              </p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper">
                <FaCalendarAlt />
              </div>
              <h3>Accesibilidad</h3>
              <p>
                Hacemos que encontrar y participar en eventos sea fácil para
                todos
              </p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper">
                <FaLightbulb />
              </div>
              <h3>Innovación</h3>
              <p>
                Buscamos continuamente nuevas formas de mejorar la experiencia
                de eventos
              </p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper">
                <FaHandshake />
              </div>
              <h3>Confianza</h3>
              <p>
                Construimos relaciones basadas en la transparencia y la
                fiabilidad
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="content-wrapper">
          <h2>Nuestro Equipo</h2>
          <p className="team-intro">
            Somos un equipo diverso de profesionales apasionados por los eventos
            y la tecnología. Trabajamos cada día para mejorar la plataforma y
            ofrecer el mejor servicio a nuestros usuarios.
          </p>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member">
                <div className="member-avatar">
                  <Image
                    src={`/images/user-${member.id}.webp`}
                    alt={`${member.name} - ${member.role}`}
                    width={160}
                    height={160}
                    className="avatar-image"
                    loading={member.id === 1 ? "eager" : "lazy"}
                  />
                </div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="content-wrapper">
          <div className="history-content">
            <h2>Nuestra Historia</h2>
            <p>
              Eventflix nació en 2024 con la visión de transformar la forma en
              que las personas descubren y participan en eventos. Lo que comenzó
              como una idea entre amigos apasionados por la tecnología y los
              eventos, ha crecido hasta convertirse en una plataforma líder que
              conecta a miles de personas cada día.
            </p>
            <p>
              A lo largo de nuestra trayectoria, hemos trabajado incansablemente
              para mejorar nuestra plataforma, escuchando a nuestra comunidad y
              adaptándonos a sus necesidades. Estamos orgullosos de nuestro
              crecimiento y emocionados por el futuro.
            </p>
          </div>
          <div className="history-image">
            <Image
              src="/images/historia.jpg"
              alt="Eventflix historia"
              width={500}
              height={300}
              loading="lazy"
              className="history-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
