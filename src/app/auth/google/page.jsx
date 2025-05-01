"use client";

import "./google.css";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthService } from "../../../services/googleAuth.service";
import { useNotification } from "../../../context/NotificationContext";

export default function GoogleAuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    async function handleGoogleCallback() {
      const code = params.get("code");
      if (!code) {
        showError("No se encontró el código de autorización de Google.");
        router.push("/auth/login");
        return;
      }
      try {
        const { user } = await googleAuthService.handleCallback(code);
        if (user) {
          showSuccess("Inicio de sesión exitoso con Google.");
          setTimeout(() => router.push("/"), 800);
        } else {
          showError("No se pudo completar la autenticación con Google.");
          router.push("/auth/login");
        }
      } catch {
        showError("Error durante la autenticación con Google.");
        router.push("/auth/login");
      }
    }
    handleGoogleCallback();
  }, [params, router, showError, showSuccess]);

  return (
    <div className="container">
      <div className="card">
        <div className="spinner"></div>
        <h1 className="heading">Procesando autenticación con Google…</h1>
        <p className="text">Te redirigiremos en breve. Por favor espera.</p>
      </div>
    </div>
  );
}
