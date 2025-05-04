"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt, FaTimes, FaUserCircle } from "react-icons/fa";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const avatarUrl = useMemo(() => {
    if (!user) return "";
    return user.avatar_url || user.avatar || "";
  }, [user]);

  useEffect(() => {
    if (avatarUrl && typeof window !== "undefined") {
      const img = new window.Image();
      img.src = avatarUrl;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
    } else {
      setImageError(true);
    }

    return () => {
      setImageLoaded(false);
      setImageError(false);
    };
  }, [avatarUrl]);

  const handleNavigate = (path) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

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

      {user && (
        <div className="mobile-user-profile">
          <div className="mobile-user-avatar">
            {avatarUrl && !imageError ? (
              <Image
                src={avatarUrl}
                alt={user?.nombre || "Usuario"}
                width={60}
                height={60}
                className={`avatar-image ${!imageLoaded ? "loading" : ""}`}
                priority
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="mobile-user-info">
            <p className="mobile-username">{user?.nombre || "Usuario"}</p>
            <p className="mobile-user-role">
              {user?.role === "organizador" ? "Organizador" : "Participante"}
            </p>
          </div>
        </div>
      )}

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
                prefetch={true}
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
            <Link href="/auth/login" onClick={onClose} prefetch={true}>
              <Button className="mobile-login-button" block>
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register" onClick={onClose} prefetch={true}>
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
