import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Context } from "../store/appContext";
import "../../styles/vistaPrivadaRestaurante.css";
import ModalCambiarPasswordRestaurante from '../component/modalCambiarPasswordRestaurante'; // Modal de contraseña

export const VistaPrivadaRestaurante = () => {
  const { actions, store } = useContext(Context);
  const { restaurante_id } = useParams();
  const navigate = useNavigate();

  const goToCloudinary = () => {
    navigate(`/vistaCloudinary/${restaurante_id}`);
  };

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    cubiertos: '',
    cantidad_mesas: '',
    reservas_por_dia: '',
    horario_mañana_inicio: '',
    horario_mañana_fin: '',
    horario_tarde_inicio: '',
    horario_tarde_fin: '',
  });

  const [modalData, setModalData] = useState({
    field: '',
    value: ''
  });

  // Estado para abrir y cerrar el modal de cambiar contraseña
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  const openModal = (field, currentValue) => {
    setModalData({
      field: field,
      value: currentValue || ''
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
    setFormData({
      ...formData,
      [modalData.field]: modalData.value
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
  };

  useEffect(() => {
    const fetchRestauranteData = async () => {
      const token = sessionStorage.getItem('token');
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
            horario_tarde_fin: data.horario_tarde_fin || ""
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

  // Funciones para abrir/cerrar el modal de cambiar contraseña
  const openPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  return (
    <div className="area-privada">
      <div className="area-privada-container">
        <div className="area-header">
          <h2 className="form-title">Bienvenido a tu área privada</h2>
        </div>
        <div className="area-body">
          <form onSubmit={handleSubmit} className="row ancho">
            {/* Nombre del restaurante */}
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label">Nombre del restaurante</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.nombre}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('nombre', formData.nombre)}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Teléfono */}
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

            {/* Email */}
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <div className="email-field input-content">
                <span className="form-control-plaintext">{formData.email}</span>
              </div>
            </div>

            {/* Cubiertos */}
            <div className="col-md-6 mb-3">
              <label htmlFor="cubiertos" className="form-label">Cubiertos</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.cubiertos}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('cubiertos', formData.cubiertos)}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Cantidad de mesas */}
            <div className="col-md-6 mb-3">
              <label htmlFor="cantidad_mesas" className="form-label">Cantidad de Mesas</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.cantidad_mesas}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('cantidad_mesas', formData.cantidad_mesas)}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Reservas por día */}
            <div className="col-md-6 mb-3">
              <label htmlFor="reservas_por_dia" className="form-label">Reservas por día</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{formData.reservas_por_dia}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('reservas_por_dia', formData.reservas_por_dia)}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Horario de mañana */}
            <div className="col-md-6 mb-3">
              <label htmlFor="horario_mañana" className="form-label">Horario de Mañana</label>
              <div className="input-group">
                <div className="input-content">
                  <span className="form-control-plaintext">{`${formData.horario_mañana_inicio} - ${formData.horario_mañana_fin}`}</span>
                  <span className="input-group-text icon-wrapper">
                    <i className="fa-solid fa-pen-to-square small-icon" onClick={() => openModal('horario_mañana', formData.horario_mañana_inicio)}></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Contraseña */}
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

            <div className="text-left mt-4 col-12 d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              <button 
                className="btn btn-secondary"
                onClick={goToCloudinary} // Llama a la función de redirección
              >
                Cargar Imágenes
              </button>
            </div>
          </form>
        </div>

        {/* Modal para cambiar la contraseña */}
        <ModalCambiarPasswordRestaurante
          isOpen={isPasswordModalOpen}
          onClose={closePasswordModal}
        />

        {/* Modal para editar campos */}
        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">
                  Editar {modalData.field === "nombre" ? "Nombre del Restaurante" :
                    modalData.field === "telefono" ? "Teléfono" :
                      modalData.field === "cubiertos" ? "Cubiertos" :
                        modalData.field === "cantidad_mesas" ? "Cantidad de Mesas" :
                          modalData.field === "reservas_por_dia" ? "Reservas por Día" :
                            modalData.field === "horario_mañana" ? "Horario de Mañana" :
                              "Horario de Tarde"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={modalData.value}
                  onChange={handleModalChange}
                  placeholder={`Introduzca nuevo ${modalData.field}`}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleModalSave}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
