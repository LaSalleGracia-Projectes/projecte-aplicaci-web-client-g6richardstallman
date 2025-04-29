"use client";

import React, { createContext, useState, useContext, useRef } from "react";
import Toast from "../components/ui/Toast/Toast";

const NotificationContext = createContext();

const MAX_TOASTS = 5;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const toastIdRef = useRef(0);

  const addNotification = (message, type = "info", duration = 3000) => {
    const id = toastIdRef.current++;
    setNotifications((prev) => {
      const newNotifications = [...prev, { id, message, type, duration }];
      if (newNotifications.length > MAX_TOASTS) {
        return newNotifications.slice(-MAX_TOASTS);
      }
      return newNotifications;
    });
    return id;
  };

  const showSuccess = (message, duration = 3000) =>
    addNotification(message, "success", duration);
  const showError = (message, duration = 4000) =>
    addNotification(message, "error", duration);
  const showInfo = (message, duration = 3000) =>
    addNotification(message, "info", duration);
  const showWarning = (message, duration = 4000) =>
    addNotification(message, "warning", duration);

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeNotification,
      }}
    >
      {children}
      <div
        className="toast-container"
        role="region"
        aria-label="Notificaciones"
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
