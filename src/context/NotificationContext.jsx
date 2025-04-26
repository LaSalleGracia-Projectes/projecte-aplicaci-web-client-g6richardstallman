"use client";

import React, { createContext, useState, useContext } from "react";
import Toast from "../components/ui/Toast/Toast";

const NotificationContext = createContext();

let toastId = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 3000) => {
    const id = toastId++;
    setNotifications((prev) => [...prev, { id, message, type, duration }]);
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
      <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-2 min-w-[280px] max-w-md">
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
