"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventsService } from "../../../../../services/events.service";
import { userService } from "../../../../../services/user.service";
import { useNotification } from "../../../../../context/NotificationContext";
import { 
  FiCalendar, FiClock, FiMapPin, FiTag, FiEdit, 
  FiImage, FiAlertTriangle, FiCheck, FiArrowLeft, 
  FiInfo, FiGlobe, FiLoader 
} from "react-icons/fi";
import "./edit-event.css";
import EventImage from "../../../../../components/EventImage";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { showSuccess, showError, showInfo } = useNotification();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [imageUploadDisabled, setImageUploadDisabled] = useState(false);

  // Categorías predefinidas
  const categories = [
    'Música', 'Deportes', 'Arte', 'Teatro', 'Cine', 
    'Tecnología', 'Gastronomía', 'Moda', 'Literatura', 'Educación',
    'Networking', 'Conferencias', 'Festivales', 'Exposiciones', 'Turismo'
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

  // Cargar datos del evento y verificar permisos
  useEffect(() => {
    const checkPermissionAndLoadEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Verificar si el usuario está autenticado
        const user = userService.getStoredUserInfo();
        if (!user) {
          showError("Debes iniciar sesión para editar un evento");
          router.replace('/auth/login');
          return;
        }

        // Obtener detalles del evento
        const result = await eventsService.getEventById(id);
        
        if (!result.evento) {
          setError('Evento no encontrado');
          return;
        }

        setOriginalEvent(result.evento);
        
        // Verificar si el usuario es el organizador de este evento
        try {
          const myEvents = await eventsService.getMyEvents();
          
          const events = Array.isArray(myEvents) ? myEvents : 
                        Array.isArray(myEvents.eventos) ? myEvents.eventos : 
                        Array.isArray(myEvents.data) ? myEvents.data : [];
          
          const isUserEvent = events.some(
            (evento) => evento.idEvento?.toString() === id.toString()
          );
          
          if (!isUserEvent) {
            setError('No tienes permiso para editar este evento');
            return;
          }
        } catch (err) {
          console.error("Error verificando permisos:", err);
          setError('Error al verificar permisos. Intente nuevamente más tarde.');
          return;
        }

        // Configurar datos del formulario
        const event = result.evento;
        const eventDate = new Date(event.fechaEvento || event.fecha);
        
        setFormData({
          titulo: event.nombreEvento || event.titulo,
          descripcion: event.descripcion || "",
          fecha: eventDate.toISOString().split('T')[0],
          hora: event.hora || "12:00",
          ubicacion: event.ubicacion || "",
          categoria: event.categoria || "",
          es_online: event.es_online === true || event.es_online === "1" || event.es_online === 1,
        });
        
        // Configurar imagen de vista previa si existe
        if (event.imagen_url) {
          setCurrentImageUrl(event.imagen_url);
        }
      } catch (err) {
        console.error("Error cargando evento:", err);
        if (err.status === 401) {
          showError("Sesión expirada. Por favor inicia sesión nuevamente.");
          router.replace('/auth/login');
          return;
        }
        setError('Error al cargar los datos del evento');
      } finally {
        setLoading(false);
      }
    };

    checkPermissionAndLoadEvent();
  }, [id, router, showError]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Limpiar error cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [formErrors]);

  // Manejar cambio de imagen
  const handleImageChange = useCallback((e) => {
    if (imageUploadDisabled) {
      showInfo("La subida de imágenes está temporalmente deshabilitada");
      return;
    }
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showError("Por favor, selecciona un archivo de imagen válido");
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("La imagen no debe superar los 5MB");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      imagen: file
    }));
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setCurrentImageUrl(null);
    };
    reader.readAsDataURL(file);
    
    // Limpiar error de imagen
    if (formErrors.imagen) {
      setFormErrors(prev => ({
        ...prev,
        imagen: null
      }));
    }
  }, [formErrors, imageUploadDisabled, showError, showInfo]);

  // Validar formulario antes de enviar
  const validateForm = useCallback(() => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Validar campos principales
    if (!formData.titulo?.trim()) errors.titulo = "El título es obligatorio";
    if (!formData.descripcion?.trim()) errors.descripcion = "La descripción es obligatoria";
    if (!formData.fecha) {
      errors.fecha = "La fecha es obligatoria";
    } else {
      const eventDate = new Date(formData.fecha);
      eventDate.setHours(0, 0, 0, 0);
      
      if (originalEvent) {
        const originalDate = new Date(originalEvent.fechaEvento || originalEvent.fecha);
        originalDate.setHours(0, 0, 0, 0);
        
        // Si la fecha original es anterior a hoy, permitir mantenerla
        if (originalDate < today && eventDate < today && eventDate.getTime() === originalDate.getTime()) {
          // Permitir mantener la fecha original
        } else if (eventDate < today) {
          errors.fecha = "La fecha no puede ser anterior a hoy";
        }
      } else if (eventDate < today) {
        errors.fecha = "La fecha no puede ser anterior a hoy";
      }
    }
    
    if (!formData.hora) errors.hora = "La hora es obligatoria";
    if (!formData.ubicacion?.trim()) errors.ubicacion = "La ubicación es obligatoria";
    if (!formData.categoria) errors.categoria = "La categoría es obligatoria";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, originalEvent]);

  // Enviar formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError("Por favor, corrige los errores en el formulario");
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Preparar los datos para enviar
      const dataToSend = { ...formData };
      
      if (imageUploadDisabled) {
        dataToSend.imagen = null;
      }

      // Log para depuración
      console.log("Datos a enviar:", dataToSend);
      
      // Asegurarnos que los valores booleanos se envíen correctamente
      dataToSend.es_online = dataToSend.es_online ? true : false;

      const result = await eventsService.updateEvent(id, dataToSend);
      
      showSuccess("Evento actualizado correctamente");
      setTimeout(() => {
        router.push(`/profile/events`);
      }, 1500);
    } catch (err) {
      console.error("Error al actualizar evento:", err);
      
      if (err.status === 422) {
        // Error de validación
        showError("El servidor rechazó algunos datos. Comprueba los campos del formulario.");
        console.log("Errores de validación:", err.errors);
      } else if (err.errors?.message?.includes("imagecreatetruecolor")) {
        setImageUploadDisabled(true);
        showInfo("El servidor no puede procesar imágenes en este momento. Intenta guardar sin cambiar la imagen.");
        
        // Limpiar la imagen para que el usuario pueda intentar guardar sin ella
        setFormData(prev => ({
          ...prev,
          imagen: null
        }));
        setImagePreview(null);
        // Restaurar la imagen original si estaba disponible
        if (originalEvent && originalEvent.imagen_url) {
          setCurrentImageUrl(originalEvent.imagen_url);
        }
      } else if (err.status === 401) {
        showError("Sesión expirada. Por favor inicia sesión nuevamente.");
        setTimeout(() => router.replace('/auth/login'), 2000);
      } else if (err.status === 403) {
        showError("No tienes permiso para editar este evento");
      } else if (err.status === 405) {
        showError("El servidor no permite este método de actualización. Contacta al administrador.");
        console.error("Error detallado:", err);
      } else {
        showError("Error al actualizar el evento. Por favor, inténtalo nuevamente más tarde");
      }
    } finally {
      setSaving(false);
    }
  }, [formData, id, imageUploadDisabled, originalEvent, router, showError, showSuccess, validateForm]);

  // Mejorada la accesibilidad para subir imágenes desde el div
  const triggerFileInput = useCallback(() => {
    if (!imageUploadDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [imageUploadDisabled]);

  // Gestionar la navegación de regreso
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // Navegar a la gestión de entradas
  const goToManageTickets = useCallback(() => {
    router.push(`/events/${id}/manage-tickets`);
  }, [id, router]);

  // Mostrar estado de carga inicial
  if (loading) {
    return (
      <div className="edit-event-loading">
        <div className="edit-event-spinner"></div>
        <p>Cargando evento...</p>
      </div>
    );
  }

  // Mostrar mensaje de error si no se puede editar
  if (error) {
    return (
      <div className="edit-event-error">
        <FiAlertTriangle size={60} />
        <h2>No se puede editar el evento</h2>
        <p>{error}</p>
        <button 
          onClick={goBack}
          className="back-button"
        >
          <FiArrowLeft /> Volver
        </button>
      </div>
    );
  }

  return (
    <div className="edit-event-container">
      <div className="edit-event-header">
        <button 
          onClick={() => router.push("/profile/events")} 
          className="edit-event-back-button"
          type="button"
          aria-label="Volver a mis eventos"
        >
          <FiArrowLeft /> <span>Volver a mis eventos</span>
        </button>
        <h1><FiEdit /> Editar evento</h1>
      </div>
      
      <div className="edit-event-tip">
        <FiInfo />
        <p>Los campos marcados con <span className="required-mark">*</span> son obligatorios. Si deseas modificar los tipos de entradas, ve a la sección "Gestionar Entradas".</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-grid">
          {/* Columna izquierda */}
          <div className="form-column">
            <div className="form-section">
              <h2>Información básica</h2>
              
              <div className="form-group">
                <label htmlFor="titulo">
                  <FiEdit /> Título del evento <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className={formErrors.titulo ? "error" : ""}
                  placeholder="Ej. Concierto de Rock en Vivo"
                  maxLength={100}
                />
                {formErrors.titulo && <div className="error-message">{formErrors.titulo}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="descripcion">
                  <FiInfo /> Descripción <span className="required-mark">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className={formErrors.descripcion ? "error" : ""}
                  rows={5}
                  placeholder="Describe tu evento detalladamente"
                  maxLength={1000}
                ></textarea>
                {formErrors.descripcion && <div className="error-message">{formErrors.descripcion}</div>}
                <small className="char-counter">{formData.descripcion.length}/1000</small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha">
                    <FiCalendar /> Fecha <span className="required-mark">*</span>
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className={formErrors.fecha ? "error" : ""}
                  />
                  {formErrors.fecha && <div className="error-message">{formErrors.fecha}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="hora">
                    <FiClock /> Hora <span className="required-mark">*</span>
                  </label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    className={formErrors.hora ? "error" : ""}
                  />
                  {formErrors.hora && <div className="error-message">{formErrors.hora}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="categoria">
                  <FiTag /> Categoría <span className="required-mark">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={formErrors.categoria ? "error" : ""}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {formErrors.categoria && <div className="error-message">{formErrors.categoria}</div>}
              </div>
              
              <div className="form-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="es_online"
                    name="es_online"
                    checked={formData.es_online}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="es_online" className="checkbox-label">
                    <FiGlobe /> Es un evento online
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="ubicacion">
                  <FiMapPin /> Ubicación <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className={formErrors.ubicacion ? "error" : ""}
                  placeholder={formData.es_online ? "URL o plataforma (Zoom, Teams, etc.)" : "Dirección física"}
                  maxLength={255}
                />
                {formErrors.ubicacion && <div className="error-message">{formErrors.ubicacion}</div>}
              </div>
            </div>
          </div>
          
          {/* Columna derecha */}
          <div className="form-column">
            <div className="form-section">
              <h2>Imagen del evento</h2>
              <div className="image-upload-container">
                {imageUploadDisabled ? (
                  <div className="image-upload-disabled">
                    <FiAlertTriangle size={40} />
                    <p>Las imágenes están temporalmente deshabilitadas</p>
                    <small>El servidor no puede procesar imágenes en este momento. Tu evento se actualizará manteniendo la imagen actual.</small>
                  </div>
                ) : imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Vista previa de nueva imagen" />
                    <button 
                      type="button" 
                      className="remove-image-button" 
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, imagen: null }));
                        if (originalEvent?.imagen_url) {
                          setCurrentImageUrl(originalEvent.imagen_url);
                        }
                      }}
                      aria-label="Cancelar cambio de imagen"
                    >
                      <FiEdit />
                    </button>
                  </div>
                ) : currentImageUrl ? (
                  <div className="image-preview current-image">
                    <EventImage 
                      src={currentImageUrl} 
                      alt="Imagen actual del evento" 
                      width={400}
                      height={240}
                      className="event-image"
                      fallbackIcon={<FiImage size={60} />}
                      fallbackText="Imagen no disponible"
                    />
                    <button 
                      type="button" 
                      className="change-image-button" 
                      onClick={triggerFileInput}
                      aria-label="Cambiar imagen"
                    >
                      <FiEdit />
                      <span>Cambiar</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    className="image-placeholder"
                    onClick={triggerFileInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        triggerFileInput();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Subir imagen del evento"
                  >
                    <FiImage size={40} />
                    <p>Haz clic para subir una imagen</p>
                    <span className="image-format-info">Formatos: JPG, PNG, GIF (máx. 5MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  disabled={imageUploadDisabled}
                />
                {formErrors.imagen && <div className="error-message">{formErrors.imagen}</div>}
              </div>
            </div>
            
            <div className="form-section ticket-info-section">
              <h2>Entradas</h2>
              <p className="tickets-info-message">
                Para gestionar los tipos de entradas, añadir nuevos tipos o modificar los existentes,
                usa la sección de "Gestionar Entradas" después de guardar los cambios básicos.
              </p>
              
              <button 
                type="button"
                className="go-to-tickets-button"
                onClick={goToManageTickets}
              >
                <FiCalendar /> Gestionar Entradas
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={goBack}
            className="cancel-button"
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="button-spinner"></div>
                Guardando cambios...
              </>
            ) : (
              <>
                <FiCheck /> Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
