"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateEvent, getEventById } from "../../../../services/events.service";
import { FiX, FiImage, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Categorías predefinidas
  const categories = [
    'Música', 'Deportes', 'Arte', 'Teatro', 'Cine', 
    'Tecnología', 'Gastronomía', 'Moda', 'Literatura', 'Educación'
  ];
  
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    ubicacion: "",
    categoria: "",
    imagen: null,
    es_online: false
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkPermissionAndLoadEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Get event details
        const result = await getEventById(id);
        
        if (!result.evento) {
          setError('Evento no encontrado');
          return;
        }
        
        // Check if user is the organizer of this event
        try {
          const myEventsRes = await fetch('http://localhost:8000/api/mis-eventos', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const myEventsData = await myEventsRes.json();
          
          if (!myEventsRes.ok) {
            throw new Error('No se pudieron verificar los permisos');
          }
          
          const isUserEvent = myEventsData.eventos?.some(
            (evento) => evento.idEvento.toString() === id.toString()
          );
          
          if (!isUserEvent) {
            setError('No tienes permiso para editar este evento');
            setIsOwner(false);
            return;
          }
          
          setIsOwner(true);
        } catch (err) {
          console.error("Error verificando permisos:", err);
          setError('Error al verificar permisos para editar el evento');
          return;
        }

        // Set form data from event
        const event = result.evento;
        setFormData({
          titulo: event.nombreEvento,
          descripcion: event.descripcion,
          fecha: new Date(event.fechaEvento).toISOString().split('T')[0],
          hora: event.hora,
          ubicacion: event.ubicacion,
          categoria: event.categoria,
          es_online: event.es_online === true || event.es_online === "1" || event.es_online === 1,
        });
        
        // Set preview image if exists
        if (event.imagen_url) {
          setCurrentImageUrl(event.imagen_url);
        }
      } catch (err) {
        console.error("Error cargando evento:", err);
        setError('Error al cargar los datos del evento');
      } finally {
        setLoading(false);
      }
    };

    checkPermissionAndLoadEvent();
  }, [id, router]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file,
      });
      
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
      setCurrentImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isOwner) {
      setError('No tienes permisos para editar este evento');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await updateEvent(id, formData);
      
      if (result.status === 'error' || result.error) {
        setError(result.message || result.error || "Error al actualizar el evento");
      } else {
        setSuccessMessage("Evento actualizado correctamente");
        setTimeout(() => {
          router.push(`/events/${id}`);
        }, 1500);
      }
    } catch (err) {
      setError("Error de conexión al guardar los cambios");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Cargando evento...</div>;
  }
  
  if (error && !isOwner) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-red-50 rounded-lg text-center">
        <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
        <h1 className="text-xl font-bold text-red-700 mb-2">Acceso denegado</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Evento</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 flex items-center">
          <FiCheck className="mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Título del evento *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Hora *
            </label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ubicación *
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Categoría *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="es_online"
              checked={formData.es_online}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>Evento online</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Imagen del evento
          </label>
          
          {previewImage ? (
            <div className="relative mb-3">
              <img
                src={previewImage}
                alt="Vista previa"
                className="max-h-48 rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData({ ...formData, imagen: null });
                  if (currentImageUrl) setCurrentImageUrl(currentImageUrl);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              >
                <FiX />
              </button>
            </div>
          ) : currentImageUrl ? (
            <div className="relative mb-3">
              <img
                src={currentImageUrl}
                alt="Imagen actual"
                className="max-h-48 rounded"
              />
              <button
                type="button"
                onClick={() => document.getElementById("imagen").click()}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              >
                <FiEdit />
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer mb-3"
              onClick={() => document.getElementById("imagen").click()}
            >
              <FiImage className="mx-auto text-gray-400 text-3xl mb-2" />
              <p className="text-gray-500">Haz clic para subir una imagen</p>
            </div>
          )}
          
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => router.push(`/events/${id}/manage-tickets`)}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Gestionar Entradas
          </button>
          
          <button
            type="submit"
            disabled={saving || !isOwner}
            className={`px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
