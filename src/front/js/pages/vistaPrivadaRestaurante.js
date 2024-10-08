import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

const VistaPrivadaRestaurante = () => {
  const { store, actions } = useContext(Context);
  const { restauranteId } = useParams();  // Obtener el ID del restaurante desde los parámetros de la URL
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga
  const [error, setError] = useState(null);  // Estado para manejar errores
  const [formData, setFormData] = useState({}); // Estado para manejar los cambios en el formulario de edición

  useEffect(() => {
    const fetchRestaurante = async () => {
      try {
        setLoading(true);  // Iniciar carga
        await actions.getRestaurante(restauranteId);  // Llamar a la acción en el Flux
        await actions.obtenerValoracionRestaurante(restauranteId);  // Obtener las valoraciones y reseñas
        setLoading(false);  // Terminar carga cuando se obtienen los datos
      } catch (err) {
        console.error("Error al obtener los detalles del restaurante:", err);
        setError("Hubo un error al cargar los datos del restaurante.");
        setLoading(false);  // Terminar carga en caso de error
      }
    };

    if (restauranteId) {
      fetchRestaurante();  // Ejecutar la función para obtener los detalles del restaurante
    }
  }, [restauranteId, actions]);

  const restaurante = store.restaurantDetails; // Obtener los detalles del restaurante desde el store
  const valoraciones = store.valoraciones; // Obtener las valoraciones del restaurante desde el store

  // Si no hay restaurante, devolver un mensaje de error
  if (!restaurante) {
    return <div>No se encontraron los detalles del restaurante.</div>;
  }

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para actualizar el restaurante
  const handleUpdateRestaurante = async () => {
    try {
      await actions.completarRegistroRestaurante(restauranteId, formData);
      alert("Datos del restaurante actualizados correctamente.");
    } catch (error) {
      console.error("Error al actualizar el restaurante", error);
    }
  };

  // Función para agregar o eliminar de favoritos
  const toggleFavorito = async () => {
    try {
      if (store.restaurantes_favoritos.includes(restauranteId)) {
        await actions.eliminarFavorito(restauranteId);
        alert("Restaurante eliminado de favoritos.");
      } else {
        await actions.agregarFavorito(restauranteId);
        alert("Restaurante agregado a favoritos.");
      }
    } catch (error) {
      console.error("Error al gestionar favorito", error);
    }
  };

  return (
    <div className="container">
      <h1>{restaurante.nombre}</h1>
      <p>Dirección: {restaurante.direccion}</p>
      <p>Teléfono: {restaurante.telefono}</p>
      <p>Valoración: {restaurante.valoracion}</p>
      {restaurante.image && (
        <img src={restaurante.image} alt={`Imagen de ${restaurante.nombre}`} />
      )}
      <p>Cantidad de mesas: {restaurante.cantidad_mesas}</p>
      <p>Categoría: {restaurante.categoria}</p>

      {/* Botón para agregar o eliminar de favoritos */}
      <button onClick={toggleFavorito}>
        {store.restaurantes_favoritos.includes(restauranteId) ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
      </button>

      {/* Formulario para modificar los datos del restaurante */}
      <div className="form">
        <h3>Modificar los datos del restaurante</h3>
        <input
          type="text"
          name="nombre"
          defaultValue={restaurante.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="direccion"
          defaultValue={restaurante.direccion}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="telefono"
          defaultValue={restaurante.telefono}
          onChange={handleInputChange}
        />
        <button onClick={handleUpdateRestaurante}>Actualizar Restaurante</button>
      </div>

      {/* Mostrar valoraciones y reseñas */}
      <div className="valoraciones">
        <h3>Valoraciones</h3>
        {valoraciones && valoraciones.length > 0 ? (
          valoraciones.map((valoracion) => (
            <div key={valoracion.id}>
              <p>Puntuación: {valoracion.puntuacion}</p>
              <p>Comentario: {valoracion.comentario}</p>
            </div>
          ))
        ) : (
          <p>No hay valoraciones para este restaurante.</p>
        )}
      </div>
    </div>
  );
};

export default VistaPrivadaRestaurante;
