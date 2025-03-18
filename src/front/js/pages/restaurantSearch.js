import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import Spinner from "../component/Spinner";
import "../../styles/vistaPrivadaUsuario.css";
import "../../styles/restaurantSearch.css";

export const RestaurantSearch = () => {
    const { categoria_id } = useParams();
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const navigate = useNavigate();
    const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Imagen+No+Disponible";

    // Primer useEffect para cargar los datos
    useEffect(() => {
        const loadData = async () => {
            try {
                console.log("Cargando restaurantes para la categoría:", categoria_id);
                // Iniciar la carga de restaurantes
                const restaurantPromise = actions.obtenerRestaurantesPorCategoria(categoria_id);
                
                // Obtener datos de la categoría
                const data = await actions.obtenerUnaCategoria(categoria_id);
                console.log("Categoría recibida:", data);
                
                if (data) {
                    setNombreCategoria(data.nombre_de_categoria);
                }
                
                // Esperar a que se completen los restaurantes si devuelve una promesa
                if (restaurantPromise instanceof Promise) {
                    await restaurantPromise;
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        window.scrollTo(0, 0);
        
        // Cleanup function
        return () => {
            // Cualquier limpieza necesaria
        };
    }, [categoria_id, actions]);

    // Segundo useEffect para filtrar restaurantes
    useEffect(() => {
        if (Array.isArray(store.restaurantes)) {
            const filtered = store.restaurantes.filter(restaurant =>
                (restaurant.nombre?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (restaurant.direccion?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            );
            setFilteredRestaurants(filtered);
            
            if (filtered.length === 0) {
                console.log("No hay restaurantes disponibles");
            }
        } else {
            setFilteredRestaurants([]);
            console.log("No hay restaurantes disponibles (array no válido)");
        }
    }, [store.restaurantes, searchQuery]);

    // Efecto para logging (solo en desarrollo)
    useEffect(() => {
        console.log("Restaurantes favoritos:", store.restaurantes_favoritos);
        console.log("Restaurantes filtrados:", filteredRestaurants);
    }, [store.restaurantes_favoritos, filteredRestaurants]);

    // Manejador para explorar otros tipos de comida
    const handleOtherCuisineClick = () => {
        navigate("/home");
        
        // Ejecutamos el scroll después de la navegación
        setTimeout(() => {
            const scrollTarget = document.getElementById("cuisine-scroll");
            if (scrollTarget) {
                scrollTarget.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    };

    const toggleFavorite = (restaurant) => {
        const user_id = sessionStorage.getItem('user_id');  // Comprobar si el usuario está logueado

        if (!user_id) {
            Swal.fire({
                title: "Inicia sesión para agregar a favoritos",
                text: "Debes iniciar sesión para agregar este restaurante a favoritos.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Iniciar sesión",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario acepta, mostramos el modal de login
                    try {
                        const loginModal = document.getElementById("loginModal");
                        if (loginModal) {
                            const bootstrap = window.bootstrap || { Modal: class {} };
                            const loginModalInstance = new bootstrap.Modal(loginModal);
                            loginModalInstance.show();
                        } else {
                            // Si el modal de login no está disponible, redirigir a la página de login
                            navigate("/login");
                        }
                    } catch (error) {
                        console.error("Error al mostrar el modal:", error);
                        navigate("/login");
                    }
                }
            });
            return;
        }

        // Si ya está logueado, se agrega o elimina de favoritos
        const isFavorite = store.restaurantes_favoritos.some(fav => fav.restaurante_id === restaurant.id);

        if (isFavorite) {
            actions.eliminarFavorito(user_id, restaurant.id);
        } else {
            actions.agregarFavorito(user_id, restaurant.id);
        }
        
        // No necesitamos actualizar favorites manualmente aquí, ya que el store
        // se actualizará y el useEffect con dependencia en store.restaurantes_favoritos
        // actualizará el estado automáticamente
    };

    // Spinner cuando los datos están siendo cargados
    if (loading) {
        return <Spinner />; // Aquí se renderiza el spinner mientras los datos se están cargando
    }

    return (
        <div className="area-privada">
            <div className="area-privada-container">
                <div className="area-header">
                    <h1 className="titulo-principal">Restaurantes de comida {nombreCategoria}</h1>
                </div>

                <div className="area-body">
                    <h4 className="titulo">Busca aquí tu restaurante de comida {nombreCategoria}:</h4>
                    <input
                        type="text"
                        className="search-bar form-control mb-3"
                        placeholder="Introduce el restaurante..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />

                    <div className="restaurant-cards-container">
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map(restaurant => (
                                <div className="restaurant-card" key={restaurant.id}>
                                    <Link to={`/restaurant/detail/${restaurant.id}`}>
                                        <img
                                            src={restaurant.image || imagenPorDefecto}
                                            alt={restaurant.nombre}
                                            className="restaurant-image"
                                        />
                                    </Link>
                                    <div className="restaurant-info">
                                        <Link to={`/restaurant/detail/${restaurant.id}`}>
                                            <h3>{restaurant.nombre}</h3>
                                        </Link>
                                        <p>{restaurant.direccion || 'Dirección no disponible'}</p>
                                        <p><strong>⭐ Valoración:</strong> {restaurant.rating || 'No disponible'} </p>
                                        <p><strong>💰 Rango de precios:</strong> {restaurant.priceRange || 'No disponible'}</p>
                                    </div>
                                    <div className="favorite-button-container">
                                        <button
                                            className={`favorite-button ${store.restaurantes_favoritos.some(fav => fav.restaurante_id === restaurant.id) ? 'favorited' : ''}`}
                                            onClick={() => toggleFavorite(restaurant)}
                                        >
                                            {store.restaurantes_favoritos.some(fav => fav.restaurante_id === restaurant.id) ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron restaurantes que coincidan con la búsqueda en la categoría {nombreCategoria}.</p>
                        )}
                    </div>

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