import React from "react";
import ReactDOM from "react-dom/client";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/index.css"; 
import "../styles/aboutUs.css";
import Layout from "./layout";  
// Añade esta nueva importación
import { enableDOMDebugging } from "./utils/debugHelper";

// Activa la depuración
const disableDOMDebugging = enableDOMDebugging();

// Opcional: Guarda la función para desactivar desde la consola
window.disableDOMDebugging = disableDOMDebugging;

console.log('Variables de entorno:');
console.log('BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
console.log('BASENAME:', process.env.BASENAME);

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Layout />);