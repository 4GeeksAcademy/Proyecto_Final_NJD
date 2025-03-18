import React from "react";
import ReactDOM from "react-dom/client";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/index.css"; 
import "../styles/aboutUs.css";
import Layout from "./layout";  

console.log('Variables de entorno:');
console.log('BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
console.log('BASENAME:', process.env.BASENAME);

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Layout />);