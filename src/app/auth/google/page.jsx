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
    <div className="google-auth-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh',
      padding: '2rem' 
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <div className="spinner" style={{
          border: '4px solid rgba(239, 68, 68, 0.1)',
          borderRadius: '50%',
          borderTop: '4px solid #ef4444',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
      </div>
      <p style={{ fontSize: '1.125rem', textAlign: 'center' }}>Procesando autenticación con Google...</p>
      <p style={{ color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>Serás redirigido automáticamente</p>
    </div>
  );
}