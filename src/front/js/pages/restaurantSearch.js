import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const RestaurantSearch = () => {
    const { categoria_id } = useParams();  // Obtenemos categoria_id de los parámetros de la URL
    const { store, actions } = useContext(Context); 
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');

    useEffect(() => {
        // Asegurarse de que solo se obtengan restaurantes de la categoría seleccionada
        actions.obtenerRestaurantesPorCategoria(categoria_id);
    
        // Obtener el nombre de la categoría
        actions.obtenerUnaCategoria(categoria_id)
            .then(data => {
                console.log('Datos de la categoría:', data); // Verificar si los datos son correctos
                if (data) {
                    setNombreCategoria(data.nombre_de_categoria);
                }
            })
            .catch(error => {
                console.error("Error al obtener la categoría", error);
            });
    }, [categoria_id]);
    
    
    const filteredRestaurants = store.restaurantes.filter(restaurant =>
        restaurant.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.direccion?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFavorite = (restaurant) => {
        if (favorites.includes(restaurant)) {
            setFavorites(favorites.filter(fav => fav.id !== restaurant.id));
        } else {
            setFavorites([...favorites, restaurant]);
        }
    };

    return (
        <div className="restaurant-search-container">
            <h2 className="titulo">Restaurantes de comida {nombreCategoria}</h2>
            <input
                type="text"
                className="search-bar"
                placeholder={`Buscar en restaurantes de comida ${nombreCategoria}`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />

            <div className="restaurant-cards-container">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                        <div className="restaurant-card" key={restaurant.id}>
                            <Link to={`/restaurant/detail/${restaurant.id}`}>
                                <img src={restaurant.image} alt={restaurant.nombre} className="restaurant-image" />
                            </Link>
                            <div className="restaurant-info">
                                <Link to={`/restaurant/detail/${restaurant.id}`}>
                                    <h3>{restaurant.nombre}</h3>
                                </Link>
                                <p>{restaurant.direccion}</p>
                                <p><strong>Valoración:</strong> {restaurant.rating || 'No disponible'} ⭐</p>
                                <p><strong>Rango de precios:</strong> {restaurant.priceRange || 'No disponible'}</p>
                            </div>
                            <button
                                className={`favorite-button ${favorites.includes(restaurant) ? 'favorited' : ''}`}
                                onClick={() => toggleFavorite(restaurant)}
                            >
                                {favorites.includes(restaurant) ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron restaurantes que coincidan con la búsqueda en la categoría {nombreCategoria}.</p>
                )}
            </div>
        </div>
    );
};
