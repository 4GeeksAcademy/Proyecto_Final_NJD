import React, { useState } from "react";
import Swal from 'sweetalert2';
import "/workspaces/Proyecto_Final_NJD/src/front/styles/index.css";

export const SignupModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Campo para confirmar contraseña
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,16}$/;  // 8-16 caracteres, al menos una mayúscula y un número
        return passwordRegex.test(password);
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (!isValidPassword(password)) {
            Swal.fire({
                title: 'Contraseña no válida',
                text: 'La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula y un número.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        try {
            const response = await fetch("https://glorious-space-disco-4jqxg79xpp65f7grx-3001.app.github.dev/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    nombres: firstName,
                    apellidos: lastName,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Registro exitoso',
                    text: 'Serás redirigido al login.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    onClose();  // Cerrar modal después del registro exitoso
                });
            } else if (response.status === 409) {
                Swal.fire({
                    title: 'Usuario ya registrado',
                    text: 'Por favor, inicia sesión.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.msg || 'Error al registrarse',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de conexión',
                text: 'Intenta de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }

        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>X</button>
                <h2>Registro</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Nombre"
                        required
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Apellidos"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repetir Contraseña"
                        required
                    />
                    <button type="submit">Registrarse</button>
                </form>
            </div>
        </div>
    );
};
