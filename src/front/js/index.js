// import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client"; // Actualizamos la importación
import '@fortawesome/fontawesome-free/css/all.min.css';

// include your index.scss file into the bundle
import "../styles/index.css";
import "../styles/aboutUs.css";

// import your own components
import Layout from "./layout";

// render your react application
const root = ReactDOM.createRoot(document.querySelector("#app")); // Usamos createRoot
root.render(<Layout />); // Renderizamos el Layout con createRoot
