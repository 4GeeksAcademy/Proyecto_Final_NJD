import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';
import { Context } from "../store/appContext";  // Importar el contexto

export const LoginUsuario = ({ onLogin }) => {
    const { actions } = useContext(Context);  // Acceder a las acciones del flux
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

   useEffect(() => {
        const loginModalElement = document.getElementById('loginModal');

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

        // Llama a la acción del flux
        const result = await actions.loginUsuario(email, password);
        console.log(result)


        if (result.success) {
            sessionStorage.setItem('token', result.data.access_token);  // Guardar el token en sessionStorage
            sessionStorage.setItem('user_name', result.data.user_name);  // Guarda el nombre de usuario
            // sessionStorage.setItem('user_id', result.data.user_id);
            
            // Actualiza el estado en la Navbar
            onLogin(result.data.user_name,result.data.user_id);

            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();  // Cierra el modal de login
            navigate('/private');  // Redirige a la página privada

        } else if (result.error === 'Usuario no registrado') {
            // Usuario no registrado
            Swal.fire({
                title: 'Usuario no registrado',
                text: '¿Deseas registrarte?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((res) => {
                if (res.isConfirmed) {
                    sessionStorage.setItem('signup_email', email);
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (loginModal) loginModal.hide();
                    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
                    signupModal.show();
                } else {
                    setEmail('');
                    setPassword('');
                }
            });

        } else if (result.error === 'Contraseña incorrecta') {
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
                text: result.error || 'Error desconocido',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="loginEmail"
                    placeholder="example@correo.com"
                    required
                    autoComplete="off"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="loginPassword"
                    placeholder="Contraseña"
                    required
                    autoComplete="off"
                />
            </div>
            <button type='submit' className='btn btn-primary'>Iniciar Sesión</button>

            {/* Enlaces para registro y recuperación de contraseña */}
            <div className="mt-3 enlaces_contraseñas">
                <a href="#" onClick={() => {
                    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
                    signupModal.show();
                }}>No tienes cuenta? Regístrate</a>
                <br />
                <a href="#" onClick={() => navigate('/recover/password')}>¿Olvidaste la contraseña?</a>
            </div>
        </form>
    );
};
