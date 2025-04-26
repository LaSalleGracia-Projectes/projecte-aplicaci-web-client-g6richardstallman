import React, { forwardRef } from "react";
import "./Button.css";

/**
 * Props:
 * - children: contenido del botón
 * - type: tipo de botón (button, submit, reset)
 * - className: clases extra para personalización
 * - disabled: deshabilitar el botón
 * - onClick: función al hacer click
 * - ...props: cualquier otro atributo estándar de <button>
 */

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      className = "",
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={`button ${className}`}
      disabled={disabled}
      onClick={onClick}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
