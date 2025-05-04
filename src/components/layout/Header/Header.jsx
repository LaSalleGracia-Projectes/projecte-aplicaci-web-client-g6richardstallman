"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
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
import { storage } from "../../../utils/storage";
import "./Header.css";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthButtons, setShowAuthButtons] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Inicio", path: "/" },
      { label: "Eventos", path: "/events" },
      { label: "Categorías", path: "/events/categories" },
      { label: "Organizadores", path: "/organizers" },
      { label: "Sobre Nosotros", path: "/about" },
      { label: "Contacto", path: "/contact" },
    ],
    []
  );

  const logoSize = 150;

  const preloadUserData = useCallback(() => {
    const storedUser = userService.getStoredUserInfo();
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    setLoading(true);

    try {
      const token = storage.getToken(false) || storage.getToken(true);
      if (!token) {
        setUser(null);
        setShowAuthButtons(true);
        setLoading(false);
        return;
      }

      const [profileResponse, avatarResponse] = await Promise.allSettled([
        userService.getProfile(),
        userService.getAvatar(),
      ]);

      if (profileResponse.status === "fulfilled") {
        let userData = profileResponse.value.data || profileResponse.value;

        if (avatarResponse.status === "fulfilled") {
          const avatarData = avatarResponse.value;
          if (avatarData && (avatarData.avatar_url || avatarData.avatar)) {
            userData = {
              ...userData,
              avatar: avatarData.avatar || userData.avatar,
              avatar_url: avatarData.avatar_url || userData.avatar_url,
            };
            userService.storeUserInfo(userData);
          }
        }

        setUser(userData);
      } else {
        const storedUser = userService.getStoredUserInfo();
        if (storedUser) {
          setUser(storedUser);
        } else {
          authService.cleanupLocalData();
          setShowAuthButtons(true);
          setUser(null);
        }
      }
    } catch (error) {
      const storedUser = userService.getStoredUserInfo();
      if (storedUser) {
        setUser(storedUser);
      } else {
        setShowAuthButtons(true);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    preloadUserData();
    loadUserProfile();
  }, [preloadUserData, loadUserProfile]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setShowAuthButtons(true);
      router.push("/");
    } catch (error) {
      authService.cleanupLocalData();
      setUser(null);
      setShowAuthButtons(true);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      setShowAuthButtons(true);
    } else if (user) {
      setShowAuthButtons(false);
    }
  }, [user, loading]);

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
            showAuthButtons && (
              <div className="auth-buttons">
                <Link href="/auth/login">
                  <Button className="login-button">Iniciar Sesión</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="register-button">Registrarse</Button>
                </Link>
              </div>
            )
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

export default React.memo(Header);
