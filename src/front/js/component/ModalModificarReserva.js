import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2';

export const ModalModificarReserva = ({ isOpen, onClose, reserva, actualizarReservaEnLista }) => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        adultos: reserva.adultos,  
        niños: reserva.niños || 0,  
        trona: reserva.trona || 0,  
        fecha_reserva: reserva.fecha_reserva.split('T')[0],  
        hora: reserva.fecha_reserva.split('T')[1].substring(0, 5), 
        restaurante_id: reserva.restaurante_id
    });

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${process.env.BACKEND_URL}/api/reservas/${reserva.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const reservaActualizada = await response.json();  
                actualizarReservaEnLista(reservaActualizada.reserva);  
                Swal.fire({
                    title: 'Reserva actualizada con éxito',
                    text: 'La reserva ha sido modificada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                onClose();  
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo modificar la reserva. Inténtelo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error inesperado.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEliminarReserva = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás deshacer esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await fetch(`${process.env.BACKEND_URL}/api/reservas/${reserva.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        Swal.fire(
                            'Eliminado',
                            'Tu reserva ha sido eliminada con éxito.',
                            'success'
                        );
                        actualizarReservaEnLista(null,reserva.id);  
                        onClose();  
                    } else {
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar la reserva. Inténtelo de nuevo más tarde.',
                            'error'
                        );
                    }
                } catch (error) {
                    Swal.fire(
                        'Error',
                        'Ocurrió un error inesperado. Inténtelo de nuevo más tarde.',
                        'error'
                    );
                }
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div 
            className="modal fade show" 
            style={{ display: "block" }} 
            tabIndex="-1" 
            aria-labelledby="modifyReservationModalLabel" 
            aria-hidden="true"
            onClick={handleBackdropClick}  // Detecta el clic en el fondo
        >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>  {/* Evita que el clic en el contenido cierre el modal */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modifyReservationModalLabel">Modificar Reserva</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="adultos" className="form-label">Número de adultos</label>
                                <input type="number" className="form-control" name="adultos" value={formData.adultos} onChange={handleChange} min="1" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="niños" className="form-label">Número de niños</label>
                                <input type="number" className="form-control" name="niños" value={formData.niños} onChange={handleChange} min="0" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="trona" className="form-label">Número de tronas</label>
                                <input type="number" className="form-control" name="trona" value={formData.trona} onChange={handleChange} min="0" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fecha_reserva" className="form-label">Fecha</label>
                                <input type="date" className="form-control" name="fecha_reserva" value={formData.fecha_reserva} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="hora" className="form-label">Hora de Llegada</label>
                                <input type="time" className="form-control" name="hora" value={formData.hora} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" onClick={handleEliminarReserva}>Eliminar Reserva</button>
                        <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
