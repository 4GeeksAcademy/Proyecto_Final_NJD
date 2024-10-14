import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import "../../styles/privateView.css";

export const RegistroCompletoRestaurante = () => {
    const { store, actions } = useContext(Context); 
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState(null); 

    const [formData, setFormData] = useState({
        direccion: "",
        cubiertos: "",
        cantidad_mesas: "",
        horario_mañana_inicio: "",
        horario_mañana_fin: "",
        horario_tarde_inicio: "",
        horario_tarde_fin: "",
        reservas_por_dia: "",
        categorias_id: null,
    });

    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            navigate("/"); 
        }

        actions.obtenerCategorias(); 

        console.log("Categorías cargadas:", store.categorias);
    }, []);

    if (!sessionStorage.getItem("token")) {
        return <p>Cargando usuario...</p>;
    }

    const closeModal = () => {
        setModalVisible(false); 
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
        setSelectedCategory(categoria); 
        setFormData({ ...formData, categorias_id: categoria.id }); 
        setShowCategoryModal(false); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const restauranteId = sessionStorage.getItem("restaurant_id");

        console.log("Restaurante ID obtenido de sessionStorage:", restauranteId);

        const result = await actions.completarRegistroRestaurante(restauranteId, formData);

        if (result.success) {
            navigate(`/vistaPrivadaRestaurante/${restauranteId}`);
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
              <h1 className="private-view-title minimal-title">
                ¡Hola! ¡Te damos la bienvenida a tu área privada!
              </h1>
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
                    <label htmlFor="horario_mañana_inicio" className="form-label">Horario Mañana (Inicio)</label>
                    <input
                      type="time"
                      className="form-control"
                      id="horario_mañana_inicio"
                      name="horario_mañana_inicio"
                      value={formData.horario_mañana_inicio}
                      onChange={handleChange}
                    />
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="horario_mañana_fin" className="form-label">Horario Mañana (Fin)</label>
                    <input
                      type="time"
                      className="form-control"
                      id="horario_mañana_fin"
                      name="horario_mañana_fin"
                      value={formData.horario_mañana_fin}
                      onChange={handleChange}
                    />
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="horario_tarde_inicio" className="form-label">Horario Tarde (Inicio)</label>
                    <input
                      type="time"
                      className="form-control"
                      id="horario_tarde_inicio"
                      name="horario_tarde_inicio"
                      value={formData.horario_tarde_inicio}
                      onChange={handleChange}
                    />
                  </div>
      
                  <div className="mb-3">
                    <label htmlFor="horario_tarde_fin" className="form-label">Horario Tarde (Fin)</label>
                    <input
                      type="time"
                      className="form-control"
                      id="horario_tarde_fin"
                      name="horario_tarde_fin"
                      value={formData.horario_tarde_fin}
                      onChange={handleChange}
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
                      onClick={() => setShowCategoryModal(true)} 
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
      
          {showCategoryModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Seleccionar Categoría</h5>
                    <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
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
                  <div className="modal-footer justify-content-start">  
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowCategoryModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      }
