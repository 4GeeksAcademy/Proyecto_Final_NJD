import React, { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const ModalEliminarUsuario = ({ isOpen, onClose, userId, eliminarUsuario }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        const result = await eliminarUsuario(userId);
        
        if (result.success) {
            Swal.fire({
                title: "Usuario eliminado",
                text: "El usuario ha sido eliminado con éxito.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                onClose();
                sessionStorage.removeItem("token");  // Eliminamos la sesión si es el usuario activo
                window.location.href = "/";  // Redirigir a la página de inicio
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
        setIsLoading(false);
    };

    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Eliminar usuario</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Eliminando..." : "Eliminar cuenta"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalEliminarUsuario.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    eliminarUsuario: PropTypes.func.isRequired
};

export default ModalEliminarUsuario;
