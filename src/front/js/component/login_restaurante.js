import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';

export const LoginRestaurante = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loginModalElement = document.getElementById('loginRestaurantModal'); // Corregido

        const onModalOpen = () => {
            const savedEmail = sessionStorage.getItem('signup_email');
            const savedPassword = sessionStorage.getItem('signup_password');

            // Si no hay email o contraseña guardada en sessionStorage, limpia los campos
            if (!savedEmail) setEmail('');
            if (!savedPassword) setPassword('');

            if (savedEmail) setEmail(savedEmail);
            if (savedPassword) setPassword(savedPassword);

            // Limpiar el sessionStorage después de rellenar los campos
            sessionStorage.removeItem('signup_email');
            sessionStorage.removeItem('signup_password');
        };

        // Añadir un listener para cuando se abra el modal
        if (loginModalElement) {
            loginModalElement.addEventListener('shown.bs.modal', onModalOpen);
        }

        return () => {
            // Eliminar el listener cuando el componente se desmonte
            if (loginModalElement) {
                loginModalElement.removeEventListener('shown.bs.modal', onModalOpen);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(process.env.BACKEND_URL + "api/login/restaurante", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            // Verificar si la respuesta es un JSON válido
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Respuesta no es JSON");
            }
            const data = await response.json();  // Leer la respuesta del backend

            if (response.ok) {
                sessionStorage.setItem('token', data.access_token);  // Guardar token de acceso
                sessionStorage.setItem('restaurant_name', data.restaurant_name);  // Guardar nombre del restaurante en sessionStorage
                console.log(data);  // Verifica qué recibe del servidor

                // Actualizar el estado en el componente padre o Navbar
                onLogin(data.restaurant_name);

                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal')); // Corregido
                if (loginModal) loginModal.hide();  // Cierra el modal de login
                navigate('/dashboard_restaurante');  // Redirige al dashboard del restaurante

            } else if (response.status === 404) {
                // Restaurante no registrado
                Swal.fire({
                    title: 'Restaurante no registrado',
                    text: '¿Deseas registrarte?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem('signup_email', email);  // Guardar el email del intento de login

                        // Cerrar el modal de login
                        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal')); // Corregido
                        if (loginModal) loginModal.hide();

                        // Abrir el modal de registro
                        const signupModal = new bootstrap.Modal(document.getElementById('registerModalRestaurante')); // Corregido
                        signupModal.show();
                    } else {
                        setEmail('');  // Limpiar el email si cancela
                        setPassword('');  // Limpiar la contraseña si cancela
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
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="loginRestaurantEmail" className="form-label">Correo electrónico</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="loginRestaurantEmail"
                    placeholder="example@correo.com"
                    required
                    autoComplete="off"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="loginRestaurantPassword" className="form-label">Contraseña</label> {/* Corregido */}
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="loginRestaurantPassword"
                    placeholder="Contraseña"
                    required
                    autoComplete="off"
                />
            </div>
            <button type='submit' className='btn btn-primary'>Iniciar Sesión</button>
        </form>
    );
};
