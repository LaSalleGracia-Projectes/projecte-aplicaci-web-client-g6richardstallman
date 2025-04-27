"use client";

import "./login.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { setStoredUser } from "../../../utils/user";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import { useNotification } from "../../../context/NotificationContext";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:8000/api";
const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  profile: `${API_BASE_URL}/profile`,
  googleAuth: `${API_BASE_URL}/auth/google`,
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
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useNotification();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      if (typeof validationErrors === "string") {
        showError(validationErrors);
      } else {
        const errorMessages = Object.values(validationErrors).join(", ");
        showError(errorMessages);
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (typeof data.messages === "object") {
          const errorMessages = Object.values(data.messages).flat().join(", ");
          showError(errorMessages);
        } else {
          showError(data.messages || data.message || "Error al iniciar sesión");
        }
      } else {
        showSuccess("Login exitoso");
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          const profileRes = await fetch(API_ENDPOINTS.profile, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          const profileData = await profileRes.json();
          if (profileData?.data) setStoredUser(profileData.data);
        }
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err) {
      showError("Error de red o del servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.googleAuth);
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        showError("No se pudo iniciar la autenticación con Google");
      }
    } catch (err) {
      showError("Error al conectar con Google");
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
          />
        </div>
        <div className="login-actions">
          <Button type="submit" className="login-btn-main" disabled={loading}>
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  className="animate-spin"
                  style={{
                    marginLeft: "-0.25rem",
                    marginRight: "0.75rem",
                    height: "1.25rem",
                    width: "1.25rem",
                    color: "white",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Entrando...
              </span>
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
            disabled={loading}
          >
            <Image
              src="/googleIcon.png"
              alt="Google"
              width={24}
              height={24}
              style={{ borderRadius: "50%" }}
            />
            <span>Continuar con Google</span>
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
