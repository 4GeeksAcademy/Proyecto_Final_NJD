import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import "/workspaces/Proyecto_Final_NJD/src/front/styles/privateView.css";

export const RegistroCompletoRestaurante = () => {
    const { store, actions } = useContext(Context); // Accede al store y acciones del flux
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false); // Estado para manejar el modal de categorías
    const [selectedCategory, setSelectedCategory] = useState(null); // Guardar la categoría seleccionada

    const [formData, setFormData] = useState({
        direccion: "",
        cubiertos: "",
        cantidad_mesas: "",
        franja_horaria: "",
        reservas_por_dia: "",
        categorias_id: null,
    });

    // Llamamos a obtener las categorías en el useEffect al montar el componente
    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            navigate("/"); // Redirigir si no hay sesión
        }

        actions.obtenerCategorias(); // Cargar las categorías

        console.log("Categorías cargadas:", store.categorias);
    }, []);

    if (!sessionStorage.getItem("token")) {
        return <p>Cargando usuario...</p>;
    }

    const closeModal = () => {
        setModalVisible(false); // Cambiar estado para ocultar el modal de bienvenida
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategorySelect = (categoria) => {
        console.log("Categoría seleccionada:", categoria); 
        setSelectedCategory(categoria); // Guarda la categoría seleccionada
        setFormData({ ...formData, categorias_id: categoria.id }); // Actualiza el formData con el id de la categoría
        setShowCategoryModal(false); // Cierra el modal de selección de categorías
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const restauranteId = sessionStorage.getItem("restaurant_id");

        console.log("Restaurante ID obtenido de sessionStorage:", restauranteId);

        // Llama a la acción del flux para completar el registro del restaurante
        const result = await actions.completarRegistroRestaurante(restauranteId, formData);

        if (result.success) {
            navigate("/vistaPrivadaRestaurante");
        } else {
            Swal.fire({
                title: "Error",
                text: result.message || "Error al completar el registro",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };
    

    return (
        <div className="private-view minimal-background">
            {modalVisible && (
                <div className="welcome-box minimal-box">
                    <h1 className="private-view-title minimal-title">¡Hola! ¡Te damos la bienvenida a tu área privada!</h1>
                    <p className="private-view-text minimal-text">
                        En <strong>¡Hoy no Cocino!</strong>, valoramos tu confianza. Estamos comprometidos a impulsar tu
                        restaurante y a convertir cada comida en una experiencia única e inolvidable para tus clientes.
                    </p>
                    <button className="minimal-button" onClick={closeModal}>
                        ¡Vamos a comenzar!
                    </button>
                </div>
            )}

            {!modalVisible && (
                <div className="modal-content">
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

                            <div className="mb-3">
                                <label htmlFor="categoria" className="form-label">Categoría</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoria"
                                    name="categoria"
                                    value={selectedCategory ? selectedCategory.nombre_de_categoria : ''}
                                    onClick={() => setShowCategoryModal(true)} // Abre el modal al hacer clic
                                    placeholder="Seleccionar categoría"
                                    readOnly
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Terminar registro</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de selección de categorías */}
            {showCategoryModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Seleccionar Categoría</h5>
                                <button type="button" className="close" onClick={() => setShowCategoryModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul className="list-group">
                                    {store.categorias.map((categoria) => (
                                        <li
                                            key={categoria.id}
                                            className="list-group-item"
                                            onClick={() => handleCategorySelect(categoria)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {categoria.nombre_de_categoria}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
