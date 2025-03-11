"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileNavBar from "@/components/profileNavBar";
import { FaCamera, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

export default function EditInformationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    // Campos específicos según rol
    organizacion: "",
    dni: "",
    role: "",
    fechaCreacion: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Aquí iría la llamada a la API para obtener datos del usuario
        const userData = {
          nombre: "Juan",
          apellido1: "García",
          apellido2: "López",
          email: "juan@ejemplo.com",
          telefono: "+34 666 666 666",
          role: "organizador",
          fechaCreacion: "15 de marzo de 2024",
          organizacion: "Eventos García S.L.",
          dni: "12345678A",
          profileImage: null,
        };

        setFormData((prevData) => ({
          ...prevData,
          ...userData,
        }));
        setOriginalData(userData);
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar los datos del usuario");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar los 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("El archivo debe ser una imagen");
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            profileImage: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setError("Error al procesar la imagen");
      }
    }
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!formData.apellido1.trim()) {
      setError("El primer apellido es obligatorio");
      return false;
    }
    if (!formData.telefono.trim()) {
      setError("El teléfono es obligatorio");
      return false;
    }

    const phoneRegex = /^\+?\d{9,}$/;
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ""))) {
      setError("El formato del teléfono no es válido");
      return false;
    }

    // Validación de contraseña
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (!formData.currentPassword) {
        setError("La contraseña actual es obligatoria");
        return false;
      }
      if (!formData.newPassword) {
        setError("La nueva contraseña es obligatoria");
        return false;
      }
      if (formData.newPassword.length < 8) {
        setError("La nueva contraseña debe tener al menos 8 caracteres");
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return false;
      }

      // Validar complejidad de la contraseña
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        setError("La contraseña no cumple con los requisitos de seguridad");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError("");

      // Aquí iría la llamada a la API para actualizar los datos
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/profile");
    } catch (error) {
      setError("Error al actualizar los datos");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e53c3d]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex">
        <ProfileNavBar />

        <div className="flex-1 p-4 md:p-8 pt-24 md:pt-8">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Cabecera con imagen */}
              <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="absolute -bottom-12 left-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaCamera size={24} />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#e53c3d] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#d03536] transition-colors">
                      <FaCamera className="text-white text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Contenido del formulario */}
              <div className="mt-16 px-4 md:px-8 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h1 className="text-2xl font-bold">Editar Información</h1>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => router.push("/profile")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      <FaTimes className="text-gray-600" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                      disabled={isLoading}
                    >
                      <FaSave />
                      <span>
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                      </span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                  </div>
                )}

                {/* Campos editables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Primer apellido
                    </label>
                    <input
                      type="text"
                      name="apellido1"
                      value={formData.apellido1}
                      onChange={handleChange}
                      className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Segundo apellido
                    </label>
                    <input
                      type="text"
                      name="apellido2"
                      value={formData.apellido2}
                      onChange={handleChange}
                      className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Campos no editables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full p-2 border-2 border-gray-200 rounded bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tipo de cuenta
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full p-2 border-2 border-gray-200 rounded bg-gray-50 text-gray-500 capitalize"
                    />
                  </div>

                  {formData.role === "organizador" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Organización
                      </label>
                      <input
                        type="text"
                        value={formData.organizacion}
                        disabled
                        className="w-full p-2 border-2 border-gray-200 rounded bg-gray-50 text-gray-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        DNI
                      </label>
                      <input
                        type="text"
                        value={formData.dni}
                        disabled
                        className="w-full p-2 border-2 border-gray-200 rounded bg-gray-50 text-gray-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Fecha de creación
                    </label>
                    <input
                      type="text"
                      value={formData.fechaCreacion}
                      disabled
                      className="w-full p-2 border-2 border-gray-200 rounded bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {/* Sección de cambio de contraseña */}
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xl font-bold mb-4">Cambiar contraseña</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Contraseña actual
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="relative md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Requisitos de la contraseña:
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>Mínimo 8 caracteres</li>
                      <li>Al menos una letra mayúscula</li>
                      <li>Al menos una letra minúscula</li>
                      <li>Al menos un número</li>
                      <li>Al menos un caracter especial</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                  * Los campos en gris no son editables. Si necesitas
                  modificarlos, contacta con soporte.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
