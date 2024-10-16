import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import logoImage from "../../img/logoblanco.png";
import { LoginUsuario } from "./login_usuario";
import { SignupUsuario } from "./signup_usuario";
import '../../styles/navbar.css';
import "../../styles/index.css"; 

export const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);  
    const [isRestaurant, setIsRestaurant] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const handleStorageChange = () => {
            const token = sessionStorage.getItem("token");
            const storedUserName = sessionStorage.getItem("user_name");
            const storedUserId = sessionStorage.getItem("user_id");  
            const storedRestaurantName = sessionStorage.getItem("restaurant_name");

            if (token && storedRestaurantName) {
                setIsRestaurant(true);
                setUserName(storedRestaurantName);
                setLoggedIn(true);
            } 
            else if (token && storedUserName && storedUserId) {
                setIsRestaurant(false);
                setUserName(storedUserName);
                setUserId(storedUserId);  
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
                setUserName("");
                setUserId(null);  
                setIsRestaurant(false);
            }
        };

        handleStorageChange();

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [userName, sessionStorage.getItem('restaurant_name')]);

    const handleLogin = (userName, userId, isRestaurantLogin = false) => {
        if (isRestaurantLogin) {
            sessionStorage.setItem("restaurant_name", userName);
        } else {
            sessionStorage.setItem("user_name", userName);
            sessionStorage.setItem("user_id", userId);  
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
        setUserId(null);  
        setIsRestaurant(false);

        navigate("/");
    };

    const handlePrivateAreaNavigation = () => {
        const currentUserId = sessionStorage.getItem("user_id");
        console.log(currentUserId)
        if (currentUserId) {
            navigate(`/private/${currentUserId}`);
        }
    };

    const handlePrivateAreaRestaurante = () => {
        const restaurantId = sessionStorage.getItem("restaurant_id");
        if (restaurantId) {
            navigate(`/vistaPrivadaRestaurante/${restaurantId}`);
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
                                        <span className="navbar-text">
                                            <i
                                                className="fa-solid fa-utensils"
                                                style={{ cursor: "pointer", marginRight: "8px" }}
                                                onClick={handlePrivateAreaRestaurante} 
                                            ></i>
                                            Area privada restaurante {userName}
                                        </span>
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
                                                onClick={handlePrivateAreaNavigation}  
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

            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                        </div>
                        <div className="modal-body">
                            <LoginUsuario onLogin={handleLogin} /> 
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="signupModalLabel">Registro</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                        </div>
                        <div className="modal-body">
                            <SignupUsuario /> 
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
