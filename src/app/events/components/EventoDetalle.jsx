"use client";

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaMinus, 
  FaPlus, 
  FaInfoCircle, 
  FaShoppingCart, 
  FaExclamationCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

const EventoDetalle = ({ evento, onComprar, loadingTiposEntrada }) => {
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState({});
  const [totalCompra, setTotalCompra] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [compraCompletada, setCompraCompletada] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState(null);
  const { isAuthenticated } = useAuth();

  // Extraer los tipos de entrada del evento o usar el arreglo proporcionado
  const tiposEntrada = evento?.tiposEntrada || [];
  
  useEffect(() => {
    // Cálculo inicial del total
    calcularTotal(entradasSeleccionadas);
  }, [entradasSeleccionadas]);

  if (!evento) return (
    <div className="text-center text-gray-500">No se encontró el evento</div>
  );

  // Formateo simple de fecha sin usar librería externa
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '–';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formateo simple de hora sin usar librería externa
  const formatearHora = (horaString) => {
    if (!horaString) return '–';
    try {
      const [hora, minutos] = horaString.split(':');
      const horaNum = parseInt(hora);
      const ampm = horaNum >= 12 ? 'PM' : 'AM';
      const hora12 = horaNum % 12 || 12; // Convierte 0 a 12
      return `${hora12}:${minutos} ${ampm}`;
    } catch (e) {
      return horaString;
    }
  };

  // Manejadores para aumentar/disminuir entradas
  const incrementarEntrada = (tipoId) => {
    const tipoEntrada = tiposEntrada.find(t => t.idTipoEntrada === tipoId);
    if (!tipoEntrada) return;
    
    const cantidadActual = entradasSeleccionadas[tipoId]?.cantidad || 0;
    const disponibles = tipoEntrada.es_ilimitado ? 999 : 
      (tipoEntrada.cantidad_disponible - tipoEntrada.entradas_vendidas);
    
    if (cantidadActual >= disponibles) {
      setFeedback({
        tipo: 'error',
        mensaje: `No hay más entradas de tipo "${tipoEntrada.nombre}" disponibles`
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    
    const nuevasEntradas = {
      ...entradasSeleccionadas,
      [tipoId]: {
        idTipoEntrada: tipoId,
        cantidad: cantidadActual + 1,
        precio: tipoEntrada.precio,
        nombre: tipoEntrada.nombre
      }
    };
    
    setEntradasSeleccionadas(nuevasEntradas);
    if (feedback) setFeedback(null);
  };

  const disminuirEntrada = (tipoId) => {
    const cantidadActual = entradasSeleccionadas[tipoId]?.cantidad || 0;
    if (cantidadActual <= 0) return;
    
    const nuevasEntradas = { ...entradasSeleccionadas };
    
    if (cantidadActual === 1) {
      // Si es la última entrada de este tipo, eliminar la entrada completa
      delete nuevasEntradas[tipoId];
    } else {
      // Decrementar la cantidad
      nuevasEntradas[tipoId] = {
        ...nuevasEntradas[tipoId],
        cantidad: cantidadActual - 1
      };
    }
    
    setEntradasSeleccionadas(nuevasEntradas);
    if (feedback) setFeedback(null);
  };

  // Calcula el total de la compra
  const calcularTotal = (seleccionadas) => {
    const total = Object.values(seleccionadas).reduce((sum, entrada) => {
      return sum + (entrada.cantidad * entrada.precio);
    }, 0);
    
    setTotalCompra(total);
  };

  // Envía la compra al backend
  const procesarCompra = async () => {
    if (!hayEntradasSeleccionadas) return;
    
    // Si no está autenticado, nos ocupamos en la página padre
    if (!isAuthenticated && onComprar) {
      const resultado = await onComprar([]);
      setFeedback({
        tipo: 'error',
        mensaje: resultado.message
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Preparamos los datos para enviar
    const entradasArray = Object.values(entradasSeleccionadas);
    
    try {
      // Usar la función de compra proporcionada por el padre
      if (onComprar) {
        const resultado = await onComprar(entradasArray);
        
        if (resultado.success) {
          setCompraCompletada(true);
          setDetalleCompra(resultado.data);
          setFeedback({
            tipo: 'exito',
            mensaje: resultado.message
          });
          // Limpiar la selección
          setEntradasSeleccionadas({});
        } else {
          setError(resultado.message);
        }
      } else {
        setError('Función de compra no disponible');
      }
    } catch (err) {
      console.error('Error al procesar compra:', err);
      setError('Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  const fechaFormateada = formatearFecha(evento.fechaEvento);
  const horaFormateada = formatearHora(evento.hora);
  const hayEntradasSeleccionadas = Object.values(entradasSeleccionadas).length > 0;

  return (
    <div>
      {/* Hero Image con información principal */}
      <div className="relative rounded-lg overflow-hidden shadow-md mb-6">
        <div className="relative w-full h-72 sm:h-96">
          <Image
            src={evento.imagen_url || '/img/default-event.jpg'}
            alt={evento.nombreEvento}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          
          {/* Información superpuesta */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-3">
              {evento.categoria}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {evento.nombreEvento}
            </h1>
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-2" />
                <time dateTime={evento.fechaEvento}>{fechaFormateada}</time>
              </div>
              <div className="flex items-center">
                <FaClock className="h-5 w-5 mr-2" />
                <span>{horaFormateada}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal con detalles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ubicación */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Ubicación</h2>
            <p>{evento.ubicacion || 'No especificada'}</p>
          </div>
          
          {/* Descripción */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Descripción</h2>
            <p className="whitespace-pre-line">
              {evento.descripcion || 'No hay descripción disponible para este evento.'}
            </p>
          </div>

          {/* Organizador */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Organizador</h2>
            <div className="bg-gray-50 p-5 rounded-lg">
              <p>
                <span className="font-semibold">Nombre: </span>
                {evento.organizador?.nombre_organizacion || 'No especificado'}
              </p>
              <p>
                <span className="font-semibold">Contacto: </span>
                {evento.organizador?.telefono_contacto || 'No especificado'}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {evento.organizador?.user?.email || 'No especificado'}
              </p>
            </div>
          </div>
        </div>

        {/* Columna lateral con entradas y compra */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Comprar Entradas
            </h2>
            
            {/* Mensaje de retroalimentación */}
            {feedback && (
              <div className={`mb-4 p-3 rounded-lg ${
                feedback.tipo === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {feedback.mensaje}
              </div>
            )}
            
            {/* Error general */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
            )}
            
            {compraCompletada && detalleCompra && (
              <div className="mb-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">¡Compra realizada con éxito!</h3>
                <p>Referencia: {detalleCompra.id || 'N/A'}</p>
                <p className="mt-2">Puedes consultar los detalles en tu perfil.</p>
              </div>
            )}
            
            {loadingTiposEntrada ? (
              // Estado de carga para los tipos de entrada
              <div className="animate-pulse space-y-3">
                <div className="h-12 bg-gray-100 rounded"></div>
                <div className="h-12 bg-gray-100 rounded"></div>
              </div>
            ) : tiposEntrada && tiposEntrada.length > 0 ? (
              <div className="space-y-4">
                {tiposEntrada.map(tipo => {
                  const cantidadDisponible = tipo.es_ilimitado ? 999 : 
                    (tipo.cantidad_disponible - tipo.entradas_vendidas);
                  const cantidadSeleccionada = entradasSeleccionadas[tipo.idTipoEntrada]?.cantidad || 0;
                  const agotado = cantidadDisponible <= 0;
                  
                  return (
                    <div 
                      key={tipo.idTipoEntrada} 
                      className={`border rounded p-4 ${agotado ? 'opacity-70 bg-gray-50' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{tipo.nombre}</h3>
                          <p className="text-red-600">{tipo.precio}€</p>
                        </div>
                        
                        {agotado ? (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                            Agotadas
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-800">
                            {tipo.es_ilimitado ? 'Ilimitadas' : `${cantidadDisponible} disponibles`}
                          </span>
                        )}
                      </div>
                      
                      {/* Selector de cantidad */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm">Cantidad:</div>
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 bg-gray-100 rounded-l-full flex items-center justify-center border border-gray-300 disabled:opacity-50"
                            onClick={() => disminuirEntrada(tipo.idTipoEntrada)}
                            disabled={!cantidadSeleccionada || agotado}
                            aria-label="Disminuir cantidad"
                          >
                            <FaMinus className="h-3 w-3 text-gray-600" />
                          </button>
                          <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                            {cantidadSeleccionada}
                          </div>
                          <button 
                            className="w-8 h-8 bg-gray-100 rounded-r-full flex items-center justify-center border border-gray-300 disabled:opacity-50"
                            onClick={() => incrementarEntrada(tipo.idTipoEntrada)}
                            disabled={agotado || (cantidadSeleccionada >= cantidadDisponible)}
                            aria-label="Aumentar cantidad"
                          >
                            <FaPlus className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Resumen de compra */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span>Subtotal:</span>
                    <span className="font-medium text-lg">{totalCompra.toFixed(2)}€</span>
                  </div>
                  
                  <button 
                    className={`w-full py-3 px-4 rounded font-medium text-white flex items-center justify-center gap-2 ${
                      hayEntradasSeleccionadas 
                        ? loading 
                          ? 'bg-gray-400 cursor-wait' 
                          : 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!hayEntradasSeleccionadas || loading}
                    onClick={procesarCompra}
                  >
                    {loading ? 'Procesando...' : (
                      <>
                        <FaShoppingCart className="h-4 w-4" />
                        <span>Comprar Entradas</span>
                      </>
                    )}
                  </button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <FaInfoCircle className="h-3 w-3" />
                      Debes iniciar sesión para comprar entradas
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No hay entradas disponibles para este evento.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EventoDetalle.propTypes = {
  evento: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    idEvento: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombreEvento: PropTypes.string,
    imagen_url: PropTypes.string,
    fechaEvento: PropTypes.string,
    hora: PropTypes.string,
    ubicacion: PropTypes.string,
    lugar: PropTypes.string,
    categoria: PropTypes.string,
    descripcion: PropTypes.string,
    organizador: PropTypes.object,
    tiposEntrada: PropTypes.array
  }),
  onComprar: PropTypes.func,
  loadingTiposEntrada: PropTypes.bool
};

export default EventoDetalle;
