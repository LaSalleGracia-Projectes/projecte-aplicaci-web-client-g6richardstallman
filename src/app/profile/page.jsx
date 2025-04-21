"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../utils/logout";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setProfile(data.data);
        } else {
          setError(data.message || "No se pudo cargar el perfil");
        }
      } catch (err) {
        setError("Error de red o del servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>Mi perfil</h1>
      <div><strong>Nombre:</strong> {profile.nombre}</div>
      <div><strong>Primer Apellido:</strong> {profile.apellido1}</div>
      <div><strong>Segundo Apellido:</strong> {profile.apellido2 || "-"}</div>
      <div><strong>Email:</strong> {profile.email}</div>
      <div><strong>Rol:</strong> {profile.tipo_usuario}</div>
      {profile.role === "participante" && (
        <>
          <div><strong>DNI:</strong> {profile.dni || "-"}</div>
          <div><strong>Teléfono:</strong> {profile.telefono || "-"}</div>
        </>
      )}
      {profile.role === "organizador" && (
        <>
          <div><strong>Nombre organización:</strong> {profile.nombre_organizacion || "-"}</div>
          <div><strong>Teléfono de contacto:</strong> {profile.telefono_contacto || "-"}</div>
        </>
      )}
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button onClick={() => router.push('/profile/edit')}>Editar perfil</button>
        <button onClick={() => router.push('/profile/change-password')}>Cambiar contraseña</button>
        <button onClick={() => router.push('/profile/delete-account')}>Eliminar cuenta</button>
        <button onClick={() => logout(router)} style={{ color: 'red' }}>Cerrar sesión</button>
      </div>
    </div>
  );
}
