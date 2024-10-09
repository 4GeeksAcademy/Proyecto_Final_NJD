import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { useParams, useHistory } from 'react-router-dom';

export const PaginaDeRestauranteParaReservar = () => {
    const { actions, store } = useContext(Context);
    const { restaurante_id } = useParams();
    const history = useHistory();  //------PARA IR DESPUES DE LA RESERVA-------//
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        adultos: '',
        niños: '',
        trona: '',
        fecha_reserva: '',
        hora: ''
    });

    useEffect(() => {
        actions.obtenerRestaurantesPorId(restaurante_id);
    }, [restaurante_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            //-----ACA SE REGISTRA LA RESERVA EN LA BASE DE DATOS------//
            const response = await fetch(`${process.env.BACKEND_URL}/api/reserva`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log("Reserva realizada con éxito");
                closeModal();
                history.push(`/confirmacion`);
            } else {
                console.log("Error en la reserva");
            }
        } catch (error) {
            console.log("Error en la reserva:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const closeModal = () => {
        console.log("Modal cerrado");
    };

    const onClose = () => {
        closeModal();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="reservationModalLabel" aria-hidden="true" onClick={handleBackdropClick}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="reservationModalLabel">RESERVA</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="apellido" className="form-label">Apellidos</label>
                                <input type="text" className="form-control" name="apellido" id="apellido" value={formData.apellido} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="telefono" className="form-label">Número de teléfono</label>
                                <input type="tel" className="form-control" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="adultos" className="form-label">Número de comensales</label>
                                <input type="number" className="form-control" name="adultos" id="adultos" value={formData.adultos} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="niños" className="form-label">Número de niños</label>
                                <input type="number" className="form-control" name="niños" id="niños" value={formData.niños} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="trona" className="form-label">Número de tronas</label>
                                <input type="number" className="form-control" name="trona" id="trona" value={formData.trona} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fecha_reserva" className="form-label">Fecha</label>
                                <input type="date" className="form-control" name="fecha_reserva" id="fecha" value={formData.fecha_reserva} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="hora" className="form-label">Hora Llegada</label>
                                <input type="time" className="form-control" name="hora" id="hora" value={formData.hora} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}