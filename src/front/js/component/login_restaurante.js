import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';

export const LoginRestaurante = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const loginModalElement = document.getElementById('loginRestaurantModal');

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
        loginModalElement.addEventListener('shown.bs.modal', onModalOpen);

        return () => {
            // Eliminar el listener cuando el componente se desmonte
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

            const data = await response.json();  // Leer la respuesta del backend

            if (response.ok) {
                sessionStorage.setItem('token', data.access_token);  // Guardar token de acceso
                sessionStorage.setItem('restaurant_name', data.restaurant_name);  // Guardar nombre del restaurante en sessionStorage
                sessionStorage.setItem('restaurant_id', data.restaurant_id)
                console.log(data);  // Verifica qué recibe del servidor

                // Actualiza el estado en la Navbar
                onLogin(data.restaurant_name);

                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal')); // Usa el ID correcto
                if (loginModal) loginModal.hide();  // Cierra el modal de login
                navigate('/registro_restaurante')

            } else if (response.status === 404) {
                // Usuario no registrado
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
                        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal'));
                        if (loginModal) loginModal.hide();

                        // Abrir el modal de signup
                        const signupModal = new bootstrap.Modal(document.getElementById('registerModalRestaurante'));
                        signupModal.show();
                    } else {
                        setEmail('');  // Limpiar el email si cancela
                        setPassword(''); //Limpiar la contraseña si cancela
                    }
                });

            } else if (response.status === 401) {
                // Contraseña icorrecta
                Swal.fire({
                    title: 'Contraseña incorrecta',
                    text: 'Por favor, intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    setPassword(''); // Limpiar la contraseña
                });
            } else {
                Swal.fire({
                    title: 'Error al iniciar sesión',
                    text: 'Respuesta no valida del servidor.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            console.error('Error de conexión o problema grave:', error);
            Swal.fire({
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
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

            {/* Enlaces para registro y recuperación de contraseña */}
            <div className="mt-3 enlaces_contraseñas">
                <a href="#" onClick={() => {
                    const signupModal = new bootstrap.Modal(document.getElementById('registerModalRestaurante'));
                    signupModal.show();
                }}>No tienes cuenta? Regístrate</a>
                <br />
                <a href="#" onClick={() => navigate('/recuperacionContraseñaUsuario')}>¿Olvidaste la contraseña?</a>
            </div>
        </form>
    );
};