"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
          setForm({ ...data.data });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No hay sesión activa");
      setSaving(false);
      return;
    }
    // Construir payload solo con campos editables
    const payload = {
      nombre: form.nombre,
      apellido1: form.apellido1,
      apellido2: form.apellido2,
      email: form.email,
    };
    if (profile.role === "participante") {
      payload.dni = form.dni;
      payload.telefono = form.telefono;
    } else if (profile.role === "organizador") {
      payload.nombre_organizacion = form.nombre_organizacion;
      payload.telefono_contacto = form.telefono_contacto;
    }
    try {
      const res = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.messages || data.message || "Error al actualizar perfil");
      } else {
        setSuccess("Perfil actualizado correctamente");
        setProfile(data.data);
        setTimeout(() => {
          router.replace("/profile");
        }, 1200);
      }
    } catch (err) {
      setError("Error de red o del servidor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>Editar perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre || ""} onChange={handleChange} required />
        </div>
        <div>
          <label>Primer Apellido</label>
          <input name="apellido1" value={form.apellido1 || ""} onChange={handleChange} required />
        </div>
        <div>
          <label>Segundo Apellido</label>
          <input name="apellido2" value={form.apellido2 || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email || ""} onChange={handleChange} required />
        </div>
        {profile.role === "participante" && (
          <>
            <div>
              <label>DNI</label>
              <input name="dni" value={form.dni || ""} onChange={handleChange} required />
            </div>
            <div>
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono || ""} onChange={handleChange} required />
            </div>
          </>
        )}
        {profile.role === "organizador" && (
          <>
            <div>
              <label>Nombre organización</label>
              <input name="nombre_organizacion" value={form.nombre_organizacion || ""} onChange={handleChange} required />
            </div>
            <div>
              <label>Teléfono de contacto</label>
              <input name="telefono_contacto" value={form.telefono_contacto || ""} onChange={handleChange} required />
            </div>
          </>
        )}
        <button type="submit" disabled={saving} style={{ marginTop: 16 }}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
      {error && (
        <div style={{ color: "red", marginTop: 10 }}>
          {typeof error === "string" ? error : (
            <ul>
              {Object.values(error).map((msg, i) => (
                <li key={i}>{Array.isArray(msg) ? msg.join(", ") : msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
    </div>
  );
}
