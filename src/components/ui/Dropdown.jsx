"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

/**
 * Dropdown reutilitzable
 *
 * Props:
 * - options: [{ label, value }] Opcions a mostrar.
 * - onSelect: funció cridada en seleccionar una opció.
 * - trigger: Element React personalitzat per obrir el menú.
 * - className: Classes extra pel contenidor.
 * - menuClassName: Classes extra pel menú desplegable.
 * - children: Contingut personalitzat en comptes d'options.
 * - label: Text o node a mostrar al botó (opcional, mostra opció seleccionada si n'hi ha).
 * - value: Valor controlat per formularis.
 * - onChange: Funció cridada en canviar el valor (compatible amb formularis).
 * - name: Nom del camp per formularis.
 */
const Dropdown = ({
  options = [],
  onSelect,
  trigger,
  className = "",
  menuClassName = "",
  children,
  label,
  value,
  onChange,
  name,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  // Sincronitza selected amb value controlat
  useEffect(() => {
    if (value !== undefined) {
      const found = options.find((opt) => opt.value === value) || null;
      setSelected(found);
    }
  }, [value, options]);

  // Tanca el menú si es fa clic fora o es prem Escape
  useEffect(() => {
    const handleClickOrEsc = (event) => {
      if (
        event.type === "mousedown" &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false);
      }
      if (event.type === "keydown" && event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOrEsc);
    document.addEventListener("keydown", handleClickOrEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOrEsc);
      document.removeEventListener("keydown", handleClickOrEsc);
    };
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
    if (onChange) onChange({ target: { name, value: option.value } });
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={ref}
      {...rest}
    >
      <button
        type="button"
        className="flex items-center gap-1 px-3 py-2 border rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        name={name}
      >
        {trigger || (
          <span>
            {label || selected?.label || "Seleccionar"} <ChevronDownIcon className="w-4 h-4 inline" />
          </span>
        )}
      </button>
      {/* Hidden input per integració amb formularis HTML */}
      {name && (
        <input type="hidden" name={name} value={selected?.value || ""} />
      )}
      {open && (
        <div
          className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black/5 z-20 ${menuClassName}`}
          role="listbox"
        >
          <div className="py-1">
            {children
              ? children
              : options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2 text-sm transition ${selected?.value === option.value ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-red-100 hover:text-red-700"}`}
                    role="option"
                    aria-selected={selected?.value === option.value}
                  >
                    {option.label}
                  </button>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
