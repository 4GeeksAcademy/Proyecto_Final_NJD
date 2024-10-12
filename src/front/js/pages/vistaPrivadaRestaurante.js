import React, { useEffect, useState, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import UploadImageCloudinary from "../component/uploadImageCloudinary";
import "../../styles/vistaPrivadaRestaurante.css";


export const VistaPrivadaRestaurante = () => {
  const { store, actions } = useContext(Context);
  const { restaurante_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [restaurante, setRestaurante] = useState(store.restaurantDetails);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [images, setImages] = useState([]); // Para almacenar múltiples imágenes
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0); // Estado para el carrusel
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });


  useEffect(() => {
    const fetchRestaurante = async () => {
      try {
        if (!restaurante_id) {
          console.error("Restaurante ID es undefined o null");
          return;
        }
        setLoading(true);
        const restaurante_api = await actions.getRestaurante(restaurante_id);
        setRestaurante(restaurante_api);

        // Inicializa el estado con la imagen de la base de datos (si existe)
        const initialImages = restaurante_api.image ? [restaurante_api.image] : [];
        setImages([...initialImages]);

        await actions.obtenerValoracionRestaurante(restaurante_id);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los detalles del restaurante:", err);
        setError("Hubo un error al cargar los datos del restaurante.");
        setLoading(false);
      }
    };


    if (!sessionStorage.getItem("token")) {
      navigate("/");
    } else if (restaurante_id) {
      fetchRestaurante();
    }
  }, [restaurante_id]);

  const valoraciones = store.valoraciones;

  if (loading) {
    return <div className="loading-message">Cargando los datos del restaurante...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!restaurante) {
    return <div className="error-message">No se encontraron los detalles del restaurante.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNextSlide = () => {
    if (currentSlide < images.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Función para eliminar la imagen
  const handleDeleteImage = async (imageURL) => {
    try {
      const response = await actions.eliminarImagenRestaurante(restaurante_id, imageURL);

      if (response.success) {
        // Eliminar la imagen localmente del estado después de eliminarla en el backend
        setImages(images.filter((image) => image !== imageURL));
        alert("Imagen eliminada con éxito");
      } else {
        alert("Error al eliminar la imagen");
      }
    } catch (error) {
      console.error("Error eliminando la imagen", error);
    }
  };


  // Función callback que se pasa al componente UploadImageCloudinary
  const handleImageUpload = (url) => {
    const updatedImages = [...images, url]; // Agregar la nueva imagen al array de imágenes existentes
    setImages(updatedImages);

    // Enviar la URL de la imagen al backend para asociarla al restaurante
    handleSubmitImage(url);
  };

  const handleSubmitImage = async (imageURL) => {
    if (!restaurante_id) {
      console.error("El ID del restaurante es undefined o null, no se puede enviar la imagen.");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes/${restaurante_id}/imagen`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ url_imagen: imageURL }),
      });

      if (response.ok) {
        alert("Imagen subida y asociada con éxito");
      } else {
        alert("Error subiendo la imagen");
      }
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
    }
  };

 return (
  <div className="restaurant-private-container">
    <h1 className="restaurant-private-title">{restaurante.nombre}</h1>
    <p className="restaurant-private-info">
      <strong>Dirección:</strong> {restaurante.direccion}
    </p>
    <p className="restaurant-private-info">
      <strong>Nombre del restaurante:</strong> {restaurante.nombre}
    </p>
    <p className="restaurant-private-info">
      <strong>Teléfono:</strong> {restaurante.telefono}
    </p>
    <p className="restaurant-private-info">
      <strong>Cubiertos:</strong> {restaurante.cubiertos}
    </p>
    <p className="restaurant-private-info">
      <strong>Cantidad de mesas:</strong> {restaurante.cantidad_mesas}
    </p>
    <p className="restaurant-private-info">
      <strong>Reservas por día:</strong> {restaurante.reservas_por_dia}
    </p>

    <p className="restaurant-private-info">
      <strong>Horario de mañana:</strong> {restaurante.horario_mañana_inicio} -{" "}
      {restaurante.horario_mañana_fin}
    </p>
    <p className="restaurant-private-info">
      <strong>Horario de tarde:</strong> {restaurante.horario_tarde_inicio} -{" "}
      {restaurante.horario_tarde_fin}
    </p>

    <p className="restaurant-private-info">
      <strong>Favoritos:</strong> {restaurante.favoritos_count || 0} usuarios han añadido este
      restaurante a sus favoritos.
    </p>

    {/* Carrusel de imágenes */}
    <div className="carousel-container">
      <button
        className="prev-slide"
        onClick={handlePrevSlide}
        disabled={currentSlide === 0} // Deshabilita si estamos en el primer slide
      >
        ◀
      </button>
      <div className="carousel-track">
        <div
          className="carousel-slide"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="image-container">
              <img
                className="restaurant-private-image"
                src={image || "ruta/a/imagen_no_disponible.jpg"} // Si no hay imagen, muestra una por defecto
                alt={`Imagen ${index + 1} del restaurante`}
              />
              <button
                className="delete-image-button"
                onClick={() => handleDeleteImage(image)} // Llama a la función para eliminar la imagen
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        className="next-slide"
        onClick={handleNextSlide}
        disabled={currentSlide === images.length - 1} // Deshabilita si estamos en el último slide
      >
        ▶
      </button>
    </div>

    {/* Componente UploadImageCloudinary */}
    <div className="restaurant-private-image-upload">
      <label className="restaurant-private-label" htmlFor="image"></label>
      <UploadImageCloudinary restauranteId={restaurante_id} onImageUpload={handleImageUpload} />

    </div>
  </div>
);
};
