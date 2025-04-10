import { toast } from 'sonner';

const DEFAULT_DURATION = 3000;

export const showSuccessToast = (message, options = {}) => {
  toast.success(message || "Acción completada con éxito", {
    duration: DEFAULT_DURATION,
    position: 'top-right',
    ...options
  });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message || "Ha ocurrido un error", {
    duration: DEFAULT_DURATION * 1.5,
    position: 'top-right',
    ...options
  });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    duration: DEFAULT_DURATION,
    position: 'top-right',
    ...options
  });
};

export const showWarningToast = (message, options = {}) => {
  toast.warning(message, {
    duration: DEFAULT_DURATION,
    position: 'top-right',
    ...options
  });
};

export const showPromiseToast = (promise, messages, options = {}) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Procesando...',
    success: messages.success || 'Operación completada con éxito',
    error: (err) => messages.error || err.message || 'Ha ocurrido un error',
    ...options
  });
};