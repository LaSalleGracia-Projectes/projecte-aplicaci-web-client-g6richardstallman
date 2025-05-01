"use client";

import "./login.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import { useNotification } from "../../../context/NotificationContext";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { userService } from "../../../services/user.service";
import { googleAuthService } from "../../../services/googleAuth.service";
import { storage } from "../../../utils/storage";

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
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

  const { showSuccess, showError } = useNotification();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const authUrl = await googleAuthService.getAuthUrl();
      if (authUrl) {
        router.push(authUrl);
      } else {
        showError("No se pudo iniciar la autenticación con Google");
      }
    } catch (err) {
      showError("Error al conectar con Google");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join(", ");
      showError(errorMessages);
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login({
        email: form.email,
        password: form.password,
      });

      if (data.access_token) {
        if (form.rememberMe) {
          localStorage.setItem("auth_token", JSON.stringify(data.access_token));
          sessionStorage.removeItem("auth_token");
        } else {
          localStorage.removeItem("auth_token");
        }
      }

      showSuccess("Login exitoso");

      try {
        const userData = await userService.getProfile();
        if (userData.data) {
          if (form.rememberMe) {
            localStorage.setItem("user_info", JSON.stringify(userData.data));
            sessionStorage.removeItem("user_info");
          } else {
            localStorage.removeItem("user_info");
          }
        }
      } catch (profileError) {
        console.error(
          "Error al obtener perfil después del login:",
          profileError
        );
      }

      setForm(initialState);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      if (err.errors && err.errors.messages) {
        const messages = err.errors.messages;
        if (typeof messages === "object") {
          const errorMessages = Object.values(messages)
            .flat()
            .filter((msg) => msg)
            .join(", ");
          showError(errorMessages || "Error en el formulario");
        } else {
          showError(messages || "Error en el inicio de sesión");
        }
      } else if (err.message) {
        showError(err.message);
      } else {
        showError("Ha ocurrido un error durante el inicio de sesión");
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
        <div className="login-remember-me">
          <label className="login-checkbox-container">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="login-checkbox"
            />
            <span className="login-checkbox-label">Recordarme</span>
          </label>
        </div>
        <div className="login-actions">
          <Button
            type="submit"
            className="login-btn-main"
            disabled={loading}
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
            disabled={loading}
            aria-label="Iniciar sesión con Google"
          >
            <Image
              src="/icons/googleIcon.png"
              alt="Google"
              width={24}
              height={24}
              style={{ borderRadius: "50%" }}
            />
            <span>Google</span>
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
