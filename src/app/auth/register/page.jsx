"use client";

import "./register.css";
import Logo from "../../../components/ui/Logo/Logo";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { setStoredUser } from "../../../utils/user";
import Dropdown from "../../../components/ui/Dropdown/Dropdown";
import { useNotification } from "../../../context/NotificationContext";

const API_BASE_URL = "http://localhost:8000/api";
const API_ENDPOINTS = {
  register: `${API_BASE_URL}/register`,
  profile: `${API_BASE_URL}/profile`,
  googleAuth: `${API_BASE_URL}/auth/google`,
};

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
  if (!form.role) errors.role = "El rol es obligatorio";

  if (form.role === "participante") {
    if (!form.dni.trim()) errors.dni = "El DNI es obligatorio";
    else if (!/^\d{8}[A-Z]$/.test(form.dni))
      errors.dni = "El DNI debe tener 8 números y 1 letra mayúscula";
    if (!form.telefono.trim()) errors.telefono = "El teléfono es obligatorio";
    else if (!/^\+34\d{9}$|^\d{9}$/.test(form.telefono))
      errors.telefono =
        "El teléfono debe tener 9 dígitos o formato internacional (+34XXXXXXXXX)";
  } else if (form.role === "organizador") {
    if (!form.nombre_organizacion.trim())
      errors.nombre_organizacion =
        "El nombre de la organización es obligatorio";
    if (!form.telefono_contacto.trim())
      errors.telefono_contacto = "El teléfono de contacto es obligatorio";
    else if (!/^\+34\d{9}$|^\d{9}$/.test(form.telefono_contacto))
      errors.telefono_contacto =
        "El teléfono debe tener 9 dígitos o formato internacional (+34XXXXXXXXX)";
  }

  return errors;
};

const preparePayload = (form) => {
  const payload = {
    nombre: form.nombre,
    apellido1: form.apellido1,
    apellido2: form.apellido2,
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
      const res = await fetch(API_ENDPOINTS.googleAuth);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showError("No se pudo iniciar la autenticación con Google");
      }
    } catch (err) {
      showError("Error al conectar con Google");
    }
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

    const payload = preparePayload(form);

    try {
      const res = await fetch(API_ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (typeof data.messages === "object") {
          const errorMessages = Object.values(data.messages).flat().join(", ");
          showError(errorMessages);
        } else {
          showError(data.messages || data.message || "Error en el registro");
        }
      } else {
        showSuccess("Registro exitoso. Revisa tu correo para confirmar.");
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          const profileRes = await fetch(API_ENDPOINTS.profile, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          const profileData = await profileRes.json();
          if (profileData?.data) setStoredUser(profileData.data);
        }
        setForm(initialState);
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);
      }
    } catch (err) {
      showError("Error de red o del servidor");
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
              placeholder="Segundo Apellido"
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
          <label className="register-label">Rol</label>
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
                placeholder="DNI"
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
                placeholder="Teléfono"
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
                Registrando...
              </span>
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
            <span>Registrarse con Google</span>
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
