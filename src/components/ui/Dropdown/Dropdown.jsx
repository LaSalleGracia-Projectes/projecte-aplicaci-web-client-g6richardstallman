"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import "./Dropdown.css";

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
  const triggerRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(undefined);

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

  useEffect(() => {
    if (open && triggerRef.current) {
      setMenuWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

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
        ref={triggerRef}
      >
        {trigger || (
          <>
            {label || selected?.label || "Seleccionar"}
            <ChevronDownIcon className="dropdown-chevron" />
          </>
        )}
      </button>
      {name && (
        <input type="hidden" name={name} value={selected?.value || ""} />
      )}
      {open && (
        <div
          className={`dropdown-menu${menuClassName ? ` ${menuClassName}` : ""}`}
          role="listbox"
          style={menuWidth ? { width: menuWidth } : {}}
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
