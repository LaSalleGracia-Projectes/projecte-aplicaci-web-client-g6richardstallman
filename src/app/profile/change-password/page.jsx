"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "../../../services/user.service";
import { authService } from "../../../services/auth.service";
import { useNotification } from "../../../context/NotificationContext";
import {
  FiKey,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiSave,
} from "react-icons/fi";
import "./change-password.css";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "current_password":
        if (!value) {
          newErrors.current_password = "La contraseña actual es requerida";
        } else {
          delete newErrors.current_password;
        }
        break;
      case "new_password":
        if (!value) {
          newErrors.new_password = "La nueva contraseña es requerida";
        } else if (value.length < 8) {
          newErrors.new_password =
            "La contraseña debe tener al menos 8 caracteres";
        } else if (!/[A-Z]/.test(value)) {
          newErrors.new_password =
            "La contraseña debe incluir al menos una letra mayúscula";
        } else if (!/[a-z]/.test(value)) {
          newErrors.new_password =
            "La contraseña debe incluir al menos una letra minúscula";
        } else if (!/[0-9]/.test(value)) {
          newErrors.new_password =
            "La contraseña debe incluir al menos un número";
        } else {
          delete newErrors.new_password;
        }

        if (form.confirm_password) {
          if (value !== form.confirm_password) {
            newErrors.confirm_password = "Las contraseñas no coinciden";
          } else {
            delete newErrors.confirm_password;
          }
        }
        break;
      case "confirm_password":
        if (!value) {
          newErrors.confirm_password =
            "La confirmación de contraseña es requerida";
        } else if (value !== form.new_password) {
          newErrors.confirm_password = "Las contraseñas no coinciden";
        } else {
          delete newErrors.confirm_password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const validations = {
      current_password: !!form.current_password,
      new_password_length: form.new_password.length >= 8,
      new_password_uppercase: /[A-Z]/.test(form.new_password),
      new_password_lowercase: /[a-z]/.test(form.new_password),
      new_password_number: /[0-9]/.test(form.new_password),
      confirm_password:
        !!form.confirm_password && form.new_password === form.confirm_password,
    };

    const newErrors = {};

    if (!validations.current_password) {
      newErrors.current_password = "La contraseña actual es requerida";
    }

    if (!form.new_password) {
      newErrors.new_password = "La nueva contraseña es requerida";
    } else if (!validations.new_password_length) {
      newErrors.new_password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!validations.new_password_uppercase) {
      newErrors.new_password =
        "La contraseña debe incluir al menos una letra mayúscula";
    } else if (!validations.new_password_lowercase) {
      newErrors.new_password =
        "La contraseña debe incluir al menos una letra minúscula";
    } else if (!validations.new_password_number) {
      newErrors.new_password = "La contraseña debe incluir al menos un número";
    }

    if (!validations.confirm_password) {
      newErrors.confirm_password = form.confirm_password
        ? "Las contraseñas no coinciden"
        : "La confirmación de contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Por favor, corrige los errores señalados");
      return;
    }

    setLoading(true);

    try {
      await userService.changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });

      showSuccess(
        "Contraseña actualizada correctamente. Se cerrará tu sesión por seguridad."
      );

      setTimeout(() => {
        authService
          .logout()
          .then(() => {
            setTimeout(() => {
              authService.redirectToLogin(router);
            }, 1000);
          })
          .catch(() => {
            authService.redirectToLogin(router);
          });
      }, 1500);
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);

      if (err.status === 422) {
        handleValidationError(err);
      } else if (err.status === 401 || err.status === 403) {
        handleAuthError(err);
      } else if (err.status === 500) {
        handleServerError(err);
      } else {
        showError(
          err.errors?.message ||
            err.errors?.error ||
            "Error al cambiar la contraseña"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidationError = (err) => {
    const validationErrors = err.errors?.errors || {};

    if (validationErrors.current_password) {
      setErrors((prev) => ({
        ...prev,
        current_password: validationErrors.current_password[0],
      }));
    }

    if (validationErrors.new_password) {
      setErrors((prev) => ({
        ...prev,
        new_password: validationErrors.new_password[0],
      }));
    }

    showError("Por favor, verifica los datos ingresados");
  };

  const handleAuthError = (err) => {
    if (
      err.errors?.message?.includes("current password") ||
      err.errors?.current_password
    ) {
      showError("La contraseña actual es incorrecta");
      setErrors((prev) => ({
        ...prev,
        current_password: "La contraseña actual es incorrecta",
      }));
    } else {
      userService.clearUserInfo();
      authService.redirectToLogin(router);
    }
  };

  const handleServerError = (err) => {
    showError(
      "Error interno del servidor. Por favor, intenta nuevamente más tarde."
    );

    if (
      err.errors?.message?.toLowerCase().includes("token") ||
      err.errors?.message?.toLowerCase().includes("autenticación") ||
      err.errors?.message?.toLowerCase().includes("autenticar")
    ) {
      setTimeout(() => {
        authService.logout().finally(() => {
          authService.redirectToLogin(router);
        });
      }, 1500);
    }
  };

  const handleCancel = () => {
    showInfo("Cambio de contraseña cancelado");
    router.push("/profile");
  };

  return (
    <div className="change-password-page">
      <div className="change-password-header">
        <div className="change-password-title">
          <FiKey className="change-password-icon" />
          <h1>Cambiar contraseña</h1>
        </div>
      </div>

      <div className="change-password-container">
        <div className="change-password-card">
          <div className="change-password-card-header">
            <h2>Actualizar credenciales</h2>
          </div>

          <div className="change-password-card-content">
            <div className="password-security-note">
              <FiShield className="security-icon" />
              <div>
                <h3>Contraseña segura</h3>
                <p>
                  Tu contraseña debe contener al menos 8 caracteres, una letra
                  mayúscula, una minúscula y un número.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="change-password-form">
              <div className="form-group">
                <label htmlFor="current_password">
                  <FiLock className="input-icon" />
                  <span>Contraseña actual</span>
                </label>
                <div className="password-input-container">
                  <input
                    id="current_password"
                    name="current_password"
                    type={showPasswords.current ? "text" : "password"}
                    value={form.current_password}
                    onChange={handleChange}
                    className={errors.current_password ? "error" : ""}
                    placeholder="Introduce tu contraseña actual"
                    aria-invalid={!!errors.current_password}
                    aria-describedby={
                      errors.current_password
                        ? "current_password_error"
                        : undefined
                    }
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password-button"
                    onClick={() => togglePasswordVisibility("current")}
                    aria-label={
                      showPasswords.current
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.current_password && (
                  <div
                    className="field-error"
                    id="current_password_error"
                    role="alert"
                  >
                    {errors.current_password}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="new_password">
                  <FiLock className="input-icon" />
                  <span>Nueva contraseña</span>
                </label>
                <div className="password-input-container">
                  <input
                    id="new_password"
                    name="new_password"
                    type={showPasswords.new ? "text" : "password"}
                    value={form.new_password}
                    onChange={handleChange}
                    className={errors.new_password ? "error" : ""}
                    placeholder="Introduce tu nueva contraseña"
                    aria-invalid={!!errors.new_password}
                    aria-describedby={
                      errors.new_password
                        ? "new_password_error"
                        : "password-requirements"
                    }
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password-button"
                    onClick={() => togglePasswordVisibility("new")}
                    aria-label={
                      showPasswords.new
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.new_password && (
                  <div
                    className="field-error"
                    id="new_password_error"
                    role="alert"
                  >
                    {errors.new_password}
                  </div>
                )}
                <div
                  className="password-requirements"
                  id="password-requirements"
                >
                  <p>La contraseña debe cumplir con:</p>
                  <ul className="requirements-list">
                    <li
                      className={
                        form.new_password.length >= 8 ? "requirement-met" : ""
                      }
                    >
                      <span className="requirement-icon"></span>
                      <span>Mínimo 8 caracteres</span>
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(form.new_password) ? "requirement-met" : ""
                      }
                    >
                      <span className="requirement-icon"></span>
                      <span>Al menos una mayúscula</span>
                    </li>
                    <li
                      className={
                        /[a-z]/.test(form.new_password) ? "requirement-met" : ""
                      }
                    >
                      <span className="requirement-icon"></span>
                      <span>Al menos una minúscula</span>
                    </li>
                    <li
                      className={
                        /[0-9]/.test(form.new_password) ? "requirement-met" : ""
                      }
                    >
                      <span className="requirement-icon"></span>
                      <span>Al menos un número</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">
                  <FiLock className="input-icon" />
                  <span>Confirmar nueva contraseña</span>
                </label>
                <div className="password-input-container">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={form.confirm_password}
                    onChange={handleChange}
                    className={errors.confirm_password ? "error" : ""}
                    placeholder="Confirma tu nueva contraseña"
                    aria-invalid={!!errors.confirm_password}
                    aria-describedby={
                      errors.confirm_password
                        ? "confirm_password_error"
                        : undefined
                    }
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password-button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    aria-label={
                      showPasswords.confirm
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <div
                    className="field-error"
                    id="confirm_password_error"
                    role="alert"
                  >
                    {errors.confirm_password}
                  </div>
                )}
              </div>

              <div className="change-password-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Cambiando...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>Guardar contraseña</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
