import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/index.css";
import { Context } from "../store/appContext";

export const SignupUsuario = ({ onLogin }) => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
        phone: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const resetFormData = () => {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                repeatPassword: "",
                phone: "",
            });
            setErrorMessage("");
            setSuccessMessage("");  
        };
    
        const signupModalElement = document.getElementById("signupModal");
    
        signupModalElement.addEventListener('hidden.bs.modal', resetFormData);
    
        return () => {
            signupModalElement.removeEventListener('hidden.bs.modal', resetFormData);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            setErrorMessage("Las contraseñas no coinciden");
            return;
        }

        const result = await actions.signupUsuario(formData);

        if (result.success) {
            const signupModal = document.getElementById("signupModal");
            const signupModalInstance = bootstrap.Modal.getInstance(signupModal);
            signupModalInstance.hide();

            // Realizar login automático
            const loginResult = await actions.loginUsuario(formData.email, formData.password);
            
            if (loginResult.success) {
                sessionStorage.setItem('token', loginResult.data.access_token);
                sessionStorage.setItem('user_name', loginResult.data.user_name);
                actions.actualizarNombreUsuario(loginResult.data.user_name);
                
                // Llamar a onLogin para actualizar Navbar
                onLogin(loginResult.data.user_name, loginResult.data.user_id);

                Swal.fire({
                    title: "Usuario registrado con éxito",
                    text: "Serás redirigido a tu área privada.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    navigate('/private');
                });
            }
        } else if (result.message === "El email ya existe") {
            Swal.fire({
                title: "El email ya existe",
                text: "Por favor, inicia sesión o utiliza otro correo.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
        } else {
            setErrorMessage(result.message || "Error al registrar el usuario");
        }
    };

    return (
        <div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="signupFirstName" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="signupFirstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupLastName" className="form-label">Apellidos</label>
                    <input
                        type="text"
                        className="form-control"
                        id="signupLastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Apellidos"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupEmail" className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="signupEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@correo.com"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupPassword" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="signupPassword"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Escribe tu contraseña"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupRepeatPassword" className="form-label">Repetir contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="signupRepeatPassword"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupPhone" className="form-label">Teléfono</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="signupPhone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Número de teléfono"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Registrarse</button>
            </form>
        </div>
    );
};