import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//Componente CartaModal
const CartaModal = ({ isOpen, onClose, restaurantImage }) => {
  if (!isOpen) return null;

// Maneja el clic en el fondo del modal
const handleBackdropClickCarta = (e) => {
    if (e.target.classList.contains("carta-modal-backdrop") || e.target.classList.contains("modal-content-carta")) {
      onClose();
    }
  };

  
  return (
    <div
      className="modal fade show carta-modal-backdrop"
      style={{ display: "block" }}
      tabIndex="-1"
      aria-labelledby="cartaModalLabel"
      aria-hidden="true"
      onClick={handleBackdropClickCarta}
    >
      <div className="modal-dialog-carta">
        <div className="modal-content-carta">
          <div className="modal-header-carta">
            <h5 className="modal-title-carta" id="CartaModalLabel">¿Qué te apetece comer hoy?</h5>
            <button type="button" className="btn-close-modal-carta" onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
          <div className="modal-body-carta">
            <img
              className="modal-img-carta"
              id="imgCarta"
              src="https://restauracionnews.com/wp-content/uploads/2022/09/carta-5.jpg"
              alt="Carta"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default CartaModal