// Dashboard de administración para controlar usuarios y eventos
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Comprobar si el usuario es admin (ajusta la ruta del endpoint según tu backend)
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // Si usas token Bearer:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        const data = await res.json();
        if (data?.data?.role !== 'admin') {
          setError('Acceso denegado. Solo para administradores.');
        } else {
          setUser(data.data);
        }
      } catch (err) {
        setError('Error al cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="mb-8">
        <p className="text-lg">Bienvenido, <span className="font-semibold">{user?.nombre} {user?.apellido1}</span> (Admin)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
          <p className="mb-4">Visualiza, busca, bloquea o elimina usuarios.</p>
          <Link href="/admin/usuarios" className="text-blue-600 hover:underline">Ir a gestión de usuarios</Link>
        </div>
        <div className="border rounded-lg p-6 shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Gestión de Eventos</h2>
          <p className="mb-4">Visualiza, edita o elimina eventos de la plataforma.</p>
          <Link href="/admin/eventos" className="text-blue-600 hover:underline">Ir a gestión de eventos</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
