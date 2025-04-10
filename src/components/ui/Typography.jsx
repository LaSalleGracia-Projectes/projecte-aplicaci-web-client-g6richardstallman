"use client";

import React from "react";

const variants = {
  h1: "text-5xl font-bold",
  h2: "text-4xl font-bold",
  h3: "text-3xl font-bold",
  h4: "text-2xl font-bold",
  h5: "text-xl font-bold",
  h6: "text-lg font-bold",
  lead: "text-xl",
  paragraph: "text-base",
  small: "text-sm",
};

const colors = {
  inherit: "text-inherit",
  current: "text-current",
  black: "text-black",
  white: "text-white",
  primary: "text-primary-600",
  secondary: "text-secondary-600",
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

export default function Typography({
  variant = "paragraph",
  color = "inherit",
  as,
  className = "",
  children,
  ...props
}) {
  // Determine the HTML element to render
  const Component = as || 
    (variant === "h1" ? "h1" : 
     variant === "h2" ? "h2" : 
     variant === "h3" ? "h3" : 
     variant === "h4" ? "h4" : 
     variant === "h5" ? "h5" : 
     variant === "h6" ? "h6" : 
     variant === "lead" ? "p" : 
     variant === "small" ? "small" : "p");

  const variantClasses = variants[variant] || "";
  const colorClasses = colors[color] || "";
  
  const classes = `${variantClasses} ${colorClasses} ${className}`.trim();

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
} 