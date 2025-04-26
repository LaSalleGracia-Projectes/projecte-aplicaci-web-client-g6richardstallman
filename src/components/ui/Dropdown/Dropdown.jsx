"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

/**
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

  useEffect(() => {
    if (value !== undefined) {
      const found = options.find((opt) => opt.value === value) || null;
      setSelected(found);
    }
  }, [value, options]);

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
      className={`dropdown-container${className ? ` ${className}` : ""}`}
      ref={ref}
      {...rest}
    >
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        name={name}
      >
        {trigger || (
          <span>
            {label || selected?.label || "Seleccionar"}{" "}
            <ChevronDownIcon className="dropdown-chevron" />
          </span>
        )}
      </button>
      {name && (
        <input type="hidden" name={name} value={selected?.value || ""} />
      )}
      {open && (
        <div
          className={`dropdown-menu${menuClassName ? ` ${menuClassName}` : ""}`}
          role="listbox"
        >
          <div className="dropdown-menu-list">
            {children
              ? children
              : options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`dropdown-option${
                      selected?.value === option.value ? " selected" : ""
                    }`}
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
