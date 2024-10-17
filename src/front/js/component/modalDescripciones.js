import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";

const ModalDescripciones = ({ restauranteId, isOpen, onClose }) => {
    const { actions } = useContext(Context);
    const [descripcion, setDescripcion] = useState("");

    // Cargar la descripción cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            actions.obtenerDescripcionRestaurante(restauranteId).then((data) => {
                setDescripcion(data.descripcion || "");
            });
        }
    }, [isOpen, restauranteId]);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await actions.actualizarDescripcionRestaurante(restauranteId, descripcion);

        if (result.success) {
            Swal.fire({
                title: "Éxito",
                text: "Descripción actualizada con éxito.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            onClose(); // Cerrar el modal al finalizar
        } else {
            Swal.fire({
                title: "Error",
                text: "Error al actualizar la descripción.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="modalDescripcionLabel" aria-hidden="true" onClick={onClose}>
            <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalDescripcionLabel">Editar Descripción del Restaurante</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="descripcion" className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Escribe la descripción del restaurante aquí..."
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDescripciones;
