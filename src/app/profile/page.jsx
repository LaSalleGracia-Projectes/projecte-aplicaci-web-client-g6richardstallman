"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "../../services/user.service";
import { authService } from "../../services/auth.service";
import { useNotification } from "../../context/NotificationContext";
import {
  FiUser,
  FiMail,
  FiTag,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiBriefcase,
  FiHome,
} from "react-icons/fi";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = userService.getStoredUserInfo();
        if (storedUser) {
          setProfile(storedUser);
          setLoading(false);

          try {
            const { data } = await userService.getProfile();
            if (data) {
              setProfile(data);
              userService.storeUserInfo(data);
            }
          } catch (backgroundError) {
            console.error(
              "Error actualizando perfil en segundo plano:",
              backgroundError
            );

            // Si hay un error 500, podría ser un problema con el token
            if (backgroundError.status === 500) {
              showError(
                "Se ha detectado un problema con tu sesión. Por favor, vuelve a iniciar sesión."
              );
              setTimeout(() => {
                userService.clearUserInfo();
                authService.redirectToLogin(router);
              }, 2000);
            }
          }
          return;
        }

        const { data } = await userService.getProfile();
        if (data) {
          setProfile(data);
          userService.storeUserInfo(data);
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403 || err.status === 500) {
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

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  if (loading)
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Cargando tu perfil...</p>
      </div>
    );

  if (!profile) return null;

  const isParticipante = profile.tipo_usuario?.toLowerCase() === "participante";
  const isOrganizador = profile.tipo_usuario?.toLowerCase() === "organizador";

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-title">
            <h1>
              {profile.nombre} {profile.apellido1} {profile.apellido2 || ""}
            </h1>
            <div className="profile-badge">{profile.tipo_usuario}</div>
          </div>
        </div>
        <button onClick={handleEditProfile} className="profile-edit-button">
          Editar perfil
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Información personal</h2>
          </div>
          <div className="profile-card-content">
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FiMail />
              </div>
              <div className="profile-info-text">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{profile.email}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FiTag />
              </div>
              <div className="profile-info-text">
                <span className="profile-info-label">Tipo de usuario</span>
                <span className="profile-info-value">
                  {profile.tipo_usuario}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isParticipante && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Datos de participante</h2>
            </div>
            <div className="profile-card-content">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiCreditCard />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">DNI</span>
                  <span className="profile-info-value">
                    {profile.dni || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiPhone />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">Teléfono</span>
                  <span className="profile-info-value">
                    {profile.telefono || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiMapPin />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">Dirección</span>
                  <span className="profile-info-value">
                    {profile.direccion || "No especificada"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isOrganizador && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Datos de organizador</h2>
            </div>
            <div className="profile-card-content">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiBriefcase />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">
                    Nombre organización
                  </span>
                  <span className="profile-info-value">
                    {profile.nombre_organizacion || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiCreditCard />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">CIF</span>
                  <span className="profile-info-value">
                    {profile.cif || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiPhone />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">
                    Teléfono de contacto
                  </span>
                  <span className="profile-info-value">
                    {profile.telefono_contacto || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiHome />
                </div>
                <div className="profile-info-text">
                  <span className="profile-info-label">Dirección fiscal</span>
                  <span className="profile-info-value">
                    {profile.direccion_fiscal || "No especificada"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="profile-actions-grid">
          <button
            onClick={() => router.push("/profile/change-password")}
            className="profile-action-btn"
          >
            Cambiar contraseña
          </button>

          {isParticipante && (
            <>
              <button
                onClick={() => router.push("/profile/favorites")}
                className="profile-action-btn profile-action-favorites"
              >
                Mis favoritos
              </button>
              <button
                onClick={() => router.push("/profile/tickets")}
                className="profile-action-btn profile-action-tickets"
              >
                Mis entradas
              </button>
            </>
          )}

          {isOrganizador && (
            <button
              onClick={() => router.push("/profile/events")}
              className="profile-action-btn profile-action-events"
            >
              Gestionar eventos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
