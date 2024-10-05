import React, { useState } from "react";

const UploadImageCloudinary = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleImageChange = (event) => {
        setImage(event.target.files[0]); // Guardar la imagen seleccionada
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("image", image); // Adjuntar la imagen al FormData

        try {
            // Enviar la imagen al backend
            const response = await fetch("/api/upload_image", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setImageUrl(result.url); // Guardar la URL de la imagen subida
                alert("Imagen subida exitosamente");
            } else {
                alert("Error subiendo la imagen");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Subir imagen del restaurante</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <button type="submit">Subir Imagen</button>
            </form>

            {imageUrl && (
                <div>
                    <h4>Imagen Subida:</h4>
                    <img src={imageUrl} alt="Imagen del Restaurante" width="300" />
                </div>
            )}
        </div>
    );
};

export default UploadImageCloudinary;
