"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import Logo from "../../ui/Logo/Logo";
import Button from "../../ui/Button/Button";
import NavLinks from "./components/NavLinks/NavLinks";
import UserMenu from "./components/UserMenu/UserMenu";
import MobileMenu from "./components/MobileMenu/MobileMenu";
import { FaBars } from "react-icons/fa";

import { userService } from "../../../services/user.service";
import { authService } from "../../../services/auth.service";

import "./Header.css";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoSize, setLogoSize] = useState(120);

  const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Eventos", path: "/events" },
    { label: "Categorías", path: "/events/categories" },
    { label: "Sobre Nosotros", path: "/about" },
    { label: "Contacto", path: "/contact" },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = userService.getStoredUserInfo();
      setUser(storedUser);

      if (authService.isAuthenticated()) {
        try {
          const response = await userService.getProfile();
          const userData = response.data || response;
          setUser(userData);
          userService.storeUserInfo(userData);
        } catch (err) {
          console.error("Error al cargar perfil del usuario:", err);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setLogoSize(window.innerWidth >= 992 ? 150 : 120);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    }
  }, [router]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo size={logoSize} />
        </div>

        <NavLinks navItems={navItems} currentPath={pathname} />

        <div className="header-auth">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="auth-buttons">
              <Link href="/auth/login">
                <Button className="login-button">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="register-button">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <FaBars className="menu-icon" />
        </button>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={toggleMobileMenu}
        navItems={navItems}
        currentPath={pathname}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
