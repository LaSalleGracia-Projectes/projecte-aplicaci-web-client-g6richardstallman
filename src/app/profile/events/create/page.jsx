"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { eventsService } from "../../../../services/events.service";
import { userService } from "../../../../services/user.service";
import { useNotification } from "../../../../context/NotificationContext";
import { 
  FiCalendar, FiClock, FiMapPin, FiTag, 
  FiEdit, FiTrash2, FiPlus, FiImage, 
  FiDollarSign, FiPackage, FiX, FiInfo,
  FiCheck, FiArrowLeft, FiGlobe, FiHash,
  FiAlertTriangle
} from "react-icons/fi";
import "./create-event.css";

export default function CreateEventPage() {
  const router = useRouter();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadDisabled, setImageUploadDisabled] = useState(false);
  const [technicalError, setTechnicalError] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  const [categories, setCategories] = useState([
    'Música', 'Deportes', 'Arte', 'Teatro', 'Cine', 
    'Tecnología', 'Gastronomía', 'Moda', 'Literatura', 'Educación',
    'Networking', 'Conferencias', 'Festivales', 'Exposiciones', 'Turismo'
  ]);
  
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
        nombre: "General",
        precio: "",
        descripcion: "Entrada estándar",
        es_ilimitado: false,
        cantidad_disponible: 100,
      },
    ],
  });

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const user = userService.getStoredUserInfo();
        
        if (!user) {
          try {
            const profileData = await userService.getProfile();
            const data = profileData.data || profileData;
            
            if (data?.tipo_usuario?.toLowerCase() !== "organizador") {
              showError("Solo los organizadores pueden crear eventos");
              router.replace("/profile");
              return;
            }
          } catch (err) {
            console.error("Error al verificar tipo de usuario:", err);
            showError("Error al verificar permisos");
            router.replace("/profile");
            return;
          }
        } else if (user.tipo_usuario?.toLowerCase() !== "organizador") {
          showError("Solo los organizadores pueden crear eventos");
          router.replace("/profile");
          return;
        }
      } catch (err) {
        console.error("Error al verificar tipo de usuario:", err);
        showError("Error al verificar permisos");
        router.replace("/profile");
      } finally {
        setInitialLoading(false);
      }
    };

    checkUserType();
  }, [router, showError]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [formErrors]);

  const handleImageChange = useCallback((e) => {
    if (imageUploadDisabled) {
      showInfo("La subida de imágenes está temporalmente deshabilitada");
      return;
    }
    
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showError("Por favor, selecciona un archivo de imagen válido");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showError("La imagen no debe superar los 5MB");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      imagen: file
    }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    if (formErrors.imagen) {
      setFormErrors(prev => ({
        ...prev,
        imagen: null
      }));
    }
  }, [formErrors, imageUploadDisabled, showError, showInfo]);

  const handleTicketTypeChange = useCallback((index, e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const updatedTickets = [...prev.tipos_entrada];
      updatedTickets[index] = {
        ...updatedTickets[index],
        [name]: type === "checkbox" ? checked : value
      };
      return {
        ...prev,
        tipos_entrada: updatedTickets
      };
    });
    
    setFormErrors(prev => {
      const key = `tipos_entrada.${index}.${name}`;
      if (prev[key]) {
        const updatedErrors = {...prev};
        delete updatedErrors[key];
        return updatedErrors;
      }
      return prev;
    });
  }, []);

  const addTicketType = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      tipos_entrada: [
        ...prev.tipos_entrada,
        {
          nombre: "",
          precio: "",
          descripcion: "",
          es_ilimitado: false,
          cantidad_disponible: 50,
        }
      ]
    }));
  }, []);

  const removeTicketType = useCallback((index) => {
    if (formData.tipos_entrada.length <= 1) {
      showInfo("Debe existir al menos un tipo de entrada");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tipos_entrada: prev.tipos_entrada.filter((_, i) => i !== index)
    }));
    
    setFormErrors(prev => {
      const newErrors = {...prev};
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`tipos_entrada.${index}.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, [formData.tipos_entrada.length, showInfo]);

  const validateForm = useCallback(() => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!formData.titulo.trim()) errors.titulo = "El título es obligatorio";
    if (!formData.descripcion.trim()) errors.descripcion = "La descripción es obligatoria";
    if (!formData.fecha) {
      errors.fecha = "La fecha es obligatoria";
    } else {
      const eventDate = new Date(formData.fecha);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate < today) errors.fecha = "La fecha no puede ser anterior a hoy";
    }
    
    if (!formData.hora) errors.hora = "La hora es obligatoria";
    if (!formData.ubicacion.trim()) errors.ubicacion = "La ubicación es obligatoria";
    if (!formData.categoria) errors.categoria = "La categoría es obligatoria";
    
    formData.tipos_entrada.forEach((ticket, index) => {
      if (!ticket.nombre.trim()) errors[`tipos_entrada.${index}.nombre`] = "El nombre es obligatorio";
      
      if (!ticket.precio || isNaN(ticket.precio) || parseFloat(ticket.precio) < 0) {
        errors[`tipos_entrada.${index}.precio`] = "El precio debe ser un número positivo";
      }
      
      if (!ticket.es_ilimitado && (!ticket.cantidad_disponible || 
          parseInt(ticket.cantidad_disponible) <= 0 || 
          isNaN(parseInt(ticket.cantidad_disponible)))) {
        errors[`tipos_entrada.${index}.cantidad_disponible`] = "Cantidad inválida";
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError("Por favor, corrige los errores en el formulario");
      return;
    }
    
    setLoading(true);
    setTechnicalError('');
    
    try {
      const dataToSend = imageUploadDisabled ? 
        { ...formData, imagen: null } : 
        formData;

      const preparedData = {
        ...dataToSend,
        tipos_entrada: dataToSend.tipos_entrada.map(tipo => ({
          ...tipo,
          precio: parseFloat(tipo.precio),
          cantidad_disponible: tipo.es_ilimitado ? null : parseInt(tipo.cantidad_disponible, 10)
        }))
      };

      const result = await eventsService.createEvent(preparedData);
      
      showSuccess("¡Evento creado correctamente!");
      
      setTimeout(() => {
        router.push("/profile/events");
      }, 1500);
    } catch (err) {
      console.error("Error al crear evento:", err);
      
      if (err.errors?.message?.includes("imagecreatetruecolor")) {
        setImageUploadDisabled(true);
        setTechnicalError('Error en el servidor: La función de procesamiento de imágenes no está disponible');
        
        if (formData.imagen) {
          showWarning("El servidor no puede procesar imágenes en este momento. Intenta crear el evento sin imagen.");
          
          setFormData(prev => ({
            ...prev,
            imagen: null
          }));
          setImagePreview(null);
        } else {
          showError("Error en el servidor. Contacta al administrador del sistema.");
        }
      } else if (err.status === 401) {
        showError("Sesión expirada. Por favor, inicia sesión de nuevo.");
        setTimeout(() => router.replace("/auth/login"), 2000);
      } else if (err.status === 403) {
        showError("No tienes permiso para crear eventos");
      } else if (err.errors?.errors) {
        const serverErrors = {};
        Object.entries(err.errors.errors).forEach(([key, value]) => {
          serverErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setFormErrors(serverErrors);
        showError("Hay campos incorrectos en el formulario");
      } else {
        showError("Error al crear el evento. Por favor, inténtalo nuevamente más tarde");
      }
    } finally {
      setLoading(false);
    }
  }, [formData, imageUploadDisabled, router, showError, showSuccess, showWarning, validateForm]);

  const triggerFileInput = useCallback(() => {
    if (!imageUploadDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [imageUploadDisabled]);

  if (initialLoading) {
    return (
      <div className="create-event-loading">
        <div className="create-event-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <button 
          onClick={() => router.push("/profile/events")} 
          className="create-event-back-button"
          type="button"
          aria-label="Volver a mis eventos"
        >
          <FiArrowLeft /> <span>Volver</span>
        </button>
        <h1><FiCalendar /> Crear nuevo evento</h1>
      </div>
      
      <div className="create-event-tip">
        <FiInfo />
        <p>Los campos marcados con <span className="required-mark">*</span> son obligatorios.</p>
      </div>

      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-grid">
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
                  autoComplete="off"
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
                    min={new Date().toISOString().split("T")[0]}
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
                  disabled={categoriesLoading}
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
          
          <div className="form-column">
            <div className="form-section">
              <h2>Imagen del evento</h2>
              <div className="image-upload-container">
                {imageUploadDisabled ? (
                  <div className="image-upload-disabled">
                    <FiAlertTriangle size={40} />
                    <p>Las imágenes están temporalmente deshabilitadas</p>
                    <small>El servidor no puede procesar imágenes en este momento. Tu evento se creará con una imagen predeterminada.</small>
                  </div>
                ) : imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Vista previa" />
                    <button 
                      type="button" 
                      className="remove-image-button" 
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, imagen: null }));
                      }}
                      aria-label="Eliminar imagen"
                    >
                      <FiX />
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
              
              {technicalError && (
                <div className="technical-error">
                  <FiAlertTriangle size={16} />
                  <span>{technicalError}</span>
                </div>
              )}
            </div>
            
            <div className="form-section ticket-types-section">
              <h2><FiPackage /> Tipos de entradas</h2>
              
              <div className="ticket-types-container">
                {formData.tipos_entrada.map((ticket, index) => (
                  <div key={index} className="ticket-type-card">
                    <div className="ticket-type-header">
                      <h3>Tipo de entrada {index + 1}</h3>
                      {formData.tipos_entrada.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeTicketType(index)}
                          className="remove-ticket-button"
                          aria-label="Eliminar este tipo de entrada"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`ticket-name-${index}`}>
                        <FiHash /> Nombre <span className="required-mark">*</span>
                      </label>
                      <input
                        type="text"
                        id={`ticket-name-${index}`}
                        name="nombre"
                        value={ticket.nombre}
                        onChange={(e) => handleTicketTypeChange(index, e)}
                        className={formErrors[`tipos_entrada.${index}.nombre`] ? "error" : ""}
                        placeholder="Ej. VIP, General, Estudiante"
                        maxLength={50}
                      />
                      {formErrors[`tipos_entrada.${index}.nombre`] && (
                        <div className="error-message">{formErrors[`tipos_entrada.${index}.nombre`]}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`ticket-price-${index}`}>
                        <FiDollarSign /> Precio (€) <span className="required-mark">*</span>
                      </label>
                      <input
                        type="number"
                        id={`ticket-price-${index}`}
                        name="precio"
                        value={ticket.precio}
                        onChange={(e) => handleTicketTypeChange(index, e)}
                        className={formErrors[`tipos_entrada.${index}.precio`] ? "error" : ""}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      {formErrors[`tipos_entrada.${index}.precio`] && (
                        <div className="error-message">{formErrors[`tipos_entrada.${index}.precio`]}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`ticket-desc-${index}`}>Descripción</label>
                      <textarea
                        id={`ticket-desc-${index}`}
                        name="descripcion"
                        value={ticket.descripcion}
                        onChange={(e) => handleTicketTypeChange(index, e)}
                        rows={2}
                        placeholder="Describe los beneficios de este tipo de entrada"
                        maxLength={255}
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          id={`ticket-unlimited-${index}`}
                          name="es_ilimitado"
                          checked={ticket.es_ilimitado}
                          onChange={(e) => handleTicketTypeChange(index, e)}
                        />
                        <label htmlFor={`ticket-unlimited-${index}`} className="checkbox-label">
                          <FiCheck /> Entradas ilimitadas
                        </label>
                      </div>
                    </div>
                    
                    {!ticket.es_ilimitado && (
                      <div className="form-group">
                        <label htmlFor={`ticket-quantity-${index}`}>
                          Cantidad disponible <span className="required-mark">*</span>
                        </label>
                        <input
                          type="number"
                          id={`ticket-quantity-${index}`}
                          name="cantidad_disponible"
                          value={ticket.cantidad_disponible}
                          onChange={(e) => handleTicketTypeChange(index, e)}
                          className={formErrors[`tipos_entrada.${index}.cantidad_disponible`] ? "error" : ""}
                          min="1"
                          max="100000"
                        />
                        {formErrors[`tipos_entrada.${index}.cantidad_disponible`] && (
                          <div className="error-message">
                            {formErrors[`tipos_entrada.${index}.cantidad_disponible`]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={addTicketType}
                className="add-ticket-button"
                disabled={formData.tipos_entrada.length >= 5}
                aria-label="Añadir otro tipo de entrada"
              >
                <FiPlus /> Añadir otro tipo de entrada
                {formData.tipos_entrada.length >= 5 && <span> (Máximo 5)</span>}
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => router.push("/profile/events")}
            className="cancel-button"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Creando evento...
              </>
            ) : (
              <>
                <FiCalendar /> Crear evento
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
