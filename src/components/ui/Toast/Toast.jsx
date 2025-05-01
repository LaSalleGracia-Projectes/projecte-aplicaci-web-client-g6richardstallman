"use client";

import React, { useState, useEffect, useRef, memo } from "react";
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

const Toast = memo(
  ({ message, type = "info", duration = 3000, show = true, onClose }) => {
    const [isVisible, setIsVisible] = useState(show);
    const [animation, setAnimation] = useState("enter");
    const progressRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
      let enterTimer;

      if (show) {
        setIsVisible(true);
        enterTimer = setTimeout(() => setAnimation("visible"), 10);

        if (progressRef.current && duration) {
          progressRef.current.style.width = "100%";
          progressRef.current.style.transition = `width ${duration}ms linear`;
          requestAnimationFrame(() => {
            if (progressRef.current) progressRef.current.style.width = "0%";
          });
        }

        if (duration) {
          timerRef.current = setTimeout(() => handleClose(), duration);
        }
      }

      return () => {
        clearTimeout(enterTimer);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [duration, show]);

    const handleClose = () => {
      setAnimation("exit");
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);

      return () => clearTimeout(exitTimer);
    };

    if (!isVisible && animation !== "exit") return null;

    return (
      <div
        className={`toast toast-${type} toast-${animation}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="toast-content">
          {icons[type]}
          <div className="toast-message">{message}</div>
        </div>
        <button
          onClick={handleClose}
          className="toast-close"
          aria-label="Cerrar notificación"
        >
          <FaTimes className="toast-close-icon" />
        </button>
        {duration > 0 && (
          <div className="toast-progress-container" aria-hidden="true">
            <div className="toast-progress" ref={progressRef} />
          </div>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
