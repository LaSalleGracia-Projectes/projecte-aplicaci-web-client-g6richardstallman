import React, { forwardRef } from "react";
import "./Input.css";

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
      className={`input-base${className ? ` ${className}` : ""}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;
