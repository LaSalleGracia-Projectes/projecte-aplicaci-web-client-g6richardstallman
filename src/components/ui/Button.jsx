import React, { forwardRef } from "react";

/**
 * Botón reutilizable
 *
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
      className={`px-4 py-2 rounded transition font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 duration-150 ${className}`}
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
