import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';
import { Context } from '../store/appContext';

export const LoginRestaurante = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { actions } = useContext(Context);
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

        const result = await actions.loginRestaurante({ email, password });

        if (result.success) {
            sessionStorage.setItem('token', result.data.access_token);  
            sessionStorage.setItem('restaurant_name', result.data.restaurant_name);  
            sessionStorage.setItem('restaurant_id', result.data.restaurant_id);
            console.log(result.data);  

            onLogin(result.data.restaurant_name);

            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal')); 
            if (loginModal) loginModal.hide();  
            if (result.data.registro_completo){
                navigate(`/vistaPrivadaRestaurante/${result.data.restaurant_id}`)
            } else {
                navigate('/registro_restaurante');
            }

            window.location.reload()

        } else if (result.status === 404) {
            Swal.fire({
                title: 'Restaurante no registrado',
                text: '¿Deseas registrarte?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem('signup_email', email);  

                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginRestaurantModal'));
                    if (loginModal) loginModal.hide();

                    const signupModal = new bootstrap.Modal(document.getElementById('registerModalRestaurante'));
                    signupModal.show();
                } else {
                    setEmail('');  
                    setPassword(''); 
                }
            });

        } else if (result.status === 401) {
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
                text: 'Respuesta no valida del servidor.',
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

            <div className="mt-3 enlaces_contraseñas">
                <a href="#" onClick={() => {
                    const signupModal = new bootstrap.Modal(document.getElementById('registerModalRestaurante'));
                    signupModal.show();
                }}>No tienes cuenta? Regístrate</a>
                
            </div>
        </form>
    );
};
