"use client";

import { useState } from 'react';
import PopUpPasswordReset from '@/components/PopUpPasswordReset';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Enviando correo a ${email}');

        setShowPopup(true);
    }
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Imagen lateral */}
            <div className="w-1/2 h-full">
                <img
                    src="/registerImage.jpg"
                    alt="Imagen de registro"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Contenedor del formulario */}
            <div className="w-1/2 flex flex-col justify-center items-center h-full relative px-6">
                <h3
                    className="mb-2"
                    style={{
                        width: "180px",
                        height: "70px",
                        backgroundImage: 'url("/logo.webp")',
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <h1 className="text-center mb-5 font-extrabold text-2xl">
                    Recupera tu contraseña
                </h1>

                <p className="text-center">Escribe el correo electrónico asociado a tu cuenta:</p>

                {/* Formulario de login */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-3/5 border-b border-black gap-4 pb-6">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                        className="w-full p-2 border border-black rounded placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="mt-3 px-6 py-3 bg-black text-white rounded cursor-pointer"
                    >
                        Confirmar
                    </button>
                </form>

                {/* Mostrar el PopUp si showPopup es true */}
                <PopUpPasswordReset
                    message={"Hemos enviado un correo con instrucciones para restablecer tu contraseña."}
                    isOpen={showPopup}
                    onClose={() => setShowPopup(false)} />

            </div>
        </div>
    );
}