import React, { useState, useContext } from "react";
import Swal from 'sweetalert2';
import { Context } from '../store/appContext';

const ModalCambiarPasswordRestaurante = ({ isOpen, onClose }) => {
  const { actions } = useContext(Context);  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const data = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };

    const result = await actions.cambiarContraseña(data);

    if (result.success) {
      Swal.fire({
        title: 'Éxito',
        text: 'Contraseña cambiada con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      onClose();  
    } else {
      Swal.fire({
        title: 'Error',
        text: result.message || 'No se pudo cambiar la contraseña. Inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="modalPasswordLabel" aria-hidden="true" data-bs-backdrop="true" onClick={onClose}>
      <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}> 
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cambiar Contraseña</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">Contraseña actual</label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Cambiar contraseña</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCambiarPasswordRestaurante;
