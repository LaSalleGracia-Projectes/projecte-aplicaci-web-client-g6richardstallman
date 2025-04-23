"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { setStoredUser } from "../../../utils/user";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
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
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.messages || data.message || "Error al iniciar sesión");
      } else {
        setSuccess("Login exitoso");
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          // Fetch perfil y guardar info básica
          const profileRes = await fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          const profileData = await profileRes.json();
          if (profileData?.data) setStoredUser(profileData.data);
        }
        // Aquí puedes redirigir o actualizar el estado global si lo necesitas
      }
    } catch (err) {
      setError("Error de red o del servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/google");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Error al conectar con Google");
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleGoogleAuth}
        style={{
          marginTop: 16,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <Image src="/googleIcon.png" alt="Google" width={20} height={20} />
        Continuar con Google
      </button>
      <div style={{ marginTop: 10 }}>
        <Link href="/auth/reset-password">¿Has olvidado la contraseña?</Link>
      </div>
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
