"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { userService } from "../../../services/user.service";
import { useNotification } from "../../../context/NotificationContext";
import { FiAlertTriangle, FiShield, FiTrash2, FiX } from "react-icons/fi";
import "./delete-account.css";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirm_deletion: false });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { showSuccess, showError, showWarning } = useNotification();

  // Contador regresivo para la confirmación final - versión simplificada y arreglada
  useEffect(() => {
    let timer;
    if (showConfirmation && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showConfirmation, countdown]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleOpenConfirmation = useCallback((e) => {
    e.preventDefault();
    if (!form.password) {
      showError("Por favor, introduce tu contraseña");
      return;
    }
    if (!form.confirm_deletion) {
      showError("Debes confirmar que deseas eliminar tu cuenta");
      return;
    }
    setShowConfirmation(true);
    setCountdown(5);
  }, [form.password, form.confirm_deletion, showError]);

  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (loading) return; // Prevenir múltiples envíos
    
    setLoading(true);
    
    try {
      // Simplificamos la llamada, solo enviando la contraseña
      await userService.deleteAccount({ 
        password: form.password 
        // No necesitamos enviar confirm_deletion ya que el servicio lo establece como true
      });
      
      setShowConfirmation(false);
      showSuccess("Cuenta eliminada correctamente. Redirigiendo al inicio de sesión...");
      
      // Limpiar datos de sesión y redirigir
      setTimeout(async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
          // Continuar con la redirección incluso si hay error en logout
        } finally {
          router.replace('/auth/login');
        }
      }, 2000);
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      
      if (err.status === 422) {
        // Manejo específico para errores de validación
        const errorMessage = err.errors?.message || 
                             err.errors?.error || 
                             "La contraseña es incorrecta o faltan datos requeridos.";
        showError(errorMessage);
      } else if (err.status === 401 || err.status === 403) {
        showError("Contraseña incorrecta. Por favor, verifica e intenta nuevamente");
      } else {
        showError(err.errors?.message || err.message || "Error al eliminar la cuenta");
      }
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  }, [form.password, router, showError, showSuccess, loading]);

  // Manejar tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showConfirmation && !loading) {
        handleCloseConfirmation();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showConfirmation, handleCloseConfirmation, loading]);
  
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (showConfirmation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showConfirmation]);

  return (
    <div className="delete-account-container">
      <div className="delete-account-header">
        <FiTrash2 className="delete-account-icon" aria-hidden="true" />
        <h1>Eliminar cuenta</h1>
      </div>
      
      <div className="delete-account-warning" role="alert">
        <FiAlertTriangle aria-hidden="true" />
        <div>
          <h2>Advertencia importante</h2>
          <p>La eliminación de la cuenta es permanente. Se borrarán todos tus datos, compras y actividad. Esta acción no se puede deshacer.</p>
        </div>
      </div>

      <div className="delete-account-card">
        <form onSubmit={handleOpenConfirmation} noValidate>
          <div className="form-group">
            <label htmlFor="password">Contraseña actual</label>
            <div className="password-input-container">
              <FiShield className="input-icon" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Introduce tu contraseña actual"
                className="password-input"
                autoComplete="current-password"
                style={{ paddingLeft: "3.25rem" }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-container" htmlFor="confirm_deletion">
              <input
                type="checkbox"
                id="confirm_deletion"
                name="confirm_deletion"
                checked={form.confirm_deletion}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="checkmark" aria-hidden="true"></span>
              <span className="checkbox-text">Confirmo que deseo eliminar mi cuenta y entiendo que todos mis datos serán eliminados permanentemente.</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => router.push('/profile')}
              className="cancel-button"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || !form.password || !form.confirm_deletion}
              className="delete-button"
              aria-busy={loading ? "true" : "false"}
            >
              Solicitar eliminación
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div 
          className="confirmation-overlay" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="confirmation-title"
          onClick={(e) => {
            // Cerrar al hacer clic fuera si no está cargando
            if (e.target === e.currentTarget && !loading) handleCloseConfirmation();
          }}
        >
          <div className="confirmation-modal">
            <button 
              onClick={handleCloseConfirmation}
              className="modal-close-button"
              aria-label="Cerrar ventana"
              disabled={loading}
              type="button"
            >
              <FiX />
            </button>
            
            <div className="confirmation-header">
              <FiAlertTriangle className="confirmation-icon" aria-hidden="true" />
              <h2 id="confirmation-title">¿Estás seguro?</h2>
            </div>
            
            <p>Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. Esta operación no se puede deshacer.</p>
            
            <div className="confirmation-actions">
              <button 
                onClick={handleCloseConfirmation} 
                className="cancel-confirmation-button"
                type="button"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit} 
                className={`confirm-delete-button ${loading ? 'loading' : ''} ${countdown > 0 ? 'countdown' : ''}`}
                disabled={loading || countdown > 0}
                type="button"
                aria-busy={loading ? "true" : "false"}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Eliminando...</span>
                  </>
                ) : countdown > 0 ? (
                  `Continuar (${countdown})`
                ) : (
                  "Sí, eliminar mi cuenta"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
