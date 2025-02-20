import React, { useState } from 'react';
import '../styles/Register&Login.css';
import '../styles/Reset.css';

function Register() {
    const [selectedRole, setSelectedRole] = useState('');

    const handleRoleClick = (role) => {
        setSelectedRole(role);
    };

    return (
        <div className="registerContainer">
            <div className="imageContainer">
                <img src="/registerImage.jpg" alt="Imagen de registro" />
            </div>
            <div className="formContainer">
                <h3 className='logo'></h3>
                <h1>Regístrate</h1>
                <form id="registerForm">
                    <input type="text" name="name" id="name" placeholder="Nombre" />
                    <input type="email" name="email" id="email" placeholder="Correo electrónico" />
                    <input type="password" name="password" id="password" placeholder="Contraseña" />
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmar contraseña" />
                    <h3>¿Qué eres?</h3>
                    <div id="btnContainer">
                        <button
                            type="button"
                            className={`btnRegister ${selectedRole === 'organizador' ? 'selected' : ''}`}
                            onClick={() => handleRoleClick('organizador')}
                        >
                            Organizador
                        </button>
                        <button
                            type="button"
                            className={`btnRegister ${selectedRole === 'participante' ? 'selected' : ''}`}
                            onClick={() => handleRoleClick('participante')}
                        >
                            Participante
                        </button>
                    </div>
                    <button type="submit" id="btnSubmit">Continuar</button>
                </form>
                <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
            </div>
        </div>
    );
}

export default Register;
