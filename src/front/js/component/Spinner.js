// components/Spinner.js
import React from "react";
import "../../styles/spinner.css";

const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner">
      <div className="spinner-circle"></div>
    </div>
    <p>Cargando restaurantes...</p>
  </div>
);

export default Spinner;
