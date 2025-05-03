"use client";

import "./reset-password.css";
import { useState } from "react";
import Link from "next/link";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import { useNotification } from "../../../context/NotificationContext";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";

const initialState = {
  email: "",
  identificador: "",
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
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      await authService.resetPassword(form.email, form.identificador);

      showSuccess(
        "Si los datos son correctos, recibirás un email con la nueva contraseña."
      );

      setForm(initialState);

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      if (err.errors && typeof err.errors === "object") {
        const errorMsg =
          err.errors.message || Object.values(err.errors).flat().join(", ");
        showError(errorMsg);
      } else if (err.messages && typeof err.messages === "object") {
        const errorMessages = Object.values(err.messages).flat().join(", ");
        showError(errorMessages);
      } else {
        showError(err.message || "Error al restablecer la contraseña");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-logo">
        <Logo size={200} />
      </div>
      <div className="reset-header">
        <h1 className="reset-title">Restablecer contraseña</h1>
        <p className="reset-subtitle">
          Introduce tus datos para recuperar el acceso
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="reset-form"
        aria-label="Formulario para restablecer contraseña"
      >
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
            aria-label="Email de la cuenta"
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
            aria-label="Identificador para verificación"
          />
          <small
            style={{ display: "block", marginTop: "0.5rem", color: "#6b7280" }}
          >
            Introduce tu DNI si eres participante o tu teléfono de contacto si
            eres organizador
          </small>
        </div>
        <div className="reset-actions">
          <Button type="submit" className="reset-btn-main" disabled={loading}>
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <span>Enviando...</span>
              </div>
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
