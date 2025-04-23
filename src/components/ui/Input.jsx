import React, { forwardRef } from "react";

/**
 * Input reutilizable
 *
 * Props:
 * - value: valor del input
 * - onChange: función para manejar cambios
 * - type: tipo de input (text, email, password, etc)
 * - placeholder: texto de ayuda
 * - name: nombre del input
 * - className: clases extra para personalización
 * - disabled: deshabilitar el input
 * - required: marcar como obligatorio
 * - ...props: cualquier otro atributo estándar de <input>
 */
const Input = forwardRef(
  (
    {
      value,
      onChange,
      type = "text",
      placeholder = "",
      name = "",
      className = "",
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      name={name}
      disabled={disabled}
      required={required}
      className={`px-3 py-2 border rounded focus:outline-none ${className}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;