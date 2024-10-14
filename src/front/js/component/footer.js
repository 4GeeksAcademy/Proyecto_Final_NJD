import React, { useState, useEffect } from "react";
import { LoginRestaurante } from "./login_restaurante";
import { SignupRestaurante } from "./signup_restaurante";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../styles/index.css";

export const Footer = () => {
    const [userName, setUserName] = useState(""); 

    const handleLogin = (name) => {
        setUserName(name);
        console.log("Usuario logueado:", name);
    };

    return (
        <>
            <footer>
                <div className="footer-container">
                    <div className="footer-section">
                        <h4>Hoy no cocino</h4>
                        <ul>
                            <li>Reservas en los mejores restaurantes de alta calidad.</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Enlaces útiles</h4>
                        <ul>

                            <li>
                                <Link to="faq">Preguntas frecuentes</Link>
                            </li>
                            <li>
                                <Link to="about">Sobre nosotros</Link>
                            </li>
    
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Restaurantes</h4>
                        <ul>
                            <li>
                                <a href="#loginRestaurantModal" data-bs-toggle="modal" data-bs-target="#loginRestaurantModal">
                                    Iniciar Sesión
                                </a>
                            </li>
                            <li>
                                <a href="#registerModalRestaurante" data-bs-toggle="modal" data-bs-target="#registerModalRestaurante">
                                    Registro
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contáctanos</h4>
                        <ul>
                            <li>Email: hoynococino.ceo@gmail.com</li>
                            <li>Teléfono: +123 456 789</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Nuestras redes</h4>
                        <ul>
                            <li>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> |
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-small-text">&copy; 2024 Hoy no cocino. Todos los derechos reservados.</p>
                </div>
            </footer>

            <div className="modal fade" id="loginRestaurantModal" tabIndex="-1" aria-labelledby="loginRestaurantModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginRestaurantModalLabel">Iniciar Sesión Restaurante</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <LoginRestaurante onLogin={handleLogin} /> 
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="registerModalRestaurante" tabIndex="-1" aria-labelledby="registerModalRestauranteLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="registerModalRestauranteLabel">Registro Restaurante</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <SignupRestaurante /> 
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
