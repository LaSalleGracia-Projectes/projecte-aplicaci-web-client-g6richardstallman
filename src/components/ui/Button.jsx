"use client";

import React from "react";
import Link from "next/link";

const colors = {
  primary: "bg-primary-600 hover:bg-primary-700 text-white",
  secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
  white: "bg-white hover:bg-gray-100 text-black",
  black: "bg-black hover:bg-gray-800 text-white",
  transparent: "bg-transparent hover:bg-black/10 text-current",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  color = "primary",
  size = "md",
  className = "",
  href,
  disabled = false,
  fullWidth = false,
  rounded = false,
  variant = "filled",
  onClick,
  type = "button",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";
  
  const colorClasses = colors[color] || colors.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const roundedClasses = rounded ? "rounded-full" : "rounded-md";
  const widthClasses = fullWidth ? "w-full" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const classes = `${baseClasses} ${colorClasses} ${sizeClasses} ${roundedClasses} ${widthClasses} ${disabledClasses} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
} 