"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../ui/Logo/Logo";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Link from "next/link";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { logout } from "../../../utils/logout";
import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
} from "../../../utils/user";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      setUser(null);
      clearStoredUser();
      return;
    }
    fetch("http://localhost:8000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setUser(data.data);
          setStoredUser(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          <Logo size={120} />
        </div>
        {/* Buscador */}
        <div className="header-search">
          <div className="header-search-wrapper">
            <MagnifyingGlassIcon className="header-search-icon" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              className="header-search-input"
            />
          </div>
        </div>
        {/* Botones auth */}
        <div className="header-user">
          {!user ? (
            <>
              <Link href="/auth/login">
                <Button className="header-btn header-btn-login">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="header-btn header-btn-register">
                  Registrarse
                </Button>
              </Link>
            </>
          ) : (
            <div className="header-user-menu" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="header-user-avatar-btn"
                aria-label="Menú de usuario"
              >
                {user.foto_perfil ? (
                  <Image
                    src={user.foto_perfil}
                    alt="Perfil"
                    width={36}
                    height={36}
                    className="header-user-avatar-img"
                  />
                ) : (
                  <UserCircleIcon className="header-user-avatar-icon" />
                )}
              </button>
              {menuOpen && (
                <div className="header-dropdown">
                  <button
                    className="header-dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile");
                    }}
                  >
                    Perfil
                  </button>
                  <button
                    className="header-dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile/eventos");
                    }}
                  >
                    Mis eventos
                  </button>
                  <button
                    className="header-dropdown-item header-dropdown-logout"
                    onClick={() => {
                      setMenuOpen(false);
                      logout(router);
                      clearStoredUser();
                      setUser(null);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
