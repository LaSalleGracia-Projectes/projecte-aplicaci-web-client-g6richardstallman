import React, { forwardRef } from "react";
import "./Button.css";

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
