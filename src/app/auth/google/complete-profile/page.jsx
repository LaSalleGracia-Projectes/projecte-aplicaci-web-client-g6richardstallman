"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    dni: "",
    telefono: "",
    nombre_organizacion: "",
    telefono_contacto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Opcional: podrías cargar datos actuales del perfil si existen
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm((prev) => ({
      ...prev,
      dni: "",
      telefono: "",
      nombre_organizacion: "",
      telefono_contacto: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No hay sesión activa");
        setLoading(false);
        return;
      }
      // Construir payload según rol
      let payload = {
        role,
        nombre: form.nombre,
        apellido1: form.apellido1,
        apellido2: form.apellido2,
      };
      if (role === "participante") {
        payload.dni = form.dni;
        payload.telefono = form.telefono;
      } else if (role === "organizador") {
        payload.nombre_organizacion = form.nombre_organizacion;
        payload.telefono_contacto = form.telefono_contacto;
      }
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
        router.replace("/");
      }
    } catch (err) {
      setError("Error de red o del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Completa tu perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Primer Apellido</label>
          <input name="apellido1" value={form.apellido1} onChange={handleChange} required />
        </div>
        <div>
          <label>Segundo Apellido</label>
          <input name="apellido2" value={form.apellido2} onChange={handleChange} />
        </div>
        <div>
          <label>Rol</label>
          <select name="role" value={role} onChange={handleRoleChange} required>
            <option value="">Selecciona un rol</option>
            <option value="participante">Participante</option>
            <option value="organizador">Organizador</option>
          </select>
        </div>
        {role === "participante" && (
          <>
            <div>
              <label>DNI</label>
              <input name="dni" value={form.dni} onChange={handleChange} required />
            </div>
            <div>
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} required />
            </div>
          </>
        )}
        {role === "organizador" && (
          <>
            <div>
              <label>Nombre de la organización</label>
              <input name="nombre_organizacion" value={form.nombre_organizacion} onChange={handleChange} required />
            </div>
            <div>
              <label>Teléfono de contacto</label>
              <input name="telefono_contacto" value={form.telefono_contacto} onChange={handleChange} required />
            </div>
          </>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Guardando..." : "Guardar perfil"}
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
    </div>
  );
}
