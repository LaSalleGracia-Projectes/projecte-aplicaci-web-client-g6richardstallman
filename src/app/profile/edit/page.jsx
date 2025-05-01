"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "../../../services/user.service";
import { authService } from "../../../services/auth.service";
import { useNotification } from "../../../context/NotificationContext";
import {
  FiUser,
  FiMail,
  FiSave,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiBriefcase,
  FiHome,
} from "react-icons/fi";
import "./edit.css";

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [newValues, setNewValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = userService.getStoredUserInfo();
        if (storedUser) {
          setProfile(storedUser);
          setLoading(false);
        }

        const { data } = await userService.getProfile();
        if (data) {
          setProfile(data);
          userService.storeUserInfo(data);
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          userService.clearUserInfo();
          authService.redirectToLogin(router);
        } else {
          showError(err.errors?.message || "No se pudo cargar el perfil");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, showError]);

  const validateField = (name, value) => {
    let fieldError = null;
    const isParticipante =
      profile?.tipo_usuario?.toLowerCase() === "participante";
    const isOrganizador =
      profile?.tipo_usuario?.toLowerCase() === "organizador";

    if (value && value.trim() !== "") {
      switch (name) {
        case "nombre":
        case "apellido1":
          if (value.trim() === "") {
            fieldError = `El ${
              name === "nombre" ? "nombre" : "primer apellido"
            } es obligatorio`;
          }
          break;
        case "telefono":
        case "telefono_contacto":
          const phoneRegex = /^[0-9]{9}$/;
          if (!phoneRegex.test(value.trim())) {
            fieldError = "Debe ser un número válido de 9 dígitos";
          }
          break;
        case "dni":
          if (isParticipante && value.trim() === "") {
            fieldError = "El DNI es obligatorio";
          }
          break;
        case "nombre_organizacion":
          if (isOrganizador && value.trim() === "") {
            fieldError = "El nombre de la organización es obligatorio";
          }
          break;
      }
    }

    return fieldError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    Object.keys(newValues).forEach((key) => {
      if (errors[key]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      showError("Por favor, corrige los errores en los campos modificados");
      return;
    }

    const formDataToSend = {};

    Object.keys(newValues).forEach((key) => {
      if (newValues[key] !== undefined) {
        formDataToSend[key] = newValues[key];
      }
    });

    if (Object.keys(formDataToSend).length === 0) {
      showInfo("No se ha realizado ningún cambio");
      router.push("/profile");
      return;
    }

    setSaving(true);

    try {
      const { data } = await userService.updateProfile(formDataToSend);
      showSuccess("Perfil actualizado correctamente");
      setProfile(data);
      userService.storeUserInfo(data);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        userService.clearUserInfo();
        authService.redirectToLogin(router);
      } else if (err.errors?.messages) {
        setErrors(err.errors.messages);
        showError("Por favor, corrige los errores señalados");
      } else {
        showError(
          err.errors?.message || err.message || "Error al actualizar el perfil"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    showInfo("Cambios descartados");
    router.push("/profile");
  };

  if (loading)
    return (
      <div className="profile-edit-loading">
        <div className="profile-edit-spinner"></div>
        <p>Cargando información de perfil...</p>
      </div>
    );

  if (!profile) return null;

  const isParticipante = profile.tipo_usuario?.toLowerCase() === "participante";
  const isOrganizador = profile.tipo_usuario?.toLowerCase() === "organizador";

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-header">
        <div className="profile-edit-title">
          <FiUser className="profile-edit-icon" />
          <h1>Editar perfil</h1>
        </div>
      </div>

      <div className="profile-edit-container">
        <div className="profile-edit-info">
          <p>
            Introduce cambios solo en los campos que deseas actualizar. Los
            campos que dejes en blanco mantendrán su valor actual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-edit-card">
            <div className="profile-edit-card-header">
              <h2>Información personal</h2>
            </div>
            <div className="profile-edit-card-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">
                    <FiUser className="input-icon" />
                    <span>Nombre</span>
                    <span className="current-value">
                      Actual: {profile.nombre}
                    </span>
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Nuevo nombre"
                    value={
                      newValues.nombre === null ? "" : newValues.nombre || ""
                    }
                    onChange={handleChange}
                    className={errors.nombre ? "error" : ""}
                  />
                  {errors.nombre && (
                    <div className="field-error">{errors.nombre}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="apellido1">
                    <FiUser className="input-icon" />
                    <span>Primer Apellido</span>
                    <span className="current-value">
                      Actual: {profile.apellido1}
                    </span>
                  </label>
                  <input
                    id="apellido1"
                    name="apellido1"
                    type="text"
                    placeholder="Nuevo primer apellido"
                    value={
                      newValues.apellido1 === null
                        ? ""
                        : newValues.apellido1 || ""
                    }
                    onChange={handleChange}
                    className={errors.apellido1 ? "error" : ""}
                  />
                  {errors.apellido1 && (
                    <div className="field-error">{errors.apellido1}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="apellido2">
                    <FiUser className="input-icon" />
                    <span>Segundo Apellido</span>
                    <span className="current-value">
                      Actual: {profile.apellido2 || "No establecido"}
                    </span>
                  </label>
                  <input
                    id="apellido2"
                    name="apellido2"
                    type="text"
                    placeholder="Nuevo segundo apellido"
                    value={
                      newValues.apellido2 === null
                        ? ""
                        : newValues.apellido2 || ""
                    }
                    onChange={handleChange}
                    className={errors.apellido2 ? "error" : ""}
                  />
                  {errors.apellido2 && (
                    <div className="field-error">{errors.apellido2}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FiMail className="input-icon" />
                    <span>Email</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly
                    className="input-readonly"
                  />
                  <div className="field-info">
                    El correo electrónico no puede ser modificado.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isParticipante && (
            <div className="profile-edit-card">
              <div className="profile-edit-card-header">
                <h2>Datos de participante</h2>
              </div>
              <div className="profile-edit-card-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dni">
                      <FiCreditCard className="input-icon" />
                      <span>DNI</span>
                      <span className="current-value">
                        Actual: {profile.dni}
                      </span>
                    </label>
                    <input
                      id="dni"
                      name="dni"
                      type="text"
                      placeholder="Nuevo DNI"
                      value={newValues.dni === null ? "" : newValues.dni || ""}
                      onChange={handleChange}
                      className={errors.dni ? "error" : ""}
                    />
                    {errors.dni && (
                      <div className="field-error">{errors.dni}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">
                      <FiPhone className="input-icon" />
                      <span>Teléfono</span>
                      <span className="current-value">
                        Actual: {profile.telefono}
                      </span>
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="Nuevo teléfono"
                      value={
                        newValues.telefono === null
                          ? ""
                          : newValues.telefono || ""
                      }
                      onChange={handleChange}
                      className={errors.telefono ? "error" : ""}
                    />
                    {errors.telefono && (
                      <div className="field-error">{errors.telefono}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="direccion">
                      <FiMapPin className="input-icon" />
                      <span>Dirección</span>
                      <span className="current-value">
                        Actual: {profile.direccion || "No establecida"}
                      </span>
                    </label>
                    <input
                      id="direccion"
                      name="direccion"
                      type="text"
                      placeholder="Nueva dirección"
                      value={
                        newValues.direccion === null
                          ? ""
                          : newValues.direccion || ""
                      }
                      onChange={handleChange}
                      className={errors.direccion ? "error" : ""}
                    />
                    {errors.direccion && (
                      <div className="field-error">{errors.direccion}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isOrganizador && (
            <div className="profile-edit-card">
              <div className="profile-edit-card-header">
                <h2>Datos de organizador</h2>
              </div>
              <div className="profile-edit-card-content">
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="nombre_organizacion">
                      <FiBriefcase className="input-icon" />
                      <span>Nombre de la organización</span>
                      <span className="current-value">
                        Actual: {profile.nombre_organizacion}
                      </span>
                    </label>
                    <input
                      id="nombre_organizacion"
                      name="nombre_organizacion"
                      type="text"
                      placeholder="Nuevo nombre de organización"
                      value={
                        newValues.nombre_organizacion === null
                          ? ""
                          : newValues.nombre_organizacion || ""
                      }
                      onChange={handleChange}
                      className={errors.nombre_organizacion ? "error" : ""}
                    />
                    {errors.nombre_organizacion && (
                      <div className="field-error">
                        {errors.nombre_organizacion}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cif">
                      <FiCreditCard className="input-icon" />
                      <span>CIF</span>
                      <span className="current-value">
                        Actual: {profile.cif || "No establecido"}
                      </span>
                    </label>
                    <input
                      id="cif"
                      name="cif"
                      type="text"
                      placeholder="Nuevo CIF"
                      value={newValues.cif === null ? "" : newValues.cif || ""}
                      onChange={handleChange}
                      className={errors.cif ? "error" : ""}
                    />
                    {errors.cif && (
                      <div className="field-error">{errors.cif}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono_contacto">
                      <FiPhone className="input-icon" />
                      <span>Teléfono de contacto</span>
                      <span className="current-value">
                        Actual: {profile.telefono_contacto}
                      </span>
                    </label>
                    <input
                      id="telefono_contacto"
                      name="telefono_contacto"
                      type="tel"
                      placeholder="Nuevo teléfono de contacto"
                      value={
                        newValues.telefono_contacto === null
                          ? ""
                          : newValues.telefono_contacto || ""
                      }
                      onChange={handleChange}
                      className={errors.telefono_contacto ? "error" : ""}
                    />
                    {errors.telefono_contacto && (
                      <div className="field-error">
                        {errors.telefono_contacto}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="direccion_fiscal">
                      <FiHome className="input-icon" />
                      <span>Dirección fiscal</span>
                      <span className="current-value">
                        Actual: {profile.direccion_fiscal || "No establecida"}
                      </span>
                    </label>
                    <input
                      id="direccion_fiscal"
                      name="direccion_fiscal"
                      type="text"
                      placeholder="Nueva dirección fiscal"
                      value={
                        newValues.direccion_fiscal === null
                          ? ""
                          : newValues.direccion_fiscal || ""
                      }
                      onChange={handleChange}
                      className={errors.direccion_fiscal ? "error" : ""}
                    />
                    {errors.direccion_fiscal && (
                      <div className="field-error">
                        {errors.direccion_fiscal}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="profile-edit-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={saving}
            >
              Cancelar
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? (
                <>
                  <div className="button-spinner"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FiSave />
                  <span>Guardar cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
