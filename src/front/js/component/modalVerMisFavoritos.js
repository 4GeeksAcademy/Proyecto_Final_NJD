import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';

export const ModalVerMisFavoritos = ({ isOpen, onClose }) => {
    const { store, actions } = useContext(Context);
    const [favoritos, setFavoritos] = useState([]);
    const fetchFavoritos = async () => {
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('user_id');
        const result = await actions.obtenerFavoritosDelUsuario(user_id);
        console.log(result)

        setFavoritos(result);
    };
    useEffect(() => {
        
            
            fetchFavoritos();
        
    }, []); 
console.log(favoritos)
    const eliminarFavEnLista = (idEliminar) => {
        setFavoritos((prevFav) => prevFav.filter(favorito => favorito.id !== idEliminar));
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">  
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="favModalLabel">Tus favoritos</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {favoritos && favoritos.restaurantes_favoritos.length > 0 ? (
                            <div className="row">
                                {favoritos.restaurantes_favoritos.map((favorito, index) => (
                                    <div key={index} className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <strong>Restaurante:</strong> {favorito.nombre} <br />
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
                    </div>
                </div>
            </div>
        </div>
    );
};