'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.messages || data.message || "Error al cambiar la contraseña");
      } else {
        setSuccess("Contraseña cambiada correctamente. Vuelve a iniciar sesión.");
        localStorage.removeItem("access_token");
        setTimeout(() => {
          router.replace("/auth/login");
        }, 1500);
      }
    } catch (err) {
      setError("Error de red o del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Cambiar contraseña</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Contraseña actual</label>
          <input
            name="current_password"
            type="password"
            value={form.current_password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nueva contraseña</label>
          <input
            name="new_password"
            type="password"
            value={form.new_password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div>
          <label>Confirmar nueva contraseña</label>
          <input
            name="confirm_password"
            type="password"
            value={form.confirm_password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Cambiando..." : "Cambiar contraseña"}
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