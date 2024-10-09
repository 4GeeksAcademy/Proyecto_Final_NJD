import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import "../../styles/index.css";

export const SignupRestaurante = () => {
    const { actions } = useContext(Context); // Acceder a las acciones del flux
    const [formData, setFormData] = useState({
        restaurantName: "",
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
                restaurantName: "",
                email: "",
                password: "",
                repeatPassword: "",
                phone: "",
            });
            setErrorMessage("");
            setSuccessMessage("");
        };

        const registerModalElement = document.getElementById("registerModalRestaurante");
        registerModalElement.addEventListener('hidden.bs.modal', resetFormData);
        
        return () => {
            registerModalElement.removeEventListener('hidden.bs.modal', resetFormData);
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

        const result = await actions.signupRestaurante(formData); // Llama a la acción del flux

        if (result.success) {
            sessionStorage.setItem("signup_email", formData.email);
            sessionStorage.setItem("signup_password", formData.password);
            
            Swal.fire({
                title: result.message,
                text: "Serás redirigido al login.",
                icon: "success",
                confirmButtonText: "Aceptar",
            }).then(() => {
                const registerModal = document.getElementById("registerModalRestaurante");
                const registerModalInstance = bootstrap.Modal.getInstance(registerModal);
                if (registerModalInstance) registerModalInstance.hide();

                const loginModal = new bootstrap.Modal(document.getElementById("loginRestaurantModal"));
                loginModal.show();
            });

            setFormData({
                restaurantName: "",
                email: "",
                password: "",
                repeatPassword: "",
                phone: "",
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.message,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="signupRestaurantName" className="form-label">Nombre del Restaurante</label>
                    <input
                        type="text"
                        className="form-control"
                        id="signupRestaurantName"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        placeholder="Nombre del Restaurante"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupRestaurantEmail" className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="signupRestaurantEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@correo.com"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupRestaurantPassword" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="signupRestaurantPassword"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Escribe tu contraseña"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupRestaurantRepeatPassword" className="form-label">Repetir contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="signupRestaurantRepeatPassword"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="signupRestaurantPhone" className="form-label">Teléfono</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="signupRestaurantPhone"
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
