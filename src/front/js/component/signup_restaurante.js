import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/index.css";

export const SignupRestaurante = () => {
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
            setSuccessMessage(""); // Limpiamos el mensaje de éxito al cerrar el modal
        };

        const registerModalElement = document.getElementById("registerModalRestaurante"); // Cambiado por el ID correcto del modal

        // Limpiar el formulario cuando se cierra el modal
        if (registerModalElement) {
            registerModalElement.addEventListener('hidden.bs.modal', resetFormData);
        }

        return () => {
            // Eliminar el listener cuando el componente se desmonte
            if (registerModalElement) {
                registerModalElement.removeEventListener('hidden.bs.modal', resetFormData);
            }
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

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/signup/restaurante", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.restaurantName,
                    email: formData.email,
                    password: formData.password, // Asegúrate de tener el campo "password" en el backend
                    telefono: formData.phone,
                }),
            });

            if (response.ok) {
                setSuccessMessage("Restaurante registrado con éxito");
                setErrorMessage("");

                Swal.fire({
                    title: "Restaurante registrado con éxito",
                    text: "Serás redirigido al login.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    const registerModal = document.getElementById("registerModalRestaurante"); // Cambiado por el ID correcto del modal
                    const registerModalInstance = bootstrap.Modal.getInstance(registerModal);
                    if (registerModalInstance) registerModalInstance.hide();  // Aseguramos que se cierra el modal de registro

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
            } else if (response.status === 409) {
                Swal.fire({
                    title: "Restaurante ya registrado",
                    text: "Serás redirigido a la página de inicio de sesión.",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    const registerModal = document.getElementById("registerModalRestaurante"); // Cambiado por el ID correcto del modal
                    const registerModalInstance = bootstrap.Modal.getInstance(registerModal);
                    if (registerModalInstance) registerModalInstance.hide();

                    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
                    loginModal.show();
                });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.msg || "Error al registrar el restaurante");
            }
        } catch (error) {
            Swal.fire({
                title: "Error de conexión",
                text: "Intenta de nuevo más tarde.",
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
