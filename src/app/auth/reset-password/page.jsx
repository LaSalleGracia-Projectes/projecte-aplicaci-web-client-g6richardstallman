"use client";

import "./reset-password.css";
import { useState } from "react";
import Link from "next/link";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import { useNotification } from "../../../context/NotificationContext";

const API_BASE_URL = "http://localhost:8000/api";
const API_ENDPOINTS = {
  resetPassword: `${API_BASE_URL}/reset-password`,
};

const validateForm = (form) => {
  const errors = {};
  if (!form.email.trim()) errors.email = "El email es obligatorio";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    errors.email = "El email debe ser válido";
  if (!form.identificador.trim())
    errors.identificador = "El identificador es obligatorio";
  return errors;
};

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: "", identificador: "" });
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useNotification();

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
      const res = await fetch(API_ENDPOINTS.resetPassword, {
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
          showError(
            data.messages ||
              data.message ||
              "Error al restablecer la contraseña"
          );
        }
      } else {
        showSuccess(
          "Si los datos son correctos, recibirás un email con la nueva contraseña."
        );
        setForm({ email: "", identificador: "" });
      }
    } catch (err) {
      showError("Error de red o del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-logo">
        <Logo size={140} />
      </div>
      <div className="reset-header">
        <h1 className="reset-title">Restablecer contraseña</h1>
        <p className="reset-subtitle">
          Introduce tus datos para recuperar el acceso
        </p>
      </div>
      <form onSubmit={handleSubmit} className="reset-form">
        <div className="reset-input-group">
          <div className="reset-input-gradient"></div>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            autoFocus
            className="reset-input"
          />
        </div>
        <div className="reset-input-group">
          <div className="reset-input-gradient"></div>
          <Input
            name="identificador"
            value={form.identificador}
            onChange={handleChange}
            placeholder="DNI (participante) o Teléfono de contacto (organizador)"
            required
            className="reset-input"
          />
        </div>
        <div className="reset-actions">
          <Button type="submit" className="reset-btn-main" disabled={loading}>
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
                Enviando...
              </span>
            ) : (
              "Restablecer contraseña"
            )}
          </Button>
        </div>
      </form>
      <div className="reset-footer">
        <Link href="/auth/login" className="reset-footer-link">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
