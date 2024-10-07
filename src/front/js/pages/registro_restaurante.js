import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/workspaces/Proyecto_Final_NJD/src/front/styles/privateView.css';

export const RegistroCompletoRestaurante = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(true); // Estado para controlar la visibilidad del modal
    const [formData, setFormData] = useState({
        direccion: "",
        telefono: "",
        cubiertos: "",
        cantidad_mesas: "",
        franja_horaria: "",
        reservas_por_dia: "",
    });

    useEffect(() => {
        // Redirigir si no hay usuario autenticado
        if (!sessionStorage.getItem('token')) {
            navigate('/'); // Redirige a la página principal si no hay usuario
        }
    }, []);

    if (!sessionStorage.getItem('token')) {
        return <p>Cargando usuario...</p>; 
    }

    // Función para cerrar el modal
    const closeModal = () => {
        setModalVisible(false); // Cambiar estado para ocultar el modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token'); // Asegúrate de tener el token de autenticación
    
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/signup/restaurante`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // JWT token para autorización
                },
                body: JSON.stringify(formData), // Enviamos el formulario con los datos del restaurante
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("Registro exitoso:", result);
                navigate('/vistaPrivadaRestaurante'); // Redirigir a la vista privada si el registro es exitoso
            } else {
                const error = await response.json();
                alert("Hubo un error en el registro: " + error.msg);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("Hubo un error en el registro. Inténtalo nuevamente.");
        }
    };
    

    return (
        <div className="private-view minimal-background">
            {modalVisible && ( // Mostrar el modal solo si está visible
                <div className="welcome-box minimal-box">
                    <h1 className="private-view-title minimal-title">
                        ¡Hola! ¡Te damos la bienvenida a tu área privada!
                    </h1>
                    <p className="private-view-text minimal-text">
                        En <strong>¡Hoy no Cocino!</strong>, valoramos tu confianza. Estamos comprometidos a impulsar tu restaurante y a convertir cada comida en una experiencia única e inolvidable para tus clientes.
                    </p>
                    
                    {/* Botón para cerrar el modal */}
                    <button className="minimal-button" onClick={closeModal}>
                        ¡Vamos a comenzar!
                    </button>
                </div>
            )}

            {/* Contenedor para el formulario de registro que aparece después de cerrar el modal */}
            {!modalVisible && (
                <div className="modal-content"> {/* Usar el estilo de modal aquí */}
                    <div className="modal-header">
                        <h2 className="form-title">Completa los datos de tu restaurante</h2>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Dirección del restaurante"
                                    required
                                />
                            </div>

                   
                            <div className="mb-3">
                                <label htmlFor="cubiertos" className="form-label">Comensales</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cubiertos"
                                    name="cubiertos"
                                    value={formData.cubiertos}
                                    onChange={handleChange}
                                    placeholder="Cantidad de comensales"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="cantidad_mesas" className="form-label">Número de Mesas</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cantidad_mesas"
                                    name="cantidad_mesas"
                                    value={formData.cantidad_mesas}
                                    onChange={handleChange}
                                    placeholder="Número de mesas"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="franja_horaria" className="form-label">Franja Horaria</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="franja_horaria"
                                    name="franja_horaria"
                                    value={formData.franja_horaria}
                                    onChange={handleChange}
                                    placeholder="Franja horaria"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="reservas_por_dia" className="form-label">Reservas por Día</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="reservas_por_dia"
                                    name="reservas_por_dia"
                                    value={formData.reservas_por_dia}
                                    onChange={handleChange}
                                    placeholder="Cantidad de reservas por día"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Terminar registro</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
