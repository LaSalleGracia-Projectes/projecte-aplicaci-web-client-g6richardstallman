"use client";

import { useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function PopUpPasswordReset({ message, isOpen, onClose }) {
    const router = useRouter();

    const handleClose = () => {
        onClose();
        router.push("/login");
    };

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(handleClose, 10000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center w-80">
                <AiFillCheckCircle className="w-16 h-16" />
                <p className="mt-4 text-lg font-semibold">{message}</p>
                <button
                    onClick={handleClose}
                    className="mt-4 px-6 py-2 bg-[#a53435] text-white rounded-lg shadow-md hover:bg-[#8f2c2d] transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
