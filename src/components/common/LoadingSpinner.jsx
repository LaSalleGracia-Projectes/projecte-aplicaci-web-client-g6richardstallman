import React from "react";

/**
 * Componente de círculo de carga reutilizable con estilo mejorado
 * @param {Object} props - Propiedades del componente
 * @param {string} props.size - Tamaño del spinner (sm, md, lg)
 * @param {boolean} props.fullScreen - Si debe ocupar toda la pantalla
 * @param {string} props.variant - Variante del spinner (circle, pulse, dots)
 */
export default function LoadingSpinner({ 
  size = "md", 
  fullScreen = false,
  variant = "circle"
}) {
  // Mapeo de tamaños a clases
  const sizeClasses = {
    sm: {
      container: "w-16 h-16",
      spinner: "w-10 h-10",
      text: "text-xs"
    },
    md: {
      container: "w-24 h-24",
      spinner: "w-16 h-16",
      text: "text-sm"
    },
    lg: {
      container: "w-32 h-32",
      spinner: "w-20 h-20",
      text: "text-base"
    }
  };

  // Render basado en la variante elegida
  const renderSpinner = () => {
    const classes = sizeClasses[size];
    
    switch (variant) {
      case "pulse":
        return (
          <div className={`${classes.container} flex flex-col items-center justify-center`}>
            <div className={`${classes.spinner} relative`}>
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></div>
              <div className="relative rounded-full bg-red-600 w-full h-full flex items-center justify-center">
                <div className="w-2/3 h-2/3 rounded-full bg-white"></div>
              </div>
            </div>
            <p className={`mt-4 text-gray-700 font-medium ${classes.text}`}>Cargando...</p>
          </div>
        );
        
      case "dots":
        return (
          <div className={`${classes.container} flex flex-col items-center justify-center`}>
            <div className="flex space-x-2">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            <p className={`mt-4 text-gray-700 font-medium ${classes.text}`}>Cargando...</p>
          </div>
        );
        
      case "circle":
      default:
        return (
          <div className={`${classes.container} flex flex-col items-center justify-center`}>
            <div className={`${classes.spinner} border-4 border-gray-200 rounded-full relative flex items-center justify-center`}>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#e53c3d] animate-spin"></div>
              <div className="rounded-full bg-white w-2/3 h-2/3 flex items-center justify-center">
                <div className="w-1/2 h-1/2">
                  <div className="w-full h-full rounded-full border-8 border-[#e53c3d] border-r-transparent border-b-transparent animate-spin"></div>
                </div>
              </div>
            </div>
            <p className={`mt-4 text-gray-700 font-medium ${classes.text}`}>Cargando...</p>
          </div>
        );
    }
  };
  
  // Si es fullScreen, centra en toda la pantalla con efecto de fondo
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
        {renderSpinner()}
      </div>
    );
  }
  
  // Renderizado normal dentro de un contenedor
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      {renderSpinner()}
    </div>
  );
} 