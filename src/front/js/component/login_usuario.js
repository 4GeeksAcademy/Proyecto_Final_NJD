import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';
import { Context } from "../store/appContext";  

export const LoginUsuario = ({ onLogin }) => {
    const { actions } = useContext(Context);  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

   useEffect(() => {
        const loginModalElement = document.getElementById('loginModal');

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
    
        console.log('Intentando login con:', {
            email: email,
            emailLength: email.length,
            passwordLength: password.length
        });
    
        try {
            const result = await actions.loginUsuario(email, password);
            console.log('Resultado completo del login:', result);
            console.log('Tipo de resultado:', typeof result);
            console.log('Propiedades del resultado:', Object.keys(result));
        } catch (error) {
            console.error('Error completo de login:', error);
        }

        
        const result = await actions.loginUsuario(email, password);
        console.log(result)


        if (result.success) {
            sessionStorage.setItem('token', result.data.access_token);  
            sessionStorage.setItem('user_name', result.data.user_name);
            actions.actualizarNombreUsuario(result.data.user_name)
            
            onLogin(result.data.user_name,result.data.user_id);

            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();  
            navigate('/private');  

        } else if (result.error === 'Usuario no registrado') {
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

            <div className="mt-3 enlaces_contraseñas">
                <a href="#" onClick={() => {
                    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
                    signupModal.show();
                }}>¿No tienes cuenta? Regístrate</a>
                
            </div>
        </form>
    );
};
