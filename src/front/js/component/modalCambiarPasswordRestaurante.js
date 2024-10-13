import React, { useState } from "react";
import Swal from 'sweetalert2';

const ModalCambiarPasswordRestaurante = ({ isOpen, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Aquí llamas a la función onSubmit y pasas los datos
    onSubmit({
      currentPassword: currentPassword,
      newPassword: newPassword,
    });
    
    // Limpias los campos de los inputs
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    // Cierras el modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
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
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Guardar cambios</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCambiarPasswordRestaurante;
