import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';

const VistaPrivadaRestaurante = () => {
  const { id } = useParams();
  const { store, actions } = useContext(Context);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });
  const [imageFile, setImageFile] = useState(null); // Imagen local para Cloudinary

  // Cargar los datos del restaurante al montar el componente
  useEffect(() => {
    actions.loadRestaurantDetails(id);
    actions.loadRestaurantReservations(id);
    actions.loadRestaurantReviews(id);
    actions.loadRestaurantFavorites(id);
  }, [id]);

  // Actualizar el formulario local cuando los datos del restaurante estén disponibles
  useEffect(() => {
    if (store.restaurantDetails) {
      setFormData({
        nombre: store.restaurantDetails.nombre,
        direccion: store.restaurantDetails.direccion,
        telefono: store.restaurantDetails.telefono
      });
    }
  }, [store.restaurantDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.updateRestaurantData(id, formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      actions.uploadRestaurantImage(file);
    }
  };

  if (!store.restaurantDetails) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Vista Privada del Restaurante</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>
        <button type="submit">Actualizar Datos</button>
      </form>

      <h3>Subir Imagen</h3>
      <input type="file" onChange={handleImageUpload} />
      {store.restaurantImage && <img src={store.restaurantImage} alt="Imagen del restaurante" />}

      <h3>Reservas</h3>
      <ul>
        {store.restaurantReservations.map((reserva) => (
          <li key={reserva.id}>
            Fecha: {reserva.fecha_reserva}, Adultos: {reserva.adultos}, Niños: {reserva.niños}
          </li>
        ))}
      </ul>

      <h3>Valoraciones y Reseñas</h3>
      <ul>
        {store.restaurantReviews.map((review) => (
          <li key={review.id}>
            Puntuación: {review.puntuacion} - {review.comentario}
          </li>
        ))}
      </ul>

      <h3>Favoritos</h3>
      <p>{store.favoritesCount} personas han marcado este restaurante como favorito.</p>
    </div>
  );
};

export default VistaPrivadaRestaurante;
