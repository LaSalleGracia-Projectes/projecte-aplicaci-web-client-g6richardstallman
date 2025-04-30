"use client";

import "./register.css";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import Link from "next/link";
import { useState } from "react";
import Dropdown from "../../../components/ui/Dropdown/Dropdown";
import { useNotification } from "../../../context/NotificationContext";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { googleAuthService } from "../../../services/googleAuth.service";
import Image from "next/image";

const initialState = {
  nombre: "",
  apellido1: "",
  apellido2: "",
  email: "",
  password: "",
  role: "participante",
  dni: "",
  telefono: "",
  nombre_organizacion: "",
  telefono_contacto: "",
};

const validateForm = (form) => {
  const errors = {};

  if (!form.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!form.apellido1.trim())
    errors.apellido1 = "El primer apellido es obligatorio";
  if (!form.email.trim()) errors.email = "El email es obligatorio";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    errors.email = "El email debe ser válido";
  if (!form.password) errors.password = "La contraseña es obligatoria";
  else if (form.password.length < 6)
    errors.password = "La contraseña debe tener al menos 6 caracteres";

  if (form.role === "participante") {
    if (!form.dni.trim()) {
      errors.dni = "El DNI es obligatorio";
    } else if (!/^\d{8}[A-Z]$/.test(form.dni)) {
      errors.dni = "Formato inválido. Ej: 12345678A";
    }

    if (!form.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio";
    } else if (!/^\+34\d{9}$|^\d{9}$/.test(form.telefono)) {
      errors.telefono = "Formato inválido. Ej: 612345678 o +34612345678";
    }
  } else if (form.role === "organizador") {
    if (!form.nombre_organizacion.trim()) {
      errors.nombre_organizacion =
        "El nombre de la organización es obligatorio";
    }

    if (!form.telefono_contacto.trim()) {
      errors.telefono_contacto = "El teléfono de contacto es obligatorio";
    } else if (!/^\+34\d{9}$|^\d{9}$/.test(form.telefono_contacto)) {
      errors.telefono_contacto =
        "Formato inválido. Ej: 612345678 o +34612345678";
    }
  }

  return errors;
};

const preparePayload = (form) => {
  const payload = {
    nombre: form.nombre,
    apellido1: form.apellido1,
    apellido2: form.apellido2 || "",
    email: form.email,
    password: form.password,
    role: form.role,
  };

  if (form.role === "participante") {
    payload.dni = form.dni;
    payload.telefono = form.telefono;
  } else if (form.role === "organizador") {
    payload.nombre_organizacion = form.nombre_organizacion;
    payload.telefono_contacto = form.telefono_contacto;
  }

  return payload;
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      role: e.target.value,
      dni: "",
      telefono: "",
      nombre_organizacion: "",
      telefono_contacto: "",
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
      const payload = preparePayload(form);
      await authService.register(payload);

      showSuccess(
        "¡Registro exitoso! Revisa tu correo para confirmar tu cuenta."
      );

      setForm(initialState);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
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
          showError(messages || "Error en el registro");
        }
      } else if (err.message) {
        showError(err.message);
      } else {
        showError("Ha ocurrido un error durante el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-logo">
        <Logo size={200} />
      </div>
      <div className="register-header">
        <h1 className="register-title">Crea tu cuenta</h1>
        <p className="register-subtitle">Regístrate para acceder a Eventflix</p>
      </div>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-input-group">
          <div className="register-input-gradient"></div>
          <Input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            autoFocus
            className="register-input"
          />
        </div>
        <div className="register-grid">
          <div className="register-input-group">
            <div className="register-input-gradient"></div>
            <Input
              name="apellido1"
              value={form.apellido1}
              onChange={handleChange}
              placeholder="Primer Apellido"
              required
              className="register-input"
            />
          </div>
          <div className="register-input-group">
            <div className="register-input-gradient"></div>
            <Input
              name="apellido2"
              value={form.apellido2}
              onChange={handleChange}
              placeholder="Segundo Apellido (opcional)"
              className="register-input"
            />
          </div>
        </div>
        <div className="register-input-group">
          <div className="register-input-gradient"></div>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="register-input"
          />
        </div>
        <div className="register-input-group">
          <div className="register-input-gradient"></div>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            minLength={6}
            className="register-input"
          />
        </div>
        <div className="w-full">
          <label className="register-label">Tipo de cuenta</label>
          <Dropdown
            options={[
              { label: "Participante", value: "participante" },
              { label: "Organizador", value: "organizador" },
            ]}
            value={form.role}
            onChange={handleRoleChange}
            name="role"
            className="register-dropdown"
            menuClassName="register-dropdown-menu"
          />
        </div>
        {form.role === "participante" && (
          <div className="register-grid">
            <div className="register-input-group">
              <div className="register-input-gradient"></div>
              <Input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="DNI (12345678A)"
                required
                className="register-input"
              />
            </div>
            <div className="register-input-group">
              <div className="register-input-gradient"></div>
              <Input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono (612345678)"
                required
                className="register-input"
              />
            </div>
          </div>
        )}
        {form.role === "organizador" && (
          <div className="register-grid">
            <div className="register-input-group">
              <div className="register-input-gradient"></div>
              <Input
                name="nombre_organizacion"
                value={form.nombre_organizacion}
                onChange={handleChange}
                placeholder="Nombre de la organización"
                required
                className="register-input"
              />
            </div>
            <div className="register-input-group">
              <div className="register-input-gradient"></div>
              <Input
                name="telefono_contacto"
                value={form.telefono_contacto}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                required
                className="register-input"
              />
            </div>
          </div>
        )}
        <div className="register-actions">
          <Button
            type="submit"
            className="register-btn-main"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <span>Registrando...</span>
              </div>
            ) : (
              "Registrarse"
            )}
          </Button>
          <div className="register-divider">
            <div className="register-divider-line"></div>
            <div className="register-divider-text">O continúa con</div>
            <div className="register-divider-line"></div>
          </div>
          <Button
            type="button"
            onClick={handleGoogleAuth}
            className="register-btn-google"
            disabled={loading}
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
      <div className="register-footer">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="register-footer-link">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}
