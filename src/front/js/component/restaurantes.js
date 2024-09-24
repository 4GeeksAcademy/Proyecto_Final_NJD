import React from "react";
import { useParams } from "react-router-dom";

export const Restaurantes = () => {
    const { tipo } = useParams();  // Captura el parámetro dinámico "tipo"
    
    // Simulación de un listado de restaurantes
    const restaurantes = [
        { nombre: "Pasta Palace", tipo: "Italiana" },
        { nombre: "Tango Steakhouse", tipo: "Argentina" },
        { nombre: "Taco Town", tipo: "Mexicana" },
        // Añade más restaurantes según los tipos que tengas
    ];

    // Filtrar los restaurantes según el tipo recibido por la URL
    const restaurantesFiltrados = restaurantes.filter(rest => rest.tipo === tipo);

    return (
        <div>
            <h1>Restaurantes de {tipo}</h1>
            <ul>
                {restaurantesFiltrados.map((restaurante, index) => (
                    <li key={index}>{restaurante.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

