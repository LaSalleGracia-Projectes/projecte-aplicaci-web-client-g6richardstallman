"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import Logo from "../../ui/Logo/Logo";
import Button from "../../ui/Button/Button";
import Dropdown from "../../ui/Dropdown/Dropdown";

import { logout } from "../../../utils/logout";
import { getStoredUser } from "../../../utils/user";

import "./Header.css";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Eventos", path: "/events" },
    { label: "Categorías", path: "/events/categories" },
    { label: "Sobre Nosotros", path: "/about" },
    { label: "Contacto", path: "/contact" },
  ];

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);

    const token = localStorage.getItem("access_token");
    if (token) {
      fetch("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.data) {
            setUser(data.data);
          }
        })
        .catch((err) => console.error("Error fetching user profile:", err));
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(router);
    setUser(null);
  };

  const navigate = (path) => {
    router.push(path);
  };

  const userOptions = [
    {
      label: (
        <div className="dropdown-item">
          <UserIcon className="dropdown-icon" />
          <span>Mi Perfil</span>
        </div>
      ),
      value: "profile",
      onClick: () => navigate("/profile"),
    },
    {
      label: (
        <div className="dropdown-item">
          <ArrowRightOnRectangleIcon className="dropdown-icon" />
          <span>Cerrar Sesión</span>
        </div>
      ),
      value: "logout",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo size={150} />
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  href={item.path}
                  className={
                    pathname === item.path ? "nav-link active" : "nav-link"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-auth">
          {user ? (
            <div className="user-menu">
              <Dropdown
                trigger={
                  <div className="user-trigger icon-only">
                    {user.foto_perfil ? (
                      <Image
                        src={user.foto_perfil}
                        alt={user.nombre || "Usuario"}
                        width={40}
                        height={40}
                        className="user-avatar"
                      />
                    ) : (
                      <UserCircleIcon className="user-icon" />
                    )}
                  </div>
                }
                options={userOptions}
                className="user-dropdown"
                menuClassName="user-dropdown-menu"
              >
                {userOptions.map((option) => (
                  <button
                    key={option.value}
                    className="user-dropdown-item"
                    onClick={option.onClick}
                  >
                    {option.label}
                  </button>
                ))}
              </Dropdown>
            </div>
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="menu-icon" />
          ) : (
            <Bars3Icon className="menu-icon" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu" ref={mobileMenuRef}>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="mobile-nav-item">
                  <Link
                    href={item.path}
                    className={
                      pathname === item.path
                        ? "mobile-nav-link active"
                        : "mobile-nav-link"
                    }
                    onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <UserIcon className="option-icon" />
                  <span>Mi Perfil</span>
                </button>
                <button
                  className="mobile-user-option"
                  onClick={() => {
                    navigate("/profile/eventos");
                    setMobileMenuOpen(false);
                  }}
                >
                  <CalendarIcon className="option-icon" />
                  <span>Mis Eventos</span>
                </button>
                <button
                  className="mobile-user-option logout"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <ArrowRightOnRectangleIcon className="option-icon" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="mobile-login-button" block>
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="mobile-register-button" block>
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
