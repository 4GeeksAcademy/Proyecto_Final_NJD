import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import UploadImageCloudinary from "../component/uploadImageCloudinary";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import "../../styles/imagenes.css"; 

const VistaCloudinary = () => {
  const { restaurante_id } = useParams();
  const { actions } = useContext(Context);
  const [images, setImages] = useState([]);
  const navigate = useNavigate(); 

  // Obtener imágenes del backend al cargar la página
  useEffect(() => {
    const fetchImages = async () => {
      const result = await actions.obtenerImagenesRestaurante(restaurante_id);
      if (result?.success) {
        setImages(result.images); 
      }
    };

    fetchImages(); // Llamada inicial para obtener las imágenes
  }, [restaurante_id]);

  const handleDeleteImage = async (imageURL) => {
    try {
      const response = await actions.eliminarImagenRestaurante(restaurante_id, imageURL);
      if (response?.success) {
        setImages(images.filter((image) => image !== imageURL)); // Filtrar imágenes eliminadas
        Swal.fire("Imagen eliminada", "La imagen fue eliminada con éxito", "success");
      } else {
        Swal.fire("Error", "Hubo un problema al eliminar la imagen", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la imagen", "error");
      console.error("Error eliminando la imagen", error);
    }
  };

  const handleImageUpload = (url) => {
    const updatedImages = [...images, url]; // Agregar la nueva imagen al estado
    setImages(updatedImages);
    handleSubmitImage(url); // Enviar la imagen al backend
  };

  const handleSubmitImage = async (imageURL) => {
    if (!restaurante_id) {
      console.error("El ID del restaurante es undefined o null, no se puede enviar la imagen.");
      return;
    }
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes/${restaurante_id}/imagen`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ url_imagen: imageURL }),
      });

      if (response.ok) {
        Swal.fire("Imagen subida", "La imagen se subió con éxito", "success");
      } else {
        Swal.fire("Error", "Hubo un problema al subir la imagen", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
      console.error("Error subiendo la imagen:", error);
    }
  };

  // Función para redirigir a la vista privada del restaurante con el restaurante_id
  const handleGoBack = () => {
    navigate(`/vistaPrivadaRestaurante/${restaurante_id}`); 
  };

  return (
    <div className="vista-cloudinary">
      <h2 className="text-center">Imágenes del Restaurante</h2>

      <div className="grid-container">
        {/* Card para la imagen principal o una card vacía si no hay imágenes */}
        {images.length === 0 ? (
          <div className="image-card principal-card">
            <p>Imagen principal</p>
          </div>
        ) : (
          images.map((image, index) => (
            <div key={index} className={`image-card ${index === 0 ? "principal" : ""}`}>
              <img
                className="restaurant-private-image"
                src={image || "ruta/a/imagen_no_disponible.jpg"}
                alt={`Imagen ${index + 1} del restaurante`}
              />
              <button
                className="btn btn-secondary delete-image-button mt-3"
                onClick={() => handleDeleteImage(image)}
              >
                Eliminar Imagen
              </button>
            </div>
          ))
        )}
      </div>

      {/* Subida de imágenes */}
      <div className="restaurant-private-image-upload mt-5">
        <UploadImageCloudinary restauranteId={restaurante_id} onImageUpload={handleImageUpload} />
      </div>

      {/* Botón para volver a la vista privada del restaurante */}
      <div className="text-center mt-5">
        <button className="btn btn-secondary" onClick={handleGoBack}>
          Volver a la vista privada del restaurante
        </button>
      </div>
    </div>
  );
};

export default VistaCloudinary;
