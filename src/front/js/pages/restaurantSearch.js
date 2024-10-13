import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";  // Importamos SweetAlert
import { Context } from "../store/appContext";
import "../../styles/vistaPrivadaUsuario.css"; // Importa los estilos desde el mismo archivo

export const RestaurantSearch = () => {
    const { categoria_id } = useParams();  // Obtenemos categoria_id de los parámetros de la URL
    const { store, actions } = useContext(Context);
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const navigate = useNavigate();  // Reemplazo de useHistory por useNavigate

    const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Imagen+No+Disponible"; // Imagen por defecto

    useEffect(() => {
        // Asegurarse de que solo se obtengan restaurantes de la categoría seleccionada
        actions.obtenerRestaurantesPorCategoria(categoria_id);

        // Obtener el nombre de la categoría
        actions.obtenerUnaCategoria(categoria_id)
            .then(data => {
                if (data) {
                    setNombreCategoria(data.nombre_de_categoria);
                }
            })
            .catch(error => {
                console.error("Error al obtener la categoría", error);
            });

        // Hacer scroll hacia la parte superior de la página al montar el componente
        window.scrollTo(0, 0);
    }, [categoria_id]);

    const filteredRestaurants = Array.isArray(store.restaurantes)
        ? store.restaurantes.filter(restaurant =>
            restaurant.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.direccion?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    // Función para redirigir al home y hacer scroll al div con id 'cuisine-scroll'
    const handleOtherCuisineClick = () => {
        navigate("/home");  // Redirigir al home
        setTimeout(() => {
            const scrollTarget = document.getElementById("cuisine-scroll");
            if (scrollTarget) {
                scrollTarget.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);  // Un pequeño retraso para asegurarse de que la página esté cargada
    };

    const toggleFavorite = (restaurant) => {
        const user_id = sessionStorage.getItem('user_id');
        
        // Si no hay un usuario logueado, mostrar el SweetAlert para que se registre
        if (!user_id) {
            Swal.fire({
                title: "Registro requerido",
                text: "Debes estar registrado para agregar a favoritos.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Registrarse",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const signupModal = new bootstrap.Modal(document.getElementById("signupModal"));
                    signupModal.show(); // Mostrar el modal de registro si el usuario acepta
                } 
                // Si cancela, no redirigir a ningún lado, solo cerramos el SweetAlert
            });
            return; // No continuar con la ejecución de la función si no hay usuario
        }

        // Verificar si el restaurante ya está en favoritos usando el id
        const isFavorite = store.restaurantes_favoritos.some(fav => fav.restaurante_id === restaurant.id);

        if (isFavorite) {
            // Eliminar favorito
            actions.eliminarFavorito(user_id, restaurant.id);
            setFavorites(store.restaurantes_favoritos.filter(fav => fav.restaurante_id !== restaurant.id));
        } else {
            // Agregar favorito
            actions.agregarFavorito(user_id, restaurant.id);
            setFavorites([...store.restaurantes_favoritos, restaurant]);
        }
    };

    useEffect(() => {
        console.log(filteredRestaurants)
    }, [store.restaurantes_favoritos, filteredRestaurants]);

    return (
        <div className="area-privada">
            <div className="area-privada-container">
                {/* Header con el título principal */}
                <div className="area-header">
                    <h1 className="titulo-principal">Restaurantes de comida {nombreCategoria}</h1>
                </div>

                {/* Input de búsqueda y filtros */}
                <div className="area-body">
                    <h4 className="titulo">Busca aquí tu restaurante de comida {nombreCategoria}</h4>
                    <input
                        type="text"
                        className="search-bar form-control mb-3"
                        placeholder="Introduce el nombre del restaurante que estás buscando..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} // Actualiza la búsqueda cada vez que el usuario escribe
                    />

                    {/* Cards de restaurantes */}
                    <div className="restaurant-cards-container">
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map(restaurant => (
                                <div className="restaurant-card" key={restaurant.id}>
                                    <Link to={`/restaurant/detail/${restaurant.id}`}>
                                        <img
                                            src={restaurant.image || imagenPorDefecto}  // Usa la imagen por defecto si no hay imagen disponible
                                            alt={restaurant.nombre}
                                            className="restaurant-image"
                                        />
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
                                        className={`favorite-button ${store.restaurantes_favoritos.includes(restaurant) ? 'favorited' : ''}`}
                                        onClick={() => toggleFavorite(restaurant)}
                                    >
                                        {store.restaurantes_favoritos.some(fav => fav.restaurante_id === restaurant.id) ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron restaurantes que coincidan con la búsqueda en la categoría {nombreCategoria}.</p>
                        )}
                    </div>

                    {/* Nueva sección para redirigir al scroll de la home */}
                    <div className="other-cuisine-section">
                        <h4>¿Prefieres otro tipo de comida?</h4>
                        <button className="scroll-to-home-btn btn btn-secondary" onClick={handleOtherCuisineClick}>
                            Explora otros tipos de cocina
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
