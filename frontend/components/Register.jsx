import React from 'react';
import '../styles/Register.css';
import '../styles/Reset.css';

function Register() {
    return (
        <div className="registerContainer">
            <div className="imageContainer">
                <img src="/registerImage.jpg" alt="Imagen de registro" />
            </div>
            <div className="formContainer">
                <h3>Eventclix</h3>
                <h1>Regístrate</h1>
                <form id="registerForm">
                    <input type="text" name="name" id="name" placeholder="Nombre" />
                    <input type="email" name="email" id="email" placeholder="Correo electrónico" />
                    <input type="password" name="password" id="password" placeholder="Contraseña" />
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmar contraseña" />
                    <h3>¿Qué eres?</h3>
                    <div id="btnContainer">
                        <button type="button" className="btnRegister">Organizador</button>
                        <button type="button" className="btnRegister">Participante</button>
                    </div>
                    <button type="submit" id="btnSubmit">Continuar</button>
                </form>
                <p>¿Ya tienes una cuenta? <a href="#">Inicia sesión</a></p>
            </div>
        </div>
    );
}

export default Register;