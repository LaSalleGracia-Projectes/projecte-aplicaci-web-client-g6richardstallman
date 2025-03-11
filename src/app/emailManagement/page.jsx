"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function EmailManagementPage() {
  const [openAccordion, setOpenAccordion] = useState(1);
  const [activeTab, setActiveTab] = useState("programados");

  const handleOpen = (value) =>
    setOpenAccordion(openAccordion === value ? 0 : value);

  const emails = [
    {
      asunto: "Starting in 24h",
      destinatarios: 142,
      fecha: "2 horas antes del evento",
      enlaces: true,
    },
    {
      asunto: "Starting in 48h",
      destinatarios: 142,
      fecha: "30 minutos antes del evento",
      enlaces: true,
    },
    {
      asunto: "Starting in 1 week",
      destinatarios: 142,
      fecha: "3 días antes del evento",
      enlaces: true,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Lado Izquierdo - Menú Acordeón */}
      <div className="w-full md:w-1/3 bg-white p-6 border-r border-gray-200 shadow-xl">
        <Typography variant="h4" className="mb-6 font-bold text-gray-800">
          Correos electrónicos a los asistentes
        </Typography>

        {[1, 2, 3, 4, 5].map((item) => (
          <Accordion
            key={item}
            open={openAccordion === item}
            className="mb-2 rounded-lg transition-all duration-300 hover:bg-red-50"
          >
            <AccordionHeader
              onClick={() => handleOpen(item)}
              className={`border-b-0 px-4 py-3 ${
                openAccordion === item ? "text-customRed" : "text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                Opción {item}
                <ChevronDownIcon
                  className={`h-5 w-5 ml-auto transform transition-transform ${
                    openAccordion === item ? "rotate-180" : ""
                  }`}
                />
              </div>
            </AccordionHeader>

            <AccordionBody className="py-2 px-4">
              <div className="p-3 bg-gradient-to-r from-red-50 to-white rounded-lg shadow-sm border-l-4 border-customRed">
                Contenido del acordeón {item}
              </div>
            </AccordionBody>
          </Accordion>
        ))}
      </div>

      {/* Lado Derecho - Contenido Principal */}
      <div className="w-full md:w-2/3 p-8">
        {/* Sección de Encabezado */}
        <div className="mb-8">
          <Typography
            variant="h2"
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Programa y envía correos electrónicos
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Programa y envía correos electrónicos a los asistentes con
            recordatorios o actualizaciones importantes del evento.
          </Typography>
          <div className="w-full border-b-2 border-gray-200 mb-6"></div>
        </div>

        {/* Pestañas */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="text"
            className={`p-2 ${
              activeTab === "programados"
                ? "border-b-2 border-customRed text-customRed"
                : "text-gray-500 hover:text-customRed"
            }`}
            onClick={() => setActiveTab("programados")}
          >
            Correos electrónicos programados
          </Button>
          <Button
            variant="text"
            className={`p-2 ${
              activeTab === "enviados"
                ? "border-b-2 border-customRed text-customRed"
                : "text-gray-500 hover:text-customRed"
            }`}
            onClick={() => setActiveTab("enviados")}
          >
            Correos electrónicos enviados
          </Button>
        </div>

        {/* Contenido */}
        {activeTab === "programados" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Button className="bg-customRed text-white mb-6 hover:bg-customRed/90 hover:shadow-lg transition-all">
              Crea nuevo correo electrónico para los asistentes
            </Button>

            {/* Tabla de Correos Electrónicos */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-2">
                      Asunto del correo electrónico
                    </th>
                    <th className="text-left py-4 px-2">Destinatarios</th>
                    <th className="text-left py-4 px-2">Fecha</th>
                    <th className="text-left py-4 px-2">Enlaces rápidos</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-2">
                        <button className="text-customRed hover:text-customRed/90 hover:underline">
                          {email.asunto}
                        </button>
                      </td>
                      <td className="py-4 px-2">{email.destinatarios}</td>
                      <td className="py-4 px-2">{email.fecha}</td>
                      <td className="py-4 px-2">
                        <div className="flex gap-2">
                          <button className="text-customRed hover:text-customRed/90 hover:underline">
                            Editar
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-customRed hover:text-customRed/90 hover:underline">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "enviados" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Typography className="text-gray-600 mb-4">
              Historial de correos electrónicos enviados
            </Typography>
            {/* Aquí puedes agregar la tabla o contenido para los correos electrónicos enviados */}
          </div>
        )}
      </div>
    </div>
  );
}
