"use client";

import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import "./Toast.css";

const icons = {
  success: <FaCheckCircle className="toast-icon" />,
  error: <FaExclamationCircle className="toast-icon" />,
  warning: <FaExclamationTriangle className="toast-icon" />,
  info: <FaInfoCircle className="toast-icon" />,
};

const Toast = ({
  message,
  type = "info",
  duration = 3000,
  show = true,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [animation, setAnimation] = useState("enter");

  useEffect(() => {
    let enterTimer, durationTimer;
    if (show) {
      setIsVisible(true);
      enterTimer = setTimeout(() => setAnimation("visible"), 10);
      if (duration) {
        durationTimer = setTimeout(() => handleClose(), duration);
      }
    }
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(durationTimer);
    };
  }, [duration, show]);

  const handleClose = () => {
    setAnimation("exit");
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible && animation !== "exit") return null;

  return (
    <div className={`toast toast-${type} toast-${animation}`}>
      {icons[type]}
      <div className="toast-message">{message}</div>
      <button
        onClick={handleClose}
        className="toast-close"
        aria-label="Cerrar notificación"
      >
        <FaTimes className="toast-close-icon" />
      </button>
    </div>
  );
};

export default Toast;
