import React, { useState, useContext } from "react";
import "../../styles/vistaPrivadaRestaurante.css";
import { Context } from "../store/appContext";


const UploadImageCloudinary = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { store, actions } = useContext(Context)

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // guardar la imagen seleccionada
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", image); // esto será recibido por el backend

    try {
      const result = await actions.subirImagenRestaurante(image);
      console.log("Resultado de la subida:", result);

      if (result.success) {
        console.log("URL de la imagen subida:", result.url);
        setImageUrl(result.url); // la URL de la imagen
        onImageUpload(result.url); // Llama al callback con la URL de la imagen
        alert("Imagen subida exitosamente");
      } else {
        console.error("Error en la respuesta:", result);
        alert("Error subiendo la imagen: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
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

      {imageUrl && (
        <div className="imagen_subida_upload">
          <h4 className="imagen_subida_upload">Imagen Subida:</h4>
          <img src={imageUrl} alt="Imagen del Restaurante" width="300" />
        </div>
      )}
    </div>
  );
};

export default UploadImageCloudinary;
