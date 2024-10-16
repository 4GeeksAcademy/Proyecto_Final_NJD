import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { Context } from "../store/appContext";
import { ModalVerMisReservas } from '../component/modalVerMisReservas';
import "../../styles/vistaPrivadaUsuario.css";
import { ModalVerMisFavoritos } from "../component/modalVerMisFavoritos";
import { ModalCambiarPasswordUser } from '../component/modalCambiarPasswordUser';
import ModalEliminarUsuario from '../component/modalEliminarUsuario';


export const AreaPrivadaUsuario = () => {
    const { actions, store } = useContext(Context);
    const [favoritos, setFavoritos] = useState([]);
    const { user_id } = useParams();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        telefono: ''
    });

    const [modalData, setModalData] = useState({
        field: '',
        value: ''
    });

    const [isModalReservasOpen, setModalReservasOpen] = useState(false);
    const [isFavoritosOpen, setFavoritosOpen] = useState(false);

    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    const openModal = (field, currentValue) => {
        setModalData({
            field: field,
            value: ''
        });
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    };

    const handleModalChange = (e) => {
        setModalData({
            ...modalData,
            value: e.target.value
        });
    };

    const handleModalSave = () => {
        // Verificar si el valor está vacío
        if (modalData.value.trim() === "") {
            // No actualizamos el campo si el input está vacío
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            return;
        }
    
        // Si se ha introducido un valor, actualizar el campo
        setFormData({
            ...formData,
            [modalData.field]: modalData.value
        });
    
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
    };
    

    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const data = await actions.obtenerDatosUsuario(user_id);
                    setFormData({
                        firstName: data.nombres || "",
                        lastName: data.apellidos || "",
                        email: data.email || "",
                        telefono: data.telefono || ""
                    });
                } catch (error) {
                    console.error("Error al obtener datos del usuario:", error);
                }
            }
        };
        fetchUserData();
    }, [user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            nombres: formData.firstName,
            apellidos: formData.lastName,
            email: formData.email,
            telefono: formData.telefono,
        };
        const result = await actions.modificarUsuario(user_id, dataToSend);
        if (result.success) {
            sessionStorage.setItem("user_name", formData.firstName);
            
            Swal.fire({
                title: 'Éxito',
                text: 'Datos actualizados con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron actualizar los datos. Inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const openPasswordModal = () => {
        setPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setPasswordModalOpen(false);
    };

    const [isEliminarUsuarioOpen, setEliminarUsuarioOpen] = useState(false);


    return (
        <div className="area-privada">
            <div className="area-privada-container">
                <div className="area-header">
                    <h2 className="form-title">Bienvenido a tu área privada</h2>
                </div>
                <div className="area-body">
                    <form onSubmit={handleSubmit} className="row ancho">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="firstName" className="form-label">Nombre</label>
                            <div className="input-group">
                                <div className="input-content">
                                    <span className="form-control-plaintext">{formData.firstName}</span>
                                    <span className="input-group-text icon-wrapper">
                                        <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('firstName', formData.firstName)}></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastName" className="form-label">Apellidos</label>
                            <div className="input-group">
                                <div className="input-content">
                                    <span className="form-control-plaintext">{formData.lastName}</span>
                                    <span className="input-group-text icon-wrapper">
                                        <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('lastName', formData.lastName)}></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <div className="email-field input-content">
                                <span className="form-control-plaintext">{formData.email}</span>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="telefono" className="form-label">Teléfono</label>
                            <div className="input-group">
                                <div className="input-content">
                                    <span className="form-control-plaintext">{formData.telefono}</span>
                                    <span className="input-group-text icon-wrapper">
                                        <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('telefono', formData.telefono)}></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div className="input-group">
                                <div className="input-content">
                                    <span className="form-control-plaintext">●●●●●●●●</span>
                                    <span className="input-group-text icon-wrapper">
                                        <i className="fa-solid fa-pen-to-square small-icon" onClick={openPasswordModal}></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left mt-4 col-12">
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>

                    <div className="row button-row">
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-secondary w-100" onClick={() => setModalReservasOpen(true)}>
                                Ver mis reservas
                            </button>
                        </div>
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-secondary w-100" onClick={() => setFavoritosOpen(true)}>
                                Ver mis favoritos
                            </button>
                        </div>
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-danger w-100" onClick={() => setEliminarUsuarioOpen(true)}>
                                Eliminar cuenta
                            </button>
                        </div>
                    </div>

                </div>

                {/* Modales */}
                <ModalVerMisReservas 
                    isOpen={isModalReservasOpen} 
                    onClose={() => setModalReservasOpen(false)}
                />

                <ModalEliminarUsuario
                    isOpen={isEliminarUsuarioOpen}
                    onClose={() => setEliminarUsuarioOpen(false)}
                    userId={user_id}  // Pasamos el ID del usuario actual
                    eliminarUsuario={actions.eliminarUsuario}  // Llamamos a la función eliminarUsuario desde el flux
                />


                <ModalCambiarPasswordUser
                    isOpen={isPasswordModalOpen}
                    onClose={closePasswordModal}
                />

                <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editModalLabel">
                                    Editar {modalData.field === "firstName" ? "Nombre" : modalData.field === "lastName" ? "Apellidos" : "Teléfono"}
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={modalData.value}
                                    onChange={handleModalChange}
                                    placeholder={modalData.field === "firstName" ? "Introduzca nuevo nombre" : modalData.field === "lastName" ? "Introduzca nuevos apellidos" : "Introduzca nuevo teléfono"}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleModalSave}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ModalVerMisFavoritos 
                    isOpen={isFavoritosOpen} 
                    onClose={() => setFavoritosOpen(false)} 
                />
            </div>
        </div>
    );
};
