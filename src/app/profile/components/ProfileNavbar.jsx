"use client";

import React, { useCallback, memo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../../components/ui/Logo/Logo";
import Button from "../../../components/ui/Button/Button";
import { logout } from "../../../utils/logout";
import {
  UserIcon,
  PencilSquareIcon,
  KeyIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import "./ProfileNavbar.css";

const navOptions = [
  {
    label: "Mi perfil",
    href: "/profile",
    icon: <UserIcon className="profile-navbar-svg" aria-hidden="true" />,
    ariaLabel: "Ver mi perfil",
  },
  {
    label: "Editar perfil",
    href: "/profile/edit",
    icon: (
      <PencilSquareIcon className="profile-navbar-svg" aria-hidden="true" />
    ),
    ariaLabel: "Editar mi perfil",
  },
  {
    label: "Cambiar contraseña",
    href: "/profile/change-password",
    icon: <KeyIcon className="profile-navbar-svg" aria-hidden="true" />,
    ariaLabel: "Cambiar mi contraseña",
  },
  {
    label: "Eliminar cuenta",
    href: "/profile/delete-account",
    icon: <TrashIcon className="profile-navbar-svg" aria-hidden="true" />,
    ariaLabel: "Eliminar mi cuenta",
  },
];

const NavItem = memo(({ option, isActive, onClick }) => (
  <li className="profile-navbar-item">
    <Link
      href={option.href}
      className={`profile-navbar-link${isActive ? " active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      aria-label={option.ariaLabel}
      onClick={onClick}
    >
      <span className="profile-navbar-icon">{option.icon}</span>
      <span className="profile-navbar-label">{option.label}</span>
    </Link>
  </li>
));

NavItem.displayName = "NavItem";

const ProfileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout(router);
  }, [router]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="profile-navbar" aria-label="Menú de perfil">
      <div className="profile-navbar-mobile-header">
        <Logo size={60} />

        <button
          className="hamburger-menu-button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Menú de navegación"
        >
          {menuOpen ? (
            <XMarkIcon className="hamburger-icon" />
          ) : (
            <Bars3Icon className="hamburger-icon" />
          )}
        </button>
      </div>

      <div className={`profile-navbar-content ${menuOpen ? "open" : ""}`}>
        <div className="profile-navbar-header">
          <Link
            href="/"
            className="profile-navbar-home-link header-home-link"
            aria-label="Volver a inicio"
            onClick={closeMenu}
          >
            <HomeIcon className="profile-navbar-home-icon" />
            <span>Volver a inicio</span>
          </Link>
        </div>

        <div className="profile-navbar-divider" />

        <ul className="profile-navbar-list" role="list">
          {navOptions.map((option) => (
            <NavItem
              key={option.href}
              option={option}
              isActive={pathname === option.href}
              onClick={closeMenu}
            />
          ))}
        </ul>

        <div className="profile-navbar-footer">
          <Button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon
              className="profile-navbar-svg"
              aria-hidden="true"
            />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default ProfileNavbar;
