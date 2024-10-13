import React, { useState } from "react";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Asegúrate de que la función esté marcada como async
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage("Se ha enviado un correo de recuperación.");
      } else {
        setMessage(data.msg || "Error al enviar el correo.");
      }
    } catch (error) {
      setMessage("Error en la solicitud. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo electrónico:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar correo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RecoverPassword;
