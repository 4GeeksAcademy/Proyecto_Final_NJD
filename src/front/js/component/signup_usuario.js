import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/index.css";

export const SignupUsuario = () => {
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
            setSuccessMessage("");  // Limpiamos el mensaje de éxito al cerrar el modal
        };
    
        const signupModalElement = document.getElementById("signupModal");
    
        // Limpiar el formulario cuando se cierra el modal
        signupModalElement.addEventListener('hidden.bs.modal', resetFormData);
    
        return () => {
            // Eliminar el listener cuando el componente se desmonte
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

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombres: formData.firstName,
                    apellidos: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    telefono: formData.phone,
                }),
            });

            if (response.ok) {
                sessionStorage.setItem("signup_email", formData.email);
                sessionStorage.setItem("signup_password", formData.password);

                setSuccessMessage("Usuario registrado con éxito");
                setErrorMessage("");
                Swal.fire({
                    title: "Usuario registrado con éxito",
                    text: "Serás redirigido al login.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    // Guardar email y password en sessionStorage
                    sessionStorage.setItem("signup_email", formData.email);
                    sessionStorage.setItem("signup_password", formData.password);
                   
                    // Cerrar el modal de registro usando Bootstrap
                    const signupModal = document.getElementById("signupModal");
                    const signupModalInstance = bootstrap.Modal.getInstance(signupModal);
                    signupModalInstance.hide();
                    setSuccessMessage("");  // Aquí también limpiamos el mensaje

                    // Abrir el modal de login usando Bootstrap
                    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
                    loginModal.show();
                });

                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    repeatPassword: "",
                    phone: "",
                });
            } else if (response.status === 409) {
                Swal.fire({
                    title: "Usuario ya registrado",
                    text: "Serás redirigido a la página de inicio de sesión.",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                }).then(() => {

                     // Guardar email y password en sessionStorage
                    sessionStorage.setItem("signup_email", formData.email);
                    sessionStorage.setItem("signup_password", formData.password);

                    const signupModal = document.getElementById("signupModal");
                    const signupModalInstance = bootstrap.Modal.getInstance(signupModal);
                    signupModalInstance.hide();

                    // Abrir el modal de login usando Bootstrap
                    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
                    loginModal.show();
                });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.msg || "Error al registrar el usuario");
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
