import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2';

export const ModalVerMisFavoritos = ({ isOpen, onClose }) => {
    const { store, actions } = useContext(Context);
    const [favoritos, setFavoritos] = useState([]);
    const [changesMade, setChangesMade] = useState(false); // Para saber si se ha cambiado algo
    const [updatedFavorites, setUpdatedFavorites] = useState([]); // Lista de favoritos actualizados

    const fetchFavoritos = async () => {
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('user_id');
        const result = await actions.obtenerFavoritosDelUsuario(user_id);
        setFavoritos(result.restaurantes_favoritos || []);
        setUpdatedFavorites(result.restaurantes_favoritos || []);
    };

    useEffect(() => {
        if (isOpen) {
            fetchFavoritos();
        }
    }, [isOpen]);

    const toggleFavorite = (restaurantId) => {
        const isFavorite = updatedFavorites.some(fav => fav.id === restaurantId);

        if (isFavorite) {
            setUpdatedFavorites(updatedFavorites.filter(fav => fav.id !== restaurantId)); // Eliminar de favoritos
        } else {
            const restaurant = favoritos.find(fav => fav.id === restaurantId);
            setUpdatedFavorites([...updatedFavorites, restaurant]); // Agregar de vuelta a favoritos
        }

        setChangesMade(true); // Marcar que se ha hecho un cambio
    };

    const handleGuardarCambios = async () => {
        const user_id = sessionStorage.getItem('user_id');
        const originalFavorites = favoritos.map(fav => fav.id);
        const newFavorites = updatedFavorites.map(fav => fav.id);

        const favoritesToRemove = originalFavorites.filter(id => !newFavorites.includes(id));
        const favoritesToAdd = newFavorites.filter(id => !originalFavorites.includes(id));

        for (let restaurantId of favoritesToRemove) {
            await actions.eliminarFavorito(user_id, restaurantId);
        }

        for (let restaurantId of favoritesToAdd) {
            await actions.agregarFavorito(user_id, restaurantId);
        }

        Swal.fire({
            title: "Éxito",
            text: "Se han guardado los cambios.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });

        onClose(); // Cerrar modal después de guardar
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("modal")) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            aria-labelledby="favModalLabel"
            aria-hidden="true"
            onClick={handleBackdropClick}  // Detecta el clic en el fondo
        >
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="favModalLabel">Tus favoritos</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {updatedFavorites && updatedFavorites.length > 0 ? (
                            <div className="row">
                                {favoritos.map((favorito, index) => (
                                    <div key={index} className="col-md-6 mb-3">
                                        <div className="card d-flex justify-content-between align-items-center">
                                            <div className="card-body">
                                                <strong>Restaurante:</strong> {favorito.nombre}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No tienes favoritos.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        <button className="btn btn-dark" onClick={handleGuardarCambios} disabled={!changesMade}>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
