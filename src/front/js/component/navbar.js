import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import logoImage from "../../img/logoblanco.png";
import { LoginUsuario } from "./login_usuario";
import { SignupUsuario } from "./signup_usuario";
import "/workspaces/Proyecto_Final_NJD/src/front/styles/index.css";

export const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);  // Almacenamos el userId
    const [isRestaurant, setIsRestaurant] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const handleStorageChange = () => {
            const token = sessionStorage.getItem("token");
            const storedUserName = sessionStorage.getItem("user_name");
            const storedUserId = sessionStorage.getItem("user_id");  // Obtenemos el user_id de sessionStorage
            const storedRestaurantName = sessionStorage.getItem("restaurant_name");

            if (token && storedRestaurantName) {
                setIsRestaurant(true);
                setUserName(storedRestaurantName);
                setLoggedIn(true);
            } 
            else if (token && storedUserName && storedUserId) {
                setIsRestaurant(false);
                setUserName(storedUserName);
                setUserId(storedUserId);  // Actualizamos el estado con el user_id
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
                setUserName("");
                setUserId(null);  // Limpiamos el user_id si no está logueado
                setIsRestaurant(false);
            }
        };

        // Llamamos una vez al montarse el componente
        handleStorageChange();

        // Añadir un listener para escuchar los cambios en sessionStorage
        window.addEventListener("storage", handleStorageChange);

        // Limpiar el listener cuando el componente se desmonta
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [userName, sessionStorage.getItem('restaurant_name')]);

    const handleLogin = (userName, userId, isRestaurantLogin = false) => {
        if (isRestaurantLogin) {
            sessionStorage.setItem("restaurant_name", userName);
        } else {
            sessionStorage.setItem("user_name", userName);
            sessionStorage.setItem("user_id", userId);  // Guardamos también el user_id
        }

        setUserName(userName);
        setUserId(userId);
        setIsRestaurant(isRestaurantLogin);
        setLoggedIn(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_name");
        sessionStorage.removeItem("restaurant_name");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_password");

        setLoggedIn(false);
        setUserName("");
        setUserId(null);  // Limpiamos el user_id al hacer logout
        setIsRestaurant(false);

        navigate("/");
    };

    // Función para manejar la navegación al área privada del usuario
    const handlePrivateAreaNavigation = () => {
        const currentUserId = sessionStorage.getItem("user_id");
        console.log(currentUserId)
        if (currentUserId) {
            navigate(`/private/${currentUserId}`);
        }
    };

    return (
        <>
            <nav className="navbar navbar-dark">
                <div className="container">
                    <Link to="/">
                        <span className="navbar-brand">
                            <img src={logoImage} alt="Logo" />
                        </span>
                    </Link>
                    <div className="ml-auto nav-links">
                        {loggedIn ? (
                            <>
                                {isRestaurant ? (
                                    <>
                                        <span className="navbar-text">Area privada restaurante {userName}</span>
                                        <button className="btn btn-secondary ml-2" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="navbar-text">
                                            <i
                                                className="fa-solid fa-user"
                                                style={{ cursor: "pointer", marginRight: "8px" }}
                                                onClick={handlePrivateAreaNavigation}  // Ahora correctamente referenciado
                                            ></i>
                                            Hola {userName}
                                        </span>
                                        <button className="btn btn-secondary ml-2" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <a href="#loginModal" data-bs-toggle="modal" data-bs-target="#loginModal">
                                    Iniciar Sesión
                                </a>
                                <a href="#signupModal" data-bs-toggle="modal" data-bs-target="#signupModal">
                                    Registro
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Modal LOGIN */}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <LoginUsuario onLogin={handleLogin} /> {/* Pasamos la función handleLogin */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal SIGNUP */}
            <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="signupModalLabel">Registro</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <SignupUsuario /> {/* Usamos el componente SignupUsuario */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
