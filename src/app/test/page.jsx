"use client";

import React, { useState } from "react";
import Button from "../../components/ui/Button/Button";
import Dropdown from "../../components/ui/Dropdown/Dropdown";
import Input from "../../components/ui/Input/Input";
import Toast from "../../components/ui/Toast/Toast";
import "../../components/ui/Button/Button.css";
import "../../components/ui/Dropdown/Dropdown.css";
import "../../components/ui/Input/Input.css";
import "../../components/ui/Toast/Toast.css";
import "./test.css";

export default function TestPage() {
  const options = [
    { label: "Opción 1", value: "1" },
    { label: "Opción 2", value: "2" },
    { label: "Opción 3", value: "3" },
  ];

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (type) => {
    setToast({ show: true, message: `Notificación tipo ${type}`, type });
  };

  return (
    <div className="test-page">
      <h1 className="test-title">Demo Componentes UI</h1>

      <section className="test-section">
        <h2 className="test-section-title">Toast</h2>
        <div className="test-toast-buttons">
          <Button onClick={() => showToast("success")}>Success</Button>
          <Button onClick={() => showToast("error")}>Error</Button>
          <Button onClick={() => showToast("info")}>Info</Button>
          <Button onClick={() => showToast("warning")}>Warning</Button>
        </div>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={2000}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </section>

      <section className="test-section">
        <h2 className="test-section-title">Button</h2>
        <Button>Ejemplo</Button>
      </section>

      <section className="test-section">
        <h2 className="test-section-title">Input</h2>
        <Input placeholder="Escribe algo..." />
      </section>

      <section className="test-section">
        <h2 className="test-section-title">Dropdown</h2>
        <Dropdown
          options={options}
          name="dropdown-demo"
          onSelect={(opt) => console.log("Seleccionado:", opt)}
          label="Selecciona una opción"
        />
      </section>
    </div>
  );
}
