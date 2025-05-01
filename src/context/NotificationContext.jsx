"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Toast from "../components/ui/Toast/Toast";

const NotificationContext = createContext();

const MAX_TOASTS = 5;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const toastIdRef = useRef(0);

  const addNotification = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = toastIdRef.current++;
      setNotifications((prev) => {
        const newNotifications = [...prev, { id, message, type, duration }];
        if (newNotifications.length > MAX_TOASTS) {
          return newNotifications.slice(-MAX_TOASTS);
        }
        return newNotifications;
      });
      return id;
    },
    []
  );

  const showSuccess = useCallback(
    (message, duration = 3000) => addNotification(message, "success", duration),
    [addNotification]
  );

  const showError = useCallback(
    (message, duration = 4000) => addNotification(message, "error", duration),
    [addNotification]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => addNotification(message, "info", duration),
    [addNotification]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => addNotification(message, "warning", duration),
    [addNotification]
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      addNotification,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      removeNotification,
    }),
    [
      addNotification,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      removeNotification,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div
        className="toast-container"
        role="region"
        aria-label="Notificaciones"
        aria-live="polite"
      >
        {notifications.map(({ id, message, type, duration }) => (
          <Toast
            key={id}
            message={message}
            type={type}
            duration={duration}
            show={true}
            onClose={() => removeNotification(id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification debe ser usado dentro de un NotificationProvider"
    );
  }
  return context;
};
