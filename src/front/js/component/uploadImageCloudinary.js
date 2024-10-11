import React, { useState, useContext } from "react";
import "../../styles/vistaPrivadaRestaurante.css";
import { Context } from "../store/appContext";

const UploadImageCloudinary = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const { store, actions } = useContext(Context);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // guardar la imagen seleccionada
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert("Por favor selecciona una imagen");
      return;
    }

    try {
      const result = await actions.subirImagenRestaurante(image);
      if (result.success) {
        onImageUpload(result.url); // Llama al callback con la URL de la imagen subida
        alert("Imagen subida exitosamente");
      } else {
        alert("Error subiendo la imagen: " + result.message);
      }
    } catch (error) {
      alert("Error subiendo la imagen");
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
    </div>
  );
};

export default UploadImageCloudinary;
