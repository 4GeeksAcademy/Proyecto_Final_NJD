import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';
export const LoginRestaurante = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const loginModalElement = document.getElementById('loginRestaurantModal');
        const onModalOpen = () => {
            const savedEmail = sessionStorage.getItem('signup_email');
            const savedPassword = sessionStorage.getItem('signup_password');
            if (!savedEmail) setEmail('');
            if (!savedPassword) setPassword('');
            if (savedEmail) setEmail(savedEmail);
            if (savedPassword) setPassword(savedPassword);
            sessionStorage.removeItem('signup_email');
            sessionStorage.removeItem('signup_password');
        };
        loginModalElement.addEventListener('shown.bs.modal', onModalOpen);
        return () => {
            loginModalElement.removeEventListener('shown.bs.modal', onModalOpen);
        };
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/login/restaurante", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });
            console.log('RESPUESTA', response);
            // Verifica si el estado de la respuesta es exitoso (200-299)
            if (!response.ok) {
                if (response.status === 404) {
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
                            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal'));
                            if (loginModal) loginModal.hide();
                            const signupModal = new bootstrap.Modal(document.getElementById('registerModalRestaurante'));
                            signupModal.show();
                        } else {
                            setEmail('');
                            setPassword('');
                        }
                    });
                } else if (response.status === 401) {
                    Swal.fire({
                        title: 'Contraseña incorrecta',
                        text: 'Por favor, intenta nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        setPassword('');
                    });
                } else {
                    Swal.fire({
                        title: 'Error al iniciar sesión',
                        text: 'Respuesta no exitosa del servidor.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
                return;
            }
            // Si la respuesta es exitosa (status 200), intenta obtener los datos JSON
            const data = await response.json();
            console.log('datos:', data);
            // Manejo del éxito
            sessionStorage.setItem('token', data.access_token);  // Guardar token de acceso
            sessionStorage.setItem('restaurant_name', data.restaurant_name);  // Guardar nombre del restaurante en sessionStorage
            // Intenta cerrar el modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal')); // Usa el ID correcto
            if (loginModal) {
                loginModal.hide();  // Cierra el modal de login
                console.log('Modal cerrado');
            } else {
                console.error('Modal no encontrado');
            }
            navigate('/registro_restaurante');  // Redirige al dashboard del restaurante
        } catch (error) {
            console.error('Error de conexión o problema grave:', error);
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
                <label htmlFor="loginRestaurantPassword" className="form-label">Contraseña</label>
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