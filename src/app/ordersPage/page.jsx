"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Input,
  Select,
  Option,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function OrdersPage() {
  const [openAccordion, setOpenAccordion] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = (value) => setOpenAccordion(openAccordion === value ? 0 : value);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left Side - Styled Accordion Menu */}
      <div className="w-full md:w-1/3 bg-white p-6 border-r border-gray-200 shadow-xl">
        <Typography variant="h4" className="mb-6 font-bold text-gray-800">
          🚀 Menú de Acciones
        </Typography>

        {[1, 2, 3, 4, 5].map((item) => (
          <Accordion 
            key={item} 
            open={openAccordion === item}
            className="mb-2 rounded-lg transition-all duration-300 hover:bg-red-50"
          >
            <AccordionHeader 
              onClick={() => handleOpen(item)} 
              className={`border-b-0 px-4 py-3 ${openAccordion === item ? 'text-customRed' : 'text-gray-700'}`}
            >
              <div className="flex items-center">
                <span className="mr-2">📌</span>
                Opción {item}
                <ChevronDownIcon className={`h-5 w-5 ml-auto transform transition-transform ${openAccordion === item ? 'rotate-180' : ''}`} />
              </div>
            </AccordionHeader>
            
            <AccordionBody className="py-2 px-4">
              <div className="p-3 bg-gradient-to-r from-red-50 to-white rounded-lg shadow-sm border-l-4 border-customRed">
                <Typography className="text-gray-600">
                  Contenido detallado para la opción {item}. Puedes agregar formularios, enlaces o cualquier componente aquí.
                </Typography>
              </div>
            </AccordionBody>
          </Accordion>
        ))}
      </div>

      {/* Right Side - Enhanced Main Content */}
      <div className="w-full md:w-2/3 p-8">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <Typography 
            variant="h1" 
            className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-customRed to-red-600 bg-clip-text text-transparent"
          >
            Gestión de Pedidos
          </Typography>
          <div className="h-1 bg-gradient-to-r from-customRed via-red-300 to-customRed rounded-full"></div>
        </div>

        {/* Search Bar with Icon */}
        <div className="mb-10 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Buscar pedidos..."
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-customRed" />}
            className="!border-2 !border-gray-200 focus:!border-customRed !rounded-xl py-3 px-4"
            labelProps={{
              className: "!text-gray-500 peer-focus:!text-customRed"
            }}
          />
        </div>

        {/* Filtros Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Typography variant="h5" className="mb-6 flex items-center text-gray-700">
            <FunnelIcon className="h-6 w-6 mr-2 text-customRed" />
            Filtros Avanzados
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Select
                key={item}
                label={`Filtro ${item}`}
                className="!border-2 !border-gray-200 focus:!border-customRed rounded-lg"
                labelProps={{
                  className: "!text-gray-600 peer-focus:!text-customRed"
                }}
                menuProps={{
                  className: "border-2 border-customRed rounded-lg py-2"
                }}
              >
                <Option className="hover:bg-red-50">Opción 1</Option>
                <Option className="hover:bg-red-50">Opción 2</Option>
                <Option className="hover:bg-red-50">Opción 3</Option>
              </Select>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-end">
            <Button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-8 py-3 rounded-lg transition-all">
              Limpiar
            </Button>
            <Button className="bg-customRed text-white hover:bg-customRed/90 px-8 py-3 rounded-lg shadow-red hover:shadow-lg transition-all">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
