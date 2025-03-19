import React, { useState, useEffect, useContext, useRef } from "react";
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
    
    // Añadimos una referencia para controlar si el componente está montado
    const isMounted = useRef(true);

    // Primer useEffect para cargar los datos
    useEffect(() => {
        // Función asíncrona para cargar datos
        const cargarDatos = async () => {
            console.log("Cargando restaurantes para la categoría:", categoria_id);
            
            try {
                // Obtener restaurantes
                await actions.obtenerRestaurantesPorCategoria(categoria_id);
                
                // Obtener categoría
                const data = await actions.obtenerUnaCategoria(categoria_id);
                
                // Verificar que el componente sigue montado antes de actualizar el estado
                if (isMounted.current) {
                    console.log("Categoría recibida:", data);
                    if (data) {
                        setNombreCategoria(data.nombre_de_categoria);
                        setLoading(false); // Datos cargados, podemos quitar el spinner
                    }
                }
            } catch (error) {
                console.error("Error al obtener datos", error);
                // Verificar que el componente sigue montado antes de actualizar el estado
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };
        
        // Llamar a la función
        cargarDatos();
        
        window.scrollTo(0, 0);
        
        // Limpieza: marcar el componente como desmontado
        return () => {
            isMounted.current = false;
        };
    }, [categoria_id]);

    // Segundo useEffect para filtrar restaurantes
    useEffect(() => {
        if (!isMounted.current) return; // No hacer nada si el componente está desmontado
        
        if (Array.isArray(store.restaurantes)) {
            const filtered = store.restaurantes.filter(restaurant =>
                restaurant.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.direccion?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRestaurants(filtered);
        } else {
            setFilteredRestaurants([]);
        }
    }, [store.restaurantes, searchQuery]);

    // Efecto para logging
    useEffect(() => {
        if (!isMounted.current) return; // No hacer nada si el componente está desmontado
        
        console.log("Restaurantes favoritos:", store.restaurantes_favoritos);
        console.log("Restaurantes filtrados:", filteredRestaurants);
    }, [store.restaurantes_favoritos, filteredRestaurants]);

    // Comprobación de restaurantes disponibles
    useEffect(() => {
        if (!isMounted.current) return; // No hacer nada si el componente está desmontado
        
        if (filteredRestaurants.length === 0) {
            console.log("No hay restaurantes disponibles");
        }
    }, [filteredRestaurants]);

    // Manejador para explorar otros tipos de comida
    const handleOtherCuisineClick = () => {
        navigate("/home");
    };

    // UseEffect para manejar el timeout y el scroll
    useEffect(() => {
        if (!isMounted.current) return; // No hacer nada si el componente está desmontado
        
        const timeoutId = setTimeout(() => {
            if (!isMounted.current) return; // Verificar nuevamente después del timeout
            
            const scrollTarget = document.getElementById("cuisine-scroll");
            if (scrollTarget) {
                scrollTarget.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);

        // Limpieza del timeout cuando el componente se desmonte
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

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
                if (result.isConfirmed && isMounted.current) {
                    // Si el usuario acepta, mostramos el modal de login
                    const loginModal = document.getElementById("loginModal");
                    if (loginModal) {
                        const loginModalInstance = new bootstrap.Modal(loginModal);
                        loginModalInstance.show();
                    } else {
                        // Si el modal de login no está disponible, redirigir a la página de login
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
            if (isMounted.current) {
                setFavorites(store.restaurantes_favoritos.filter(fav => fav.restaurante_id !== restaurant.id));
            }
        } else {
            actions.agregarFavorito(user_id, restaurant.id);
            if (isMounted.current) {
                setFavorites([...store.restaurantes_favoritos, restaurant]);
            }
        }
        
        // Actualiza el estado de favoritos con la lista más reciente desde el store
        if (isMounted.current) {
            setFavorites(store.restaurantes_favoritos);
        }
    };

    // Renderizado usando una estructura única para evitar problemas de manipulación DOM
    // Usamos renderizado condicional en lugar de retornos diferentes
    return (
        <div className="restaurant-search-container">
            {loading ? (
                <Spinner />
            ) : (
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
                                                <p>{restaurant.direccion}</p>
                                                <p><strong>⭐ Valoración:</strong> {restaurant.rating || 'No disponible'} </p>
                                                <p><strong>💰 Rango de precios:</strong> {restaurant.priceRange || 'No disponible'}</p>
                                            </div>
                                            <div className="favorite-button-container">
                                                <button
                                                    className={`favorite-button ${store.restaurantes_favoritos.includes(restaurant) ? 'favorited' : ''}`}
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
            )}
        </div>
    );
};