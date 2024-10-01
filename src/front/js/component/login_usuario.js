import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';

export const LoginUsuario = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Leer el email y password del sessionStorage si existen
        const savedEmail = sessionStorage.getItem('signup_email');
        const savedPassword = sessionStorage.getItem('signup_password');

        if (savedEmail) {
            setEmail(savedEmail);
        }
        if (savedPassword) {
            setPassword(savedPassword);
        }

        // Limpiar el sessionStorage después de rellenar los campos
        sessionStorage.removeItem('signup_email');
        sessionStorage.removeItem('signup_password');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            const data = await response.json();  // Leer la respuesta del backend

            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                navigate('/private');  // Redirige al área privada
            } else if (response.status === 404) {
                // Usuario no registrado
                Swal.fire({
                    title: 'Usuario no registrado',
                    text: '¿Deseas registrarte?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem('signup_email', email);
                        navigate('/signup');  // Redirige a la página de registro
                    } else {
                        setEmail('');
                        setPassword('');
                    }
                });
            } else if (response.status === 401) {
                // Contraseña incorrecta
                Swal.fire({
                    title: 'Contraseña incorrecta',
                    text: 'Por favor, intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    setPassword('');  // Limpiar la contraseña
                });
            } else {
                Swal.fire({
                    title: 'Error al iniciar sesión',
                    text: data.msg || 'Error desconocido',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduzca su email"
                    required
                    autoComplete="off"
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca su contraseña"
                    required
                    autoComplete="off"
                />
                <button type='submit' className='login-button'>Iniciar Sesión</button>
            </form>
        </div>
    );
};
