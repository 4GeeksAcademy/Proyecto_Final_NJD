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
        // Leer el email del sessionStorage si existe
        const savedEmail = sessionStorage.getItem("signup_email");
        if (savedEmail) {
            setFormData((prevData) => ({
                ...prevData,
                email: savedEmail,
            }));
        }

        // Limpiar el sessionStorage después de rellenar el campo de email
        sessionStorage.removeItem("signup_email");
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
            console.log(formData)

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
            console.log(response)

            if (response.ok) {
                sessionStorage.setItem("signup_email", formData.email);
                sessionStorage.setItem("signup_password", formData.password);

                setSuccessMessage("Usuario registrado con éxito");
                setErrorMessage("");
                Swal.fire({
                    title: "Registro exitoso",
                    text: "Serás redirigido al login.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    //   navigate("/login");
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
                    navigate("/login");
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
        <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="signupModalLabel">
                            Registro
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}



                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="signupFirstName" className="form-label">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="signupFirstName"  
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="signupLastName" className="form-label">
                                    Apellidos
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="signupLastName" 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="signupEmail" className="form-label">  
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="signupEmail"  
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="signupPassword" className="form-label">  
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="signupPassword"  
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="signupRepeatPassword" className="form-label">
                                    Repetir contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="signupRepeatPassword"
                                    name="repeatPassword"
                                    value={formData.repeatPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="signupPhone" className="form-label">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="signupPhone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Registrarse
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};
