import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../img/logoblanco.png";
import { signup } from "./signup";  // Importamos el componente Signup
import "/workspaces/Proyecto_Final_NJD/src/front/styles/index.css";

export const Navbar = () => {
    const [showSignup, setShowSignup] = useState(false);  // Controlar el modal de Signup

    const handleOpenSignup = () => {
        setShowSignup(true);  // Mostrar el modal
    };

    const handleCloseSignup = () => {
        setShowSignup(false);  // Cerrar el modal
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand">
                        <img src={logoImage} alt="Logo" />
                    </span>
                </Link>
                <div className="ml-auto nav-links">
                    <a className="iniciar" href="/login">Iniciar Sesión</a>
                    <a className="registrar" href="/register">Registro</a>
                </div>
            </div>

            {/* Mostrar el modal de Signup si showSignup es true */}
            {showSignup && <signup onClose={handleCloseSignup} />}
        </nav>
    );
};
