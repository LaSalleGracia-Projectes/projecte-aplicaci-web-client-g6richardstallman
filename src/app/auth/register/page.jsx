'use client';
import { useState } from 'react';

const initialState = {
  nombre: '',
  apellido1: '',
  apellido2: '',
  email: '',
  password: '',
  role: 'participante',
  // Participante
  dni: '',
  telefono: '',
  // Organizador
  nombre_organizacion: '',
  telefono_contacto: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      role: e.target.value,
      // Limpiar campos del otro rol
      dni: '',
      telefono: '',
      nombre_organizacion: '',
      telefono_contacto: '',
    }));
  };

  // Validaciones frontend
  const validate = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!form.apellido1.trim()) errors.apellido1 = 'El primer apellido es obligatorio';
    if (!form.email.trim()) errors.email = 'El email es obligatorio';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'El email debe ser válido';
    if (!form.password) errors.password = 'La contraseña es obligatoria';
    else if (form.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!form.role) errors.role = 'El rol es obligatorio';
    if (form.role === 'participante') {
      if (!form.dni.trim()) errors.dni = 'El DNI es obligatorio';
      else if (!/^\d{8}[A-Z]$/.test(form.dni)) errors.dni = 'El DNI debe tener 8 números y 1 letra mayúscula';
      if (!form.telefono.trim()) errors.telefono = 'El teléfono es obligatorio';
      else if (!/^\+34\d{9}$|^\d{9}$/.test(form.telefono)) errors.telefono = 'El teléfono debe tener 9 dígitos o formato internacional (+34XXXXXXXXX)';
    } else if (form.role === 'organizador') {
      if (!form.nombre_organizacion.trim()) errors.nombre_organizacion = 'El nombre de la organización es obligatorio';
      if (!form.telefono_contacto.trim()) errors.telefono_contacto = 'El teléfono de contacto es obligatorio';
      else if (!/^\+34\d{9}$|^\d{9}$/.test(form.telefono_contacto)) errors.telefono_contacto = 'El teléfono debe tener 9 dígitos o formato internacional (+34XXXXXXXXX)';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setLoading(false);
      return;
    }
    // Preparar payload según rol
    const payload = {
      nombre: form.nombre,
      apellido1: form.apellido1,
      apellido2: form.apellido2,
      email: form.email,
      password: form.password,
      role: form.role,
    };
    if (form.role === 'participante') {
      payload.dni = form.dni;
      payload.telefono = form.telefono;
    } else if (form.role === 'organizador') {
      payload.nombre_organizacion = form.nombre_organizacion;
      payload.telefono_contacto = form.telefono_contacto;
    }
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.messages || data.message || 'Error en el registro');
      } else {
        setSuccess('Registro exitoso. Revisa tu correo para confirmar.');
        setForm(initialState);
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500);
      }
    } catch (err) {
      setError('Error de red o del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
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
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <div>
          <label>Rol</label>
          <select name="role" value={form.role} onChange={handleRoleChange} required>
            <option value="participante">Participante</option>
            <option value="organizador">Organizador</option>
          </select>
        </div>
        {form.role === 'participante' && (
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
        {form.role === 'organizador' && (
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
        <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
      </form>
      {error && (
        <div style={{ color: 'red', marginTop: 10 }}>
          {typeof error === 'string' ? error : (
            <ul>
              {Object.values(error).map((msg, i) => (
                <li key={i}>{Array.isArray(msg) ? msg.join(', ') : msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
    </div>
  );
}