import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../img/logoblanco.png";
import "/workspaces/Proyecto_Final_NJD/src/front/styles/index.css";

export const Navbar = ({ user, favoritosCount = 0, favoritos = [], eliminarFavorito }) => {
    const location = useLocation();
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const handleShowFavoritesModal = () => setShowFavoritesModal(true);
    const handleCloseFavoritesModal = () => setShowFavoritesModal(false);

    const handleShowUserModal = () => setShowUserModal(true);
    const handleCloseUserModal = () => setShowUserModal(false);

    const eliminarReserva = (reservaId) => {
        console.log(`Reserva ${reservaId} eliminada`);
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
                        {location.pathname === "/private" ? (
                            <>
                                <button className="btn btn-elegant" onClick={handleShowFavoritesModal}>
                                    Favoritos ({favoritosCount})
                                </button>
                                <span
                                    className="navbar-text ms-3"
                                    style={{ cursor: "pointer", color: "#f1c40f", fontWeight: "bold" }}
                                    onClick={handleShowUserModal}
                                >
                                    {user?.name}
                                </span>
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


            {/* Modal de Favoritos */}
            {showFavoritesModal && (
                <div className="modal fade show d-block " id="favoritesModal" tabIndex="-1" role="dialog" aria-labelledby="favoritesModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="favoritesModalLabel">Tus Favoritos</h5>

                            </div>
                            <div className="modal-body-fav">
                                {favoritos.length === 0 ? (
                                    <p>No tienes favoritos aún.</p>
                                ) : (
                                    <ul className="list-group">
                                        {favoritos.map(fav => (
                                            <li key={fav.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{fav.name}</span>
                                                <button className="btn btn-danger btn-sm" onClick={() => eliminarFavorito(fav.id)}>Eliminar</button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseFavoritesModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Usuario */}
            {showUserModal && (
                <div className="user-modal-container">
                    <div className="modal-content user-modal"> {/* Asegúrate que las clases sean correctas */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="userModalLabel">Información de Usuario</h5>
                            <button type="button" className="close" aria-label="Close" onClick={handleCloseUserModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="user-info-section">
                                <p><strong>Nombre:</strong> {user?.name}</p>
                                <div className="form-group">
                                    <label htmlFor="email"><strong>Correo electrónico</strong></label>
                                    <input type="email" className="form-control" id="email" defaultValue="daria@example.com" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone"><strong>Teléfono</strong></label>
                                    <input type="tel" className="form-control" id="phone" defaultValue="+34 645 28 79 37" />
                                </div>
                            </div>
                            <div className="reservas-section">
                                <label htmlFor="reservas"><strong>Tus reservas</strong></label>
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Reserva 1
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarReserva(1)}>Eliminar</button>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Reserva 2
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarReserva(2)}>Eliminar</button>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Reserva 3
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarReserva(3)}>Eliminar</button>
                                    </li>
                                </ul>
                            </div>
                            <button className="btn btn-dark mt-3"><strong>Guardar cambios</strong></button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};
