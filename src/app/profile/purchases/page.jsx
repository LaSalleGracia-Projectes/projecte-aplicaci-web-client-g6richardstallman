"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaTicketAlt, 
  FaDownload, 
  FaSearch, 
  FaCalendarAlt, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaFilter,
  FaMapMarkerAlt,
  FaRegClock,
  FaHome
} from "react-icons/fa";
import ProfileNavBar from "@/components/userProfile/profileNavBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PurchasesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Datos simulados para pruebas
  const mockPurchases = [
    {
      id: "TKT-001",
      eventName: "Festival de Música Electrónica",
      eventDate: "15 de junio de 2024",
      purchaseDate: "10 de marzo de 2024",
      price: "75,00€",
      status: "active",
      tickets: 2,
      location: "Recinto Ferial, Madrid",
      imageUrl: "/img1.webp"
    },
    {
      id: "TKT-002",
      eventName: "Conferencia de Desarrollo Web",
      eventDate: "5 de mayo de 2024",
      purchaseDate: "2 de febrero de 2024",
      price: "45,00€",
      status: "active",
      tickets: 1,
      location: "Centro de Convenciones, Barcelona",
      imageUrl: "/img2.webp"
    },
    {
      id: "TKT-003",
      eventName: "Teatro: Romeo y Julieta",
      eventDate: "20 de enero de 2024",
      purchaseDate: "15 de diciembre de 2023",
      price: "30,00€",
      status: "completed",
      tickets: 3,
      location: "Teatro Principal, Valencia",
      imageUrl: "/img3.webp"
    },
    {
      id: "TKT-004",
      eventName: "Workshop de Fotografía",
      eventDate: "12 de febrero de 2024",
      purchaseDate: "5 de enero de 2024",
      price: "120,00€",
      status: "cancelled",
      tickets: 1,
      location: "Estudio Central, Sevilla",
      imageUrl: "/img4.webp"
    },
    {
      id: "TKT-005",
      eventName: "Concierto de Rock Clásico",
      eventDate: "30 de abril de 2024",
      purchaseDate: "15 de marzo de 2024",
      price: "65,00€",
      status: "active",
      tickets: 2,
      location: "Estadio Olímpico, Barcelona",
      imageUrl: "/img1.webp"
    }
  ];

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        // Simulación de llamada a API con un retardo
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Usar datos simulados
        setPurchases(mockPurchases);
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar el historial de compras");
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  // Filtrar y ordenar las compras
  const filteredPurchases = purchases
    .filter(purchase => {
      // Filtro por búsqueda
      const matchesSearch = purchase.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por estado
      const matchesStatus = filterStatus === "all" || purchase.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Ordenar por fecha de compra
      const dateA = new Date(a.purchaseDate.split(" de ").reverse().join(" "));
      const dateB = new Date(b.purchaseDate.split(" de ").reverse().join(" "));
      
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  // Renderizar el estado por colores
  const renderStatus = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
            Activo
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
            Completado
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ProfileNavBar />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* Botón para volver al inicio (ahora sticky) */}
        <Link
          href="/"
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          aria-label="Volver al inicio"
        >
          <FaHome className="text-lg" />
          <span className="font-medium">Inicio</span>
        </Link>

        <div className="max-w-5xl mx-auto space-y-6 pt-16">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">Historial de Compras</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Filtros y búsqueda */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o número de ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[150px] relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none transition-all"
                    style={{ backgroundPosition: "right 1rem center" }}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="completed">Completados</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  {sortOrder === "desc" ? (
                    <>
                      <FaSortAmountDown className="text-gray-500" />
                      <span>Recientes primero</span>
                    </>
                  ) : (
                    <>
                      <FaSortAmountUp className="text-gray-500" />
                      <span>Antiguos primero</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Lista de compras */}
            {filteredPurchases.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <FaTicketAlt className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron compras</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all" 
                    ? "Intenta cambiar tus filtros de búsqueda" 
                    : "Aún no has realizado ninguna compra"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPurchases.map((purchase) => (
                  <div key={purchase.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row">
                      {/* Imagen del evento */}
                      <div className="sm:w-1/3 lg:w-1/4 h-40 sm:h-auto relative">
                        <img 
                          src={purchase.imageUrl} 
                          alt={purchase.eventName}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-4 right-4">
                          {renderStatus(purchase.status)}
                        </div>
                      </div>
                      
                      {/* Detalles del evento */}
                      <div className="p-5 sm:w-2/3 lg:w-3/4 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{purchase.eventName}</h3>
                            <span className="font-bold text-[#e53c3d]">{purchase.price}</span>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaTicketAlt className="flex-shrink-0 text-gray-400" />
                              <span className="text-sm">Ticket {purchase.id} • {purchase.tickets} {purchase.tickets > 1 ? 'entradas' : 'entrada'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaCalendarAlt className="flex-shrink-0 text-gray-400" />
                              <span className="text-sm">{purchase.eventDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaMapMarkerAlt className="flex-shrink-0 text-gray-400" />
                              <span className="text-sm">{purchase.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <FaRegClock className="flex-shrink-0 text-gray-400" />
                              <span className="text-xs">Comprado el {purchase.purchaseDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Acciones */}
                        <div className="flex flex-wrap justify-end gap-3 mt-4">
                          {purchase.status === "active" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#e53c3d] text-white rounded-xl hover:bg-red-600 transition-colors text-sm">
                              <FaDownload className="text-sm" />
                              <span>Descargar Ticket</span>
                            </button>
                          )}
                          {purchase.status === "completed" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                              <FaDownload className="text-sm" />
                              <span>Descargar Recibo</span>
                            </button>
                          )}
                          {purchase.status === "cancelled" && (
                            <span className="text-sm text-gray-500 italic">Pedido cancelado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 