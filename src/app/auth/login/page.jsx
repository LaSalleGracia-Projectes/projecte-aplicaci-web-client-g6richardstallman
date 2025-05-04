"use client";

import "./login.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import { useNotification } from "../../../context/NotificationContext";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { userService } from "../../../services/user.service";
import { googleAuthService } from "../../../services/googleAuth.service";
import { storage } from "../../../utils/storage";

const initialState = {
  email: "",
  password: "",
};

const validateForm = (form) => {
  const errors = {};
  if (!form.email.trim()) errors.email = "El email es obligatorio";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    errors.email = "El email debe ser válido";
  if (!form.password) errors.password = "La contraseña es obligatoria";
  return errors;
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar si hay un mensaje de error o éxito en los parámetros de URL
    const googleError = searchParams.get("google_error");
    if (googleError) {
      showError(decodeURIComponent(googleError));
    }
  }, [searchParams, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      const authUrl = await googleAuthService.getAuthUrl();
      if (authUrl) {
        // Redirigir a Google OAuth
        window.location.href = authUrl;
      } else {
        showError("No se pudo iniciar la autenticación con Google");
      }
    } catch (err) {
      console.error("Error al conectar con Google:", err);
      showError("Error al conectar con Google. Intentalo de nuevo más tarde.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      showError(Object.values(validationErrors).join(", "));
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({
        email: form.email,
        password: form.password,
      });
      if (data.access_token) {
        storage.setToken(data.access_token);
        await userService.getProfile();
      }
      showSuccess("Login exitoso");
      setForm(initialState);
      router.replace("/");
    } catch (err) {
      if (err.errors?.messages) {
        const msgs = err.errors.messages;
        const text =
          typeof msgs === "object"
            ? Object.values(msgs).flat().filter(Boolean).join(", ")
            : msgs;
        showError(text || "Error en el inicio de sesión");
      } else {
        showError(err.message || "Ha ocurrido un error durante el inicio de sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Logo size={200} />
      </div>
      <div className="login-header">
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Accede a tu cuenta de Eventflix</p>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-input-group">
          <div className="login-input-gradient"></div>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            autoFocus
            className="login-input"
            aria-label="Email"
          />
        </div>
        <div className="login-input-group">
          <div className="login-input-gradient"></div>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="login-input"
            aria-label="Contraseña"
          />
        </div>
        <div className="login-actions">
          <Button
            type="submit"
            className="login-btn-main"
            disabled={loading || googleLoading}
            aria-busy={loading}
          >
            {loading ? (
              <div className="spinner-container">
                <div
                  className="spinner"
                  role="status"
                  aria-label="Cargando"
                ></div>
                <span>Entrando...</span>
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
          <div className="login-divider">
            <div className="login-divider-line"></div>
            <div className="login-divider-text">O continúa con</div>
            <div className="login-divider-line"></div>
          </div>
          <Button
            type="button"
            onClick={handleGoogleAuth}
            className="login-btn-google"
            disabled={loading || googleLoading}
            aria-label="Iniciar sesión con Google"
          >
            {googleLoading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <span>Conectando...</span>
              </div>
            ) : (
              <>
                <Image
                  src="/icons/google-icon.png"
                  alt="Google"
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%" }}
                />
                <span>Google</span>
              </>
            )}
          </Button>
        </div>
      </form>
      <div className="login-footer">
        <Link
          href="/auth/reset-password"
          className="login-footer-link-secondary"
          style={{ marginBottom: "1rem" }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <div>
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="login-footer-link">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
