import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import "../../styles/vistaPrivadaRestaurante.css";
import ModalCambiarPasswordRestaurante from '../component/modalCambiarPasswordRestaurante';
import ModalEliminarRestaurante from '../component/modalEliminarRestaurante';
import ModalDescripciones from '../component/modalDescripciones';


export const VistaPrivadaRestaurante = () => {
  const { actions, store } = useContext(Context);
  const { restaurante_id } = useParams();
  const navigate = useNavigate();

  const goToCloudinary = () => {
    navigate(`/vistaCloudinary/${restaurante_id}`);
  };

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    cubiertos: "",
    cantidad_mesas: "",
    reservas_por_dia: "",
    horario_mañana_inicio: "",
    horario_mañana_fin: "",
    horario_tarde_inicio: "",
    horario_tarde_fin: "",
    direccion: "",
  });

  const [modalData, setModalData] = useState({
    field: "",
    value: "",
  });

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEliminarRestauranteOpen, setEliminarRestauranteOpen] = useState(false); // Estado para el modal de eliminación
  const [isDescripcionModalOpen, setDescripcionModalOpen] = useState(false);

  const openModal = (field, currentValue) => {
    if (field === "horario_mañana" || field === "horario_tarde") {
      setModalData({
        field: field,
        value: {
          inicio: currentValue.inicio || "",
          fin: currentValue.fin || "",
        },
      });
    } else {
      setModalData({
        field: field,
        value: "",
      });
    }
    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };

  const handleModalChange = (e, timeField) => {
    if (modalData.field === "horario_mañana" || modalData.field === "horario_tarde") {
      setModalData({
        ...modalData,
        value: {
          ...modalData.value,
          [timeField]: e.target.value,
        },
      });
    } else {
      setModalData({
        ...modalData,
        value: e.target.value,
      });
    }
  };

  const handleModalSave = () => {
    if (modalData.field === "horario_mañana" || modalData.field === "horario_tarde") {
      setFormData({
        ...formData,
        [modalData.field + "_inicio"]: modalData.value.inicio,
        [modalData.field + "_fin"]: modalData.value.fin,
      });
    } else {
      setFormData({
        ...formData,
        [modalData.field]: modalData.value,
      });
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    modal.hide();
  };


  const openDescripcionModal = () => {
    setDescripcionModalOpen(true);
  };

  const closeDescripcionModal = () => {
    setDescripcionModalOpen(false);
  };



  useEffect(() => {
    const fetchRestauranteData = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const data = await actions.getRestaurante(restaurante_id);
          setFormData({
            nombre: data.nombre || "",
            telefono: data.telefono || "",
            email: data.email || "",
            cubiertos: data.cubiertos || "",
            cantidad_mesas: data.cantidad_mesas || "",
            reservas_por_dia: data.reservas_por_dia || "",
            horario_mañana_inicio: data.horario_mañana_inicio || "",
            horario_mañana_fin: data.horario_mañana_fin || "",
            horario_tarde_inicio: data.horario_tarde_inicio || "",
            horario_tarde_fin: data.horario_tarde_fin || "",
            direccion: data.direccion || "",
            descripcion: data.descripcion || ""
          });
        } catch (error) {
          console.error("Error al obtener datos del restaurante:", error);
        }
      }
    };
    fetchRestauranteData();
  }, [restaurante_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    const result = await actions.modificarDatosRestaurante(restaurante_id, dataToSend);
    if (result.success) {
      sessionStorage.setItem("user_name", formData.nombre);
      actions.actualizarNombreResto(formData.nombre)

      Swal.fire({
        title: "Éxito",
        text: "Datos actualizados con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudieron actualizar los datos. Inténtalo más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const openPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handleEliminarRestaurante = async () => {
    const result = await actions.eliminarRestaurante(restaurante_id);
    if (result.success) {
      // Limpiar sessionStorage
      sessionStorage.removeItem('restaurant_name');
      sessionStorage.removeItem('restaurant_id');

      Swal.fire({
        title: "Eliminado",
        text: "El restaurante ha sido eliminado con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar"
      }).then(() => {
        navigate("/home");
      });
    } else {
      Swal.fire({
        title: "Error",
        text: result.message || "Error al eliminar el restaurante.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };


  return (
    <div className="area-privada">
      <div className="area-privada-container">
        <div className="area-header">
          <h2 className="form-title">Bienvenido a tu área privada</h2>
        </div>
        <div className="area-body">
          <form onSubmit={handleSubmit} className="row ancho">
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label">Nombre del restaurante</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.nombre}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal("nombre", formData.nombre)}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Otros campos */}
            <div className="col-md-6 mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.telefono}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal("telefono", formData.telefono)}></i>
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
              <label htmlFor="cubiertos" className="form-label">Comensales</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.cubiertos}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal("cubiertos", formData.cubiertos)}></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="cantidad_mesas" className="form-label">Cantidad de Mesas</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.cantidad_mesas}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal("cantidad_mesas", formData.cantidad_mesas)}></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="reservas_por_dia" className="form-label">Reservas por día</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.reservas_por_dia}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal("reservas_por_dia", formData.reservas_por_dia)}></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="horario_mañana" className="form-label">Horario de Mañana</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{`${formData.horario_mañana_inicio} - ${formData.horario_mañana_fin}`}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('horario_mañana', { inicio: formData.horario_mañana_inicio, fin: formData.horario_mañana_fin })}></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="horario_tarde" className="form-label">Horario de Tarde</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{`${formData.horario_tarde_inicio} - ${formData.horario_tarde_fin}`}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('horario_tarde', { inicio: formData.horario_tarde_inicio, fin: formData.horario_tarde_fin })}></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.direccion}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal("direccion", formData.direccion)}></i>
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

            <div className="col-md-6 mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">
                    {formData.descripcion ? "La descripción está completa" : "No hay descripción"}
                  </span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={openDescripcionModal}></i>
                  </span>
                </div>
              </div>
            </div>


            <div className="text-left mt-4 col-12 d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              <button type="button" className="btn btn-secondary" onClick={goToCloudinary}>Cargar Imágenes</button>
              <button type="button" className="btn btn-danger" onClick={() => setEliminarRestauranteOpen(true)}>Eliminar Restaurante</button>
            </div>
          </form>
        </div>

        {/* Modal Cambiar Contraseña */}
        <ModalCambiarPasswordRestaurante
          isOpen={isPasswordModalOpen}
          onClose={closePasswordModal}
        />

        {/* Modal para editar Descripción */}
        <ModalDescripciones
          isOpen={isDescripcionModalOpen}
          onClose={closeDescripcionModal}
          restauranteId={restaurante_id}
        />


        {/* Modal para Eliminar Restaurante */}
        <ModalEliminarRestaurante
          isOpen={isEliminarRestauranteOpen}
          onClose={() => setEliminarRestauranteOpen(false)}
          handleEliminarRestaurante={handleEliminarRestaurante}
        />

        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">
                  Editar {modalData.field === "nombre" ? "Nombre del Restaurante" :
                    modalData.field === "telefono" ? "Teléfono" :
                      modalData.field === "cubiertos" ? "Comensales" :
                        modalData.field === "cantidad_mesas" ? "Cantidad de Mesas" :
                          modalData.field === "reservas_por_dia" ? "Reservas por Día" :
                            modalData.field === "horario_mañana" ? "Horario de Mañana" :
                              modalData.field === "horario_tarde" ? "Horario de Tarde" :
                                "Dirección"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {modalData.field === "horario_mañana" || modalData.field === "horario_tarde" ? (
                  <div>
                    <label htmlFor="inicio">Hora Inicio</label>
                    <input
                      type="time"
                      className="form-control mb-3"
                      value={modalData.value.inicio}
                      onChange={(e) => handleModalChange(e, "inicio")}
                    />
                    <label htmlFor="fin">Hora Fin</label>
                    <input
                      type="time"
                      className="form-control"
                      value={modalData.value.fin}
                      onChange={(e) => handleModalChange(e, "fin")}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={modalData.value}
                    onChange={handleModalChange}
                    placeholder={`Introduzca nuevo ${modalData.field === "nombre" ? "nombre" :
                      modalData.field === "telefono" ? "teléfono" :
                        modalData.field === "cubiertos" ? "comensales" :
                          modalData.field === "cantidad_mesas" ? "cantidad de mesas" :
                            modalData.field === "reservas_por_dia" ? "reservas por día" :
                              modalData.field === "direccion" ? "dirección" : "valor"}`}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleModalSave}>Aceptar</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

