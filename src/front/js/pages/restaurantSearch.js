
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importar useParams
import { Link } from "react-router-dom";

export const RestaurantSearch = () => {
    const { tipo } = useParams(); // Capturar el tipo desde la URL
    const [searchQuery, setSearchQuery] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [favorites, setFavorites] = useState([]); // Estado para favoritos
    const [nombreCategoria, setNombreCategoria] = useState('')


    useEffect(() => {
    

        fetch(process.env.BACKEND_URL + '/api/categorias/' + tipo)
        .then(response=>response.json())
        .then(data=> setNombreCategoria(data.nombre_de_categoria))



     ;
    }, []);

    // Normalizar el tipo a minúsculas para la comparación
    const tipoNormalizado = tipo.toLowerCase();

    // Filtrar primero por tipo de restaurante
    const filteredByType = restaurants.filter(restaurant => restaurant.tipo.toLowerCase() === tipoNormalizado);

    // Filtrar por búsqueda dentro del tipo seleccionado
    const filteredRestaurants = filteredByType.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Agregar o quitar de favoritos
    const toggleFavorite = (restaurant) => {
        if (favorites.includes(restaurant)) {
            // Si ya está en favoritos, se elimina
            setFavorites(favorites.filter(fav => fav.id !== restaurant.id));
        } else {
            // Si no está en favoritos, se agrega
            setFavorites([...favorites, restaurant]);
        }
    };
    console.log("prueba")
    return (
        <>

            <div className="restaurant-search-container">
                <h2 className="tituloo">Restaurantes de comida {nombreCategoria}</h2>
                <input
                    type="text"
                    className="search-bar"
                    placeholder={`Buscar en restaurantes de tipo ${tipo}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />

                <div className="restaurant-cards-container">
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map(restaurant => (
                            <div className="restaurant-card" key={restaurant.id}>
                                <Link to={`/restaurant/detail/${restaurant.id}`}>
                                    <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                                </Link>
                                <div className="restaurant-info">
                                    <Link to={`/restaurant/detail/${restaurant.id}`}>
                                        <h3>{restaurant.name}</h3>
                                    </Link>
                                    <p>{restaurant.address}</p>
                                    <p><strong>Valoración:</strong> {restaurant.rating} ⭐</p>
                                    <p><strong>Rango de precios:</strong> {restaurant.priceRange}</p>
                                </div>
                                {/* Botón de favoritos */}
                                <button
                                    className={`favorite-button ${favorites.includes(restaurant) ? 'favorited' : ''}`}
                                    onClick={() => toggleFavorite(restaurant)}
                                >
                                    {favorites.includes(restaurant) ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron restaurantes que coincidan con la búsqueda en la categoría {tipo}.</p>
                    )}
                </div>
            </div>
        </>
    );
};



























































































































































































































































































































































































































































































































































