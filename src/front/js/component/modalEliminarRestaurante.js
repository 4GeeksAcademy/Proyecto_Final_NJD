import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const ModalEliminarRestaurante = ({ isOpen, onClose, handleEliminarRestaurante }) => {
  const confirmDelete = () => {
    // Muestra SweetAlert para confirmar la eliminación
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Solo se ejecuta si el usuario confirma la acción
      if (result.isConfirmed) {
        handleEliminarRestaurante(); // Llama a la función que elimina el restaurante
        onClose(); // Cierra el modal
      }
    });
  };

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} aria-labelledby="eliminarRestauranteModal" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="eliminarRestauranteModal">Eliminar Restaurante</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas eliminar este restaurante? Esta acción no se puede deshacer.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalEliminarRestaurante.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleEliminarRestaurante: PropTypes.func.isRequired
};

export default ModalEliminarRestaurante;
