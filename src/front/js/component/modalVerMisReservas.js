import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { ModalModificarReserva } from './ModalModificarReserva'; 

export const ModalVerMisReservas = ({ isOpen, onClose }) => {
    const { store, actions } = useContext(Context);
    const [reservas, setReservas] = useState([]);
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);  

    useEffect(() => {
        if (isOpen) {
            const fetchReservas = async () => {
                const token = sessionStorage.getItem('token');
                const user_id = sessionStorage.getItem('user_id');
                const result = await actions.obtenerReservas(token, user_id);
                setReservas(result);  // Aquí guardamos las reservas obtenidas en el estado
            };
            fetchReservas();
        }
    }, [isOpen]);

    // Función para actualizar la reserva en la lista después de modificar o eliminar
    const actualizarReservaEnLista = (reservaActualizada, idEliminar) => {
        if (idEliminar) {
            // Si se elimina una reserva, la removemos de la lista
            setReservas((prevReservas) => prevReservas.filter(reserva => reserva.id !== idEliminar));
        } else if (reservaActualizada) {
            // Si se actualiza una reserva, la actualizamos en la lista
            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.id === reservaActualizada.id ? reservaActualizada : reserva
                )
            );
        }
    };

    // Función para abrir el modal de modificación con la reserva seleccionada
    const openModificarReservaModal = (reserva) => {
        setReservaSeleccionada(reserva);
    };

    // Si el modal no está abierto, no se muestra nada
    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="reservasModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">  {/* Aumentamos el tamaño del modal */}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reservasModalLabel">Tus reservas</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {reservas && reservas.length > 0 ? (
                                <div className="row">
                                    {reservas.map((reserva, index) => (
                                        <div key={index} className="col-md-6 mb-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <strong>Restaurante:</strong> {reserva.restaurant_name} <br />
                                                    <strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleString()} <br />
                                                    <strong>Adultos:</strong> {reserva.adultos} <br />
                                                    <strong>Niños:</strong> {reserva.niños || 0} <br />
                                                    <strong>Tronas:</strong> {reserva.trona || 0} <br />
                                                    <button 
                                                        className="btn btn-secondary mt-2"
                                                        onClick={() => openModificarReservaModal(reserva)}>
                                                        Modificar reserva
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No tienes reservas actualmente.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de modificar reserva */}
            {reservaSeleccionada && (
                <ModalModificarReserva 
                    isOpen={!!reservaSeleccionada} 
                    onClose={() => setReservaSeleccionada(null)} 
                    reserva={reservaSeleccionada}
                    actualizarReservaEnLista={actualizarReservaEnLista}  // Pasamos la función de actualización
                />
            )}
        </>
    );
};
