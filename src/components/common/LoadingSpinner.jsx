import React from "react";

export default function LoadingSpinner({
  size = "md",
  fullScreen = false,
  withText = true,
}) {
  const sizeClasses = {
    sm: {
      spinner: "w-5 h-5",
      text: "text-xs",
    },
    md: {
      spinner: "w-8 h-8",
      text: "text-sm",
    },
    lg: {
      spinner: "w-12 h-12",
      text: "text-base",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${classes.spinner} rounded-full border-2 border-transparent border-t-[#e53c3d] border-r-[#e53c3d] shadow-sm animate-spin`}
      ></div>
      {withText && (
        <p className={`mt-2 text-gray-600 font-medium ${classes.text}`}>
          Cargando...
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      {spinner}
    </div>
  );
}
