import React, { useState, useContext, useEffect } from "react";
import "../../styles/vistaPrivadaRestaurante.css";
import { Context } from "../store/appContext";

const UploadImageCloudinary = ({ restauranteId, onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const { store, actions } = useContext(Context);

  // Obtener la imagen actual del restaurante al cargar el componente
  useEffect(() => {
    const obtenerImagen = async () => {
      const response = await actions.obtenerImagenesRestaurante(restauranteId);
      if (response && response.length > 0) {
        setCurrentImageUrl(response[0].url); // Asumimos que hay al menos una imagen
      }
    };

    obtenerImagen();
  }, [actions, restauranteId]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // guardar la imagen seleccionada
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert("Por favor selecciona una imagen");
      return;
    }

    console.log("Restaurante ID en UploadImageCloudinary:", restauranteId);  // Verifica si el ID está definido

    if (!restauranteId) {
      console.error("El restauranteId no está definido, revisa cómo lo estás pasando.");
      return;
    }

    try {
      const result = await actions.subirImagenRestaurante(image, restauranteId);
      if (result.success) {
        setCurrentImageUrl(result.url); // Actualizar la imagen actual en el estado
        onImageUpload(result.url); // Llama al callback con la URL de la imagen subida
        alert("Imagen subida exitosamente");
      } else {
        alert("Error subiendo la imagen: " + result.message);
      }
    } catch (error) {
      alert("Error subiendo la imagen");
    }
  };

  const handleDeleteImage = async (imageURL) => {
    try {
      const response = await actions.deleteImageRestaurante(restauranteId, imageURL);  // Aquí usas restauranteId

      if (response.success) {
        // Si la imagen se elimina correctamente, la eliminamos también del estado local
        setCurrentImageUrl(null);  // Elimina la imagen actual
        alert("Imagen eliminada con éxito");
      } else {
        alert("Error al eliminar la imagen");
      }
    } catch (error) {
      alert("Error al eliminar la imagen");
    }
  };

  return (
    <div>
      <h2 className="titulo_ediciom">Sube una imagen del restaurante:</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="modificar_prueba"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        <button className="restaurant-private-image-upload" type="submit">
          Subir Imagen
        </button>
      </form>

      {/* Mostrar la imagen actual si está disponible */}
      {currentImageUrl && (
        <div className="imagen-actual-container">
          <h3>Imagen actual del restaurante:</h3>
          <img
            src={currentImageUrl}
            alt="Imagen del restaurante"
            className="imagen-actual"
          />
          <button
            className="restaurant-private-image-delete"
            onClick={() => handleDeleteImage(currentImageUrl)}  // Pasa la URL de la imagen actual
          >
            Eliminar Imagen
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImageCloudinary;
