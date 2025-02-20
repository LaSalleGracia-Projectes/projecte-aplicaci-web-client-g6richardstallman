import React, { useState } from 'react';
import '../styles/Register&Login.css';
import '../styles/Reset.css';

function Login() {
    return (
        <div className="registerContainer">
            <div className="imageContainer">
                <img src="/registerImage.jpg" alt="Imagen de registro" />
            </div>
            <div className="formContainer">
                <h3 className='logo'></h3>
                <h1>Inicia Sesión</h1>
                <form id="registerForm">
                    <input type="email" name="email" id="email" placeholder="Correo electrónico" />
                    <input type="password" name="password" id="password" placeholder="Contraseña" />
                    <button type="submit" id="btnSubmit">Continuar</button>
                </form>
                <p>¿Has olvidado tu contraseña? <a href="#">Recuperar contraseña</a></p>
                <p>¿Aún no estás registrado? <a href="/">Registrarse</a></p>
            </div>
        </div>
    );
}

export default Login;
