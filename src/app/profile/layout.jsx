"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "../../utils/storage";
import ProfileNavbar from "./components/ProfileNavbar";
import "./layout.css";

export default function ProfileLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.getToken(false) || storage.getToken(true);
    if (!token) {
      router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="profile-layout-loading">
        <div className="profile-layout-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-layout-container">
      <ProfileNavbar />
      <div className="profile-layout-content">{children}</div>
    </div>
  );
}
