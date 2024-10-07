import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";  // Si estás obteniendo el ID del restaurante por params
import { restaurantDetails } from "../pages/restaurantDetails";

const VistaPrivadaRestaurante = () => {
  const { store, actions } = useContext(Context);
  const { restauranteId } = useParams();  // Obteniendo el ID del restaurante de los parámetros de la URL

  useEffect(() => {
    // Si restauranteId está disponible, se llama a la acción para obtener los detalles
    if (restauranteId) {
      actions.getRestaurante(restauranteId);  // Llama a la acción en el Flux
    }
  }, [restauranteId]);

  const restaurante = store.restaurantDetails; //  detalles del restaurante desde el store

  // Si no hay restaurante,  un mensaje de carga
  if (!restaurante) {
    return <div>Cargando los datos del restaurante...</div>;
  }

  return (
    <div className="container">
      <h1>{restaurante.nombre}</h1>
      <p>Dirección: {restaurante.direccion}</p>
      <p>Teléfono: {restaurante.telefono}</p>
      <p>Valoración: {restaurante.valoracion}</p>
      <img src={restaurante.image} alt={`Imagen de ${restaurante.nombre}`} />
    </div>
  );
};

export default VistaPrivadaRestaurante;
