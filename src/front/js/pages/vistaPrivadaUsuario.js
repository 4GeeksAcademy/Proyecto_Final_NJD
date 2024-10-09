import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { Context } from "../store/appContext";
import "../../styles/vistaPrivadaUsuario.css";



export const AreaPrivadaUsuario = () => {
    const { actions } = useContext(Context);
    const { user_id } = useParams();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        telefono: ''
    });
    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token');

            console.log('Token en sessionStorage:', token);
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
    useEffect(() => {
        console.log(formData);
    }, [formData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            nombres: formData.firstName,
            apellidos: formData.lastName,
            email: formData.email,
            telefono: formData.telefono,
        };
        console.log('Datos enviados para modificar:', dataToSend);
        const result = await actions.modificarUsuario(user_id, dataToSend);
        if (result.success) {
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
    return (
        <div className="area-privada">
            <div className="area-privada-container">
                <div className="area-header">
                    <h2 className="form-title">Hola {sessionStorage.getItem('user_name')}, estás en tu área privada</h2>
                </div>
                <div className="area-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Apellidos</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Tus apellidos"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Tu correo electrónico"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Tu número de teléfono"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    </form>
                    <div className="mt-4">
                        <button className="btn btn-secondary" onClick={() => Swal.fire("Mis reservas", "Aquí estarán tus reservas")}>
                            Ver mis reservas
                        </button>
                        <button className="btn btn-secondary ml-2" onClick={() => Swal.fire("Mis favoritos", "Aquí estarán tus favoritos")}>
                            Ver mis favoritos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};