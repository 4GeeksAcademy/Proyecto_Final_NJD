import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReservationModal = ({ isOpen, onClose, onSubmit, formData, handleChange }) => {
  if (!isOpen) return null;

  // Maneja el clic en el fondo del modal
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal-backdrop") || e.target.classList.contains("modal")) {
      onClose();
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="reservationModalLabel" aria-hidden="true" onClick={handleBackdropClick}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="reservationModalLabel">RESERVA</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">Apellidos</label>
                <input type="text" className="form-control" name="apellido" id="apellido" value={formData.apellido} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Número de teléfono</label>
                <input type="tel" className="form-control" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="adultos" className="form-label">Número de comensales</label>
                <input type="number" className="form-control" name="adultos" id="adultos" value={formData.adultos} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="niños" className="form-label">Número de niños</label>
                <input type="number" className="form-control" name="niños" id="niños" value={formData.niños} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="trona" className="form-label">Número de tronas</label>
                <input type="number" className="form-control" name="trona" id="trona" value={formData.trona} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="fecha_reserva" className="form-label">Fecha</label>
                <input type="date" className="form-control" name="fecha_reserva" id="fecha" value={formData.fecha_reserva} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="hora" className="form-label">Hora Llegada</label>
                <input type="time" className="form-control" name="hora" id="hora" value={formData.hora} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    adultos: '',
    niños: '',
    trona: '',
    fecha_reserva: '',
    hora: ''
  });

  useEffect(() => {
    // Lógica para cargar el restaurante
    const fetchRestaurantDetails = async () => {
      // Simulando la carga de datos
      const mockRestaurant = { id: 1, nombre: "Restaurante de Prueba", direccion: "Calle Ejemplo 123" }; // Ejemplo
      setRestaurant(mockRestaurant);
      setLoading(false);
    };
    fetchRestaurantDetails();
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Reservation submitted", formData);
    // Lógica para manejar el envío de la reserva aquí
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => setIsBookingModalOpen(true);
  const closeModal = () => setIsBookingModalOpen(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!restaurant) return <div>No restaurant found</div>;

  return (
    <div className="restaurant-detail-main-container">
      <div className="restaurant-detail-container">
        <h1>{restaurant.nombre}</h1>
        <p>Dirección: {restaurant.direccion}</p>
        <button onClick={openModal} className="open-booking-button">RESERVA AHORA</button>
      </div>

      <ReservationModal
        isOpen={isBookingModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default RestaurantDetail;
