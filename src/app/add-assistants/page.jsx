"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Select,
  Option,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function AddAssistantsPage() {
  const [openAccordion, setOpenAccordion] = useState(1);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);

  const handleOpen = (value) =>
    setOpenAccordion(openAccordion === value ? 0 : value);

  const calculateTotal = (value) => {
    const numValue = Number(value);
    setQuantity(numValue);
    setTotal(numValue * 10); // Suponiendo €10.00 por entrada
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Lado Izquierdo - Menú Acordeón */}
      <div className="w-full md:w-1/3 bg-white p-6 border-r border-gray-200 shadow-xl">
        <Typography variant="h4" className="mb-6 font-bold text-gray-800">
          Añadir Asistentes
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
                <span className="mr-2">📌</span>
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
        {/* Sección de Título */}
        <div className="mb-8">
          <Typography variant="h2" className="text-3xl font-bold text-gray-800 mb-4">
            Tipo de pedido:
          </Typography>
          <div className="w-full border-b-2 border-gray-200 mb-6"></div>

          <div className="mb-8 w-1/2">
            <Select label="Seleccionar tipo" className="!border-2 !border-gray-200">
              <Option>Opción 1</Option>
              <Option>Opción 2</Option>
              <Option>Opción 3</Option>
            </Select>
          </div>
        </div>

        {/* Sección de Tabla */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-2">Tipo de Entrada</th>
                <th className="text-left py-4 px-2">Vendido</th>
                <th className="text-left py-4 px-2">Precio</th>
                <th className="text-left py-4 px-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {/* Primera Fila */}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-2">Admisión general</td>
                <td className="py-4 px-2">2/10</td>
                <td className="py-4 px-2">€10.00</td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      className="!border-2 w-20"
                      value={quantity}
                      onChange={(e) => calculateTotal(e.target.value)}
                    />
                    <Input
                      value={`€${quantity * 10}`}
                      disabled
                      className="!border-2 w-32 bg-gray-50"
                    />
                  </div>
                </td>
              </tr>

              {/* Filas Vacías */}
              {[1, 2].map((row) => (
                <tr key={row} className="border-b border-gray-100">
                  <td className="py-4 px-2"></td>
                  <td className="py-4 px-2"></td>
                  <td className="py-4 px-2">€0.00</td>
                  <td className="py-4 px-2">
                    <Input
                      type="number"
                      className="!border-2 w-20"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sección de Total */}
          <div className="flex justify-end gap-6 items-center mt-8">
            <div className="w-64">
              <Input
                label="Valor Total"
                value={`€${total}`}
                disabled
                className="!border-2 bg-gray-50"
              />
            </div>
            <Button className="bg-customRed text-white px-8 py-3 rounded-lg hover:bg-customRed/90 transition-all">
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
