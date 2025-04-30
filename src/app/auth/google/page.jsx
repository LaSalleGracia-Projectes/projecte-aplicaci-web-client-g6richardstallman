"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleAuthService } from "../../../services/googleAuth.service";
import { useNotification } from "../../../context/NotificationContext";

export default function GoogleAuthPage() {
  const router = useRouter();
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        showError("No se encontró el código de autorización de Google.");
        router.push("/auth/login");
        return;
      }

      try {
        const data = await googleAuthService.handleCallback(code);

        if (data.user) {
          showSuccess("Inicio de sesión exitoso con Google.");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          showError("No se pudo completar la autenticación con Google.");
          router.push("/auth/login");
        }
      } catch (error) {
        showError("Error durante la autenticación con Google.");
        router.push("/auth/login");
      }
    };

    handleGoogleCallback();
  }, [router, showError, showSuccess]);

  return (
    <div className="google-auth-container">
      <p>Procesando autenticación con Google...</p>
    </div>
  );
}