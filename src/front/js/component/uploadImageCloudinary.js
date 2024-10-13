import React, { useState } from "react";
import Swal from "sweetalert2"; // SweetAlert2 para notificaciones

const UploadImageCloudinary = ({ restauranteId, onImageUpload }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      Swal.fire("Error", "Por favor selecciona una imagen", "error");
      return;
    }

    try {
      // Lógica para subir la imagen al servidor
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.secure_url) {
        Swal.fire("Imagen subida", "La imagen se subió con éxito", "success");
        onImageUpload(result.secure_url); 
      } else {
        Swal.fire("Error", "Hubo un problema al subir la imagen", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  return (
    <div>
      <h3>Sube una imagen del restaurante:</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit" className="btn btn-primary mt-2">Subir Imagen</button>
      </form>
    </div>
  );
};

export default UploadImageCloudinary;
