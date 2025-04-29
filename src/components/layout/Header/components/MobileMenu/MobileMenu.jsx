"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaCalendarAlt, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Button from "../../../../ui/Button/Button";
import "./MobileMenu.css";

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  currentPath,
  user,
  onLogout,
}) => {
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="mobile-menu" ref={menuRef}>
      <div className="mobile-menu-header">
        <button
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <FaTimes className="mobile-menu-close-icon" />
        </button>
      </div>

      <nav className="mobile-nav">
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="mobile-nav-item">
              <Link
                href={item.path}
                className={
                  currentPath === item.path
                    ? "mobile-nav-link active"
                    : "mobile-nav-link"
                }
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mobile-auth">
        {user ? (
          <div className="mobile-user-actions">
            <button
              className="mobile-user-option"
              onClick={() => handleNavigate("/profile")}
            >
              <FaUser className="option-icon" />
              <span>Mi Perfil</span>
            </button>
            <button
              className="mobile-user-option"
              onClick={() => handleNavigate("/profile/eventos")}
            >
              <FaCalendarAlt className="option-icon" />
              <span>Mis Eventos</span>
            </button>
            <button
              className="mobile-user-option logout"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <FaSignOutAlt className="option-icon" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <div className="mobile-auth-buttons">
            <Link href="/auth/login" onClick={onClose}>
              <Button className="mobile-login-button" block>
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register" onClick={onClose}>
              <Button className="mobile-register-button" block>
                Registrarse
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MobileMenu);
