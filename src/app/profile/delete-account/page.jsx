"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../../utils/logout";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirm_deletion: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      const res = await fetch("http://localhost:8000/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.messages || data.message || "Error al eliminar la cuenta");
      } else {
        setSuccess("Cuenta eliminada correctamente");
        setTimeout(() => {
          logout(router);
        }, 1200);
      }
    } catch (err) {
      setError("Error de red o del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Eliminar cuenta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Contraseña</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ margin: '12px 0' }}>
          <label>
            <input
              type="checkbox"
              name="confirm_deletion"
              checked={form.confirm_deletion}
              onChange={handleChange}
              required
            />
            &nbsp;Confirmo que deseo eliminar mi cuenta y todos mis datos.
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ background: 'red', color: 'white', marginTop: 16 }}>
          {loading ? "Eliminando..." : "Eliminar cuenta"}
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
