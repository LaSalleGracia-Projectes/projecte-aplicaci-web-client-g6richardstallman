"use client";

import React, { useCallback, memo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../../components/ui/Logo/Logo";
import Button from "../../../components/ui/Button/Button";
import { logout } from "../../../utils/logout";
import { getStoredUser } from "../../../utils/user";
import { 
  FiUser, 
  FiEdit, 
  FiKey, 
  FiTrash2, 
  FiLogOut, 
  FiHome, 
  FiMenu, 
  FiX, 
  FiHeart, 
  FiTag, // Using FiTag instead of FiTicket which doesn't exist
  FiCalendar 
} from "react-icons/fi";
import "./ProfileNavbar.css";

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
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout(router);
  }, [router]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Base navigation options for all users
  const baseNavOptions = [
    {
      label: "Mi perfil",
      href: "/profile",
      icon: <FiUser className="profile-navbar-svg" aria-hidden="true" />,
      ariaLabel: "Ver mi perfil",
    },
    {
      label: "Editar perfil",
      href: "/profile/edit",
      icon: <FiEdit className="profile-navbar-svg" aria-hidden="true" />,
      ariaLabel: "Editar mi perfil",
    },
    {
      label: "Cambiar contraseña",
      href: "/profile/change-password",
      icon: <FiKey className="profile-navbar-svg" aria-hidden="true" />,
      ariaLabel: "Cambiar mi contraseña",
    },
    {
      label: "Eliminar cuenta",
      href: "/profile/delete-account",
      icon: <FiTrash2 className="profile-navbar-svg" aria-hidden="true" />,
      ariaLabel: "Eliminar mi cuenta",
    },
  ];

  // Role-specific navigation options
  const participantOptions = [
    {
      label: "Favoritos",
      href: "/profile/favorites",
      icon: <FiHeart className="profile-navbar-svg" aria-hidden="true" />,
      ariaLabel: "Mis eventos favoritos",
    },
    {
      label: "Mis Entradas",
      href: "/profile/tickets",
      icon: <FiTag className="profile-navbar-svg" aria-hidden="true" />, // Using FiTag instead of FiTicket
      ariaLabel: "Mis entradas compradas",
    },
  ];

  const organizerOptions = [
    {
      label: "Mis Eventos",
      href: "/profile/events",
      icon: <FiCalendar className="profile-navbar-svg" aria-hidden="true" />,
      ariaLabel: "Gestionar mis eventos",
    },
  ];

  // Determine which navigation options to show based on user role
  let navOptions = [...baseNavOptions];
  
  if (userRole === "participante") {
    navOptions = [...baseNavOptions.slice(0, 2), ...participantOptions, ...baseNavOptions.slice(2)];
  } else if (userRole === "organizador") {
    navOptions = [...baseNavOptions.slice(0, 2), ...organizerOptions, ...baseNavOptions.slice(2)];
  }

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
            <FiX className="hamburger-icon" />
          ) : (
            <FiMenu className="hamburger-icon" />
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
            <FiHome className="profile-navbar-home-icon" />
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
            <FiLogOut
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
