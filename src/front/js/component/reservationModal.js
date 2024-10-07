import React from "react";

const ReservationModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;
  
    // Maneja el clic en el fondo del modal
    const handleBackdropClick = (e) => {
      // Si el clic se realiza en el fondo del modal, cierra el modal
      if (e.target.classList.contains("modal-backdrop") || e.target.classList.contains("modal")) {
        onClose();
      }
    };
  
  
    return (
      <div className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        aria-labelledby="reservationModalLabel"
        aria-hidden="true">
        onClick={handleBackdropClick}
  
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="reservationModalLabel">RESERVA</h5>
              <button type="button" className="btn-close-modal-booking" onClick={onClose} aria-label="Close">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label-booking">Nombre</label>
                  <input type="text" className="form-control-booking" id="firstName" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label-booking">Apellidos</label>
                  <input type="text" className="form-control-booking" id="lastName" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label-booking">Número de teléfono</label>
                  <input type="tel" className="form-control-booking" id="phone" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="numGuests" className="form-label-booking">Número de comensales</label>
                  <input type="number" className="form-control-booking" id="numGuests" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="numKids" className="form-label-booking">Número de niños</label>
                  <input type="number" className="form-control-booking" id="numKids" />
                </div>
                <div className="mb-3">
                  <label htmlFor="numHighchairs" className="form-label-booking">Número de tronas</label>
                  <input type="number" className="form-control-booking" id="numHighchairs" />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label-booking">Fecha</label>
                  <input type="date" className="form-control-booking" id="date" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="time" className="form-label-booking">Hora Llegada</label>
                  <input type="time" className="form-control-booking" id="time" required />
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ReservationModal