"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get("code");
      if (!code) {
        router.replace("/auth/login?error=google");
        return;
      }
      try {
        // Llamada al backend para obtener el token
        const res = await fetch(`http://localhost:8000/api/auth/google/callback?code=${code}`);
        const data = await res.json();
        // El backend puede devolver 'token' o 'access_token' según la ruta
        const token = data.token || data.access_token;
        if (res.ok && token) {
          localStorage.setItem("access_token", token);
          // Comprobar si el usuario tiene perfil completo
          const profileRes = await fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profileData = await profileRes.json();
          let needsProfile = false;
          if (profileRes.ok && profileData.data) {
            const p = profileData.data;
            if (!p.role || (p.role === "participante" && (!p.dni || !p.telefono)) || (p.role === "organizador" && (!p.nombre_organizacion || !p.telefono_contacto))) {
              needsProfile = true;
            }
          } else {
            needsProfile = true;
          }
          if (needsProfile) {
            router.replace("/auth/google/complete-profile");
          } else {
            router.replace("/");
          }
        } else {
          router.replace("/auth/login?error=google");
        }
      } catch (err) {
        router.replace("/auth/login?error=google");
      }
    };
    handleGoogleCallback();
    // eslint-disable-next-line
  }, []);

  return <div>Procesando autenticación con Google...</div>;
}
