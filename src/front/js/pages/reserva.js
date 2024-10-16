import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const Reserva = ({ restaurante_id, isOpen, onClose }) => {
    const { actions, store } = useContext(Context);
    const [formData, setFormData] = useState({
        adultos: 1,
        niños: 0,
        trona: 0,
        fecha_reserva: '',
        hora: '',
        restaurante_id: restaurante_id,
        email: '',
        restaurant_name: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const userId = sessionStorage.getItem("user_id");
        const fetchUserData = async () => {
            if (userId) {
                const userData = await actions.obtenerDatosUsuario(userId);
                setFormData((prevState) => ({
                    ...prevState,
                    nombre: userData.nombres || '',
                    apellido: userData.apellidos || '',
                    telefono: userData.telefono || '',
                    email: userData.email || '',
                }));
            }
        };
        fetchUserData();
        actions.obtenerRestaurantesPorId(restaurante_id);
    }, [restaurante_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/usuario/reservas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                // Enviar correo de confirmación
                fetch(`${process.env.BACKEND_URL}/send-mail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        restaurant_name: data.reserva.restaurant_name,
                        reservation_date: formData.fecha_reserva,
                        reservation_time: formData.hora
                    })
                })
                    .then(response => response.json())
                    .then(async data => {
                        if (data.message) {
                            await Swal.fire({
                                title: "Correo enviado",
                                text: "Correo de confirmación enviado correctamente.",
                                icon: "success",
                                confirmButtonText: "Aceptar"
                            });

                            // Mostrar mensaje de éxito
                            Swal.fire({
                                title: 'Reserva realizada con éxito',
                                icon: 'success',
                                confirmButtonText: 'Volver a la página principal',
                                showCancelButton: true,
                                cancelButtonText: 'Área privada'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate('/');
                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                    const currentUserId = sessionStorage.getItem("user_id");
                                    if (currentUserId) {
                                        navigate(`/private/${currentUserId}`);
                                    }
                                }
                            });


                        } else {
                            console.log("Hubo un problema enviando el correo.", data);
                        }
                    })
                    .catch(error => {
                        console.error("Error enviando el correo: ", error);
                    });

                onClose();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo realizar la reserva. Inténtelo de nuevo más tarde.',
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

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("modal-backdrop") || e.target.classList.contains("modal")) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            aria-labelledby="reservationModalLabel"
            aria-hidden="true"
            onClick={handleBackdropClick} // Detectar clic fuera del modal para cerrarlo
        >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}> {/* Evitar que el modal mismo cierre al hacer clic dentro */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="reservationModalLabel">RESERVA</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
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
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
