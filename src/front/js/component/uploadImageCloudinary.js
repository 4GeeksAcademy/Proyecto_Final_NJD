import React, { useState } from "react";
import "../../styles/vistaPrivadaRestaurante.css";

const UploadImageCloudinary = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // guardar la imagen seleccionada
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", image); // esto será recibido por el backend

    try {
      // Enviar la imagen al backend!!!!!!!!!!!!!
      const response = await fetch("http://localhost:5000/api/upload_image", {
        method: "POST",
        body: formData,
      });
      

      const result = await response.json();

      if (response.ok) {
        setImageUrl(result.url); // Guardar la URL de la imagen subida
        onImageUpload(result.url); // Llamar al callback con la URL de la imagen
        alert("Imagen subida exitosamente");
      } else {
        alert("Error subiendo la imagen: " + result.error);
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
        <div>
          <h4 className="imagen_subida_upload">Imagen Subida:</h4>
          <img src={imageUrl} alt="Imagen del Restaurante" width="300" />
        </div>
      )}
    </div>
  );
};

export default UploadImageCloudinary;
