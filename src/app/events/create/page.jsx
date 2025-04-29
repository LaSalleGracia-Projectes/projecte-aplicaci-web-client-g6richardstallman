"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "../../../services/events.service";
import { FiX, FiPlusCircle, FiImage, FiAlertCircle } from "react-icons/fi";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    es_online: false,
    tipos_entrada: [
      {
        nombre: "Entrada General",
        precio: "",
        descripcion: "",
        es_ilimitado: false,
        cantidad_disponible: "",
      },
    ],
  });
  
  const [previewImage, setPreviewImage] = useState(null);

  // Gestionar cambios en los campos del formulario general
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Gestionar cambios en la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file,
      });
      
      // Crear URL para previsualización
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  // Gestionar cambios en los tipos de entrada
  const handleTicketTypeChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTicketTypes = [...formData.tipos_entrada];
    updatedTicketTypes[index] = {
      ...updatedTicketTypes[index],
      [name]: type === "checkbox" ? checked : value,
    };
    
    setFormData({
      ...formData,
      tipos_entrada: updatedTicketTypes,
    });
  };

  // Añadir un nuevo tipo de entrada
  const addTicketType = () => {
    setFormData({
      ...formData,
      tipos_entrada: [
        ...formData.tipos_entrada,
        {
          nombre: "",
          precio: "",
          descripcion: "",
          es_ilimitado: false,
          cantidad_disponible: "",
        },
      ],
    });
  };

  // Eliminar un tipo de entrada
  const removeTicketType = (index) => {
    if (formData.tipos_entrada.length > 1) {
      const updatedTicketTypes = formData.tipos_entrada.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        tipos_entrada: updatedTicketTypes,
      });
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await createEvent(formData);
      
      if (result.status === 'error') {
        setError(result.message || "Error al crear el evento");
      } else {
        setSuccessMessage("Evento creado correctamente");
        setTimeout(() => {
          router.push('/profile/events');
        }, 2000);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Crear Nuevo Evento</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: "#fef2f2", 
          color: "#b91c1c", 
          padding: "12px", 
          borderRadius: "6px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <FiAlertCircle />
          <div>
            {typeof error === "string" ? error : "Error en el formulario"}
          </div>
        </div>
      )}
      
      {successMessage && (
        <div style={{ 
          backgroundColor: "#f0fdf4", 
          color: "#166534", 
          padding: "12px", 
          borderRadius: "6px",
          marginBottom: "20px"
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Título del evento *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Hora *
            </label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Ubicación *
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Categoría *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer", marginBottom: "6px" }}>
            <input
              type="checkbox"
              name="es_online"
              checked={formData.es_online}
              onChange={handleInputChange}
              style={{ marginRight: "8px" }}
            />
            <span>Evento online</span>
          </label>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Imagen del evento
          </label>
          
          {previewImage ? (
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <img
                src={previewImage}
                alt="Vista previa"
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData({ ...formData, imagen: null });
                }}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("imagen").click()}
            >
              <FiImage size={32} style={{ margin: "0 auto 10px" }} />
              <p>Haz clic para subir una imagen</p>
            </div>
          )}
          
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <small style={{ color: "#6b7280" }}>
            La imagen es opcional. Se usará una imagen predeterminada si no se sube ninguna.
          </small>
        </div>

        <div style={{ marginBottom: "20px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.2rem" }}>Tipos de entrada</h3>
          
          {formData.tipos_entrada.map((ticket, index) => (
            <div 
              key={index}
              style={{ 
                marginBottom: "20px", 
                padding: "15px", 
                backgroundColor: "#f9fafb", 
                borderRadius: "6px",
                position: "relative"
              }}
            >
              {formData.tipos_entrada.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  <FiX size={20} />
                </button>
              )}
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                  Nombre del tipo de entrada *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={ticket.nombre}
                  onChange={(e) => handleTicketTypeChange(index, e)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                  Precio (€) *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={ticket.precio}
                  onChange={(e) => handleTicketTypeChange(index, e)}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={ticket.descripcion}
                  onChange={(e) => handleTicketTypeChange(index, e)}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="es_ilimitado"
                    checked={ticket.es_ilimitado}
                    onChange={(e) => handleTicketTypeChange(index, e)}
                    style={{ marginRight: "8px" }}
                  />
                  <span>Entradas ilimitadas</span>
                </label>
              </div>
              
              {!ticket.es_ilimitado && (
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                    Cantidad disponible *
                  </label>
                  <input
                    type="number"
                    name="cantidad_disponible"
                    value={ticket.cantidad_disponible}
                    onChange={(e) => handleTicketTypeChange(index, e)}
                    required
                    min="1"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTicketType}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "1px dashed #d1d5db",
              borderRadius: "4px",
              padding: "8px 15px",
              cursor: "pointer",
              width: "100%",
              justifyContent: "center",
              color: "#4b5563"
            }}
          >
            <FiPlusCircle /> Añadir otro tipo de entrada
          </button>
        </div>
        
        <div style={{ marginTop: "30px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "10px 20px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creando evento..." : "Crear Evento"}
          </button>
        </div>
      </form>
    </div>
  );
}
