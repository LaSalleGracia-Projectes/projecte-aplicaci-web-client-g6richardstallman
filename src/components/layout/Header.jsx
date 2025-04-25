"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../ui/Logo";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Link from "next/link";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { logout } from "../../utils/logout";
import { getStoredUser, setStoredUser, clearStoredUser } from "../../utils/user";

const Header = () => {
  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    if (!token) {
      setUser(null);
      clearStoredUser();
      return;
    }
    // Refresca en segon pla
    fetch("http://localhost:8000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setUser(data.data);
          setStoredUser(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <header className="w-full bg-white border-b border-red-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-4">
        {/* Logo gran a l'esquerra */}
        <div className="flex-shrink-0 flex items-center">
          <Logo size={150} />
        </div>
        {/* Buscador centrat */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 text-red-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              className="w-full pl-10 pr-3 py-2 border border-red-100 rounded-full bg-white focus:ring-1 focus:ring-red-200 focus:border-red-300 transition placeholder:text-red-300 text-gray-700 shadow-sm"
            />
          </div>
        </div>
        {/* Botons a la dreta */}
        <div className="flex gap-2 flex-shrink-0">
          {!user ? (
            <>
              <Link href="/auth/login">
                <Button className="bg-red-200 text-red-700 px-5 py-2 rounded-full hover:bg-red-300">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-white border border-red-300 text-red-700 px-5 py-2 rounded-full hover:bg-red-50">
                  Registrarse
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full border border-red-100 hover:bg-red-50 focus:outline-none"
                aria-label="Menú de usuario"
              >
                {user.foto_perfil ? (
                  <Image src={user.foto_perfil} alt="Perfil" width={36} height={36} className="rounded-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-9 h-9 text-red-300" />
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-red-100 rounded-lg shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-50"
                    onClick={() => { setMenuOpen(false); router.push('/profile'); }}
                  >Perfil</button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-50"
                    onClick={() => { setMenuOpen(false); router.push('/profile/eventos'); }}
                  >Mis eventos</button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                    onClick={() => { setMenuOpen(false); logout(router); clearStoredUser(); setUser(null); }}
                  >Logout</button>
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