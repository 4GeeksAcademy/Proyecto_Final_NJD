import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CartaModal from "../component/cartaModal";
import OpinionModal from "../component/OpinionModal";
import { Context } from "../store/appContext";
import { Reserva } from "./reserva";
import "../../styles/vistaDetails.css";



export const RestaurantDetail = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCartaModalOpen, setIsCartaModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("No especificado");


    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("modal")) {
            closeModal();
            closeOpinionModal();
            CartaCloseModal();
        }
    };
    
    const openModal = () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            setIsModalOpen(true);
        } else {
            Swal.fire({
                title: "Registro requerido",
                text: "Debes estar registrado para realizar una reserva.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Registrarse",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const signupModal = new bootstrap.Modal(document.getElementById("signupModal"));
                    signupModal.show();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate("/");
                }
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openOpinionModal = () => {
        setIsOpinionModalOpen(true);
    };

    const closeOpinionModal = () => {
        setIsOpinionModalOpen(false);
    };

    const CartaOpenModal = () => {
        setIsCartaModalOpen(true);
    };

    const CartaCloseModal = () => {
        setIsCartaModalOpen(false);
    };

    const opinions = [
        {
            id: 1,
            name: "Carlos Pérez",
            rating: 5,
            comment: "Una experiencia increíble, la comida es deliciosa y el servicio excelente.",
            photo: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 2,
            name: "Ana Gómez",
            rating: 4,
            comment: "Me encantaron las tapas, aunque la espera fue un poco larga.",
            photo: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            id: 3,
            name: "Juan López",
            rating: 5,
            comment: "Un lugar acogedor con un ambiente perfecto para una cena romántica.",
            photo: "https://randomuser.me/api/portraits/men/2.jpg",
        },
    ];

    const nextOpinion = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % opinions.length);
    };

    const prevOpinion = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + opinions.length) % opinions.length);
    };

    useEffect(() => {
        const mockRestaurants = [
            { id: 1, nombre: "Trattoria Bella", categorias_id: 1, direccion: "Calle Mayor 45, Madrid", rating: 4.7, priceRange: "€€", image: "https://i0.wp.com/travelandleisure-es.com/wp-content/uploads/2024/04/TAL-ristorante-seating-ITLNRESTAURANTS0424-5403b234cdbd4026b2e98bed659b1634.webp?fit=750%2C500&ssl=1" },
            { id: 2, nombre: "Pasta Fresca", categorias_id: 1, direccion: "Calle de la Paz 10, Valencia", rating: 4.3, priceRange: "€€", image: "https://static.wixstatic.com/media/e7e925_6e8c1ffb4cd8432ea5a37cec591048ad~mv2.jpg/v1/fill/w_2880,h_1598,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/e7e925_6e8c1ffb4cd8432ea5a37cec591048ad~mv2.jpg" },
            { id: 3, nombre: "Osteria del Mare", categorias_id: 1, direccion: "Paseo Marítimo 8, Barcelona", rating: 4.5, priceRange: "€€", image: "https://s3.abcstatics.com/abc/www/multimedia/gastronomia/2023/01/16/forneria-RMj62LyNsJZlBCufEion5YK-1200x840@abc.jpg" },

            { id: 4, nombre: "El Mariachi Loco", categorias_id: 3, direccion: "Avenida de América 23, Madrid", rating: 4.6, priceRange: "€€", image: "https://i0.wp.com/lattin.ca/wp-content/uploads/2016/05/El_Catrin_Inside_51.png?w=1085&ssl=1" },
            { id: 5, nombre: "Cantina del Cactus", categorias_id: 3, direccion: "Boulevard de los Aztecas 15, Barcelona", rating: 4.2, priceRange: "€€", image: "https://images.ecestaticos.com/kCk1Qljo-a1ll2eVt2ovDfRo7pY=/0x0:1885x900/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fc66%2Fa99%2F8d5%2Fc66a998d5952c07d264a23dfdbecdcf2.jpg" },
            { id: 6, nombre: "Tacos y Más", categorias_id: 3, direccion: "Calle del Carmen 99, Valencia", rating: 4.7, priceRange: "€€", image: "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/08/04/62ebd8920f8fe.r_d.3275-3425-1343.jpeg" },

            { id: 7, nombre: "Sakura House", categorias_id: 6, direccion: "Calle Bonsai 12, Madrid", rating: 4.8, priceRange: "€€", image: "https://winegogh.es/wp-content/uploads/2024/08/kelsen-fernandes-2hEcc-4cwZA-unsplash-scaled.jpg" },
            { id: 8, nombre: "Samurai Sushi", categorias_id: 6, direccion: "Avenida de Japón 23, Barcelona", rating: 4.6, priceRange: "€€", image: "https://imagenes.esdiario.com/files/image_990_660/uploads/2024/06/22/66765b6b14a50.jpeg" },
            { id: 9, nombre: "Yoko Ramen", categorias_id: 6, direccion: "Calle del Pescador 7, Valencia", rating: 4.4, priceRange: "€€", image: "https://media.timeout.com/images/100614777/1536/864/image.webp" },

            { id: 10, nombre: "Dragón Rojo", categorias_id: 5, direccion: "Calle Pagoda 34, Madrid", rating: 4.5, priceRange: "€€", image: "https://offloadmedia.feverup.com/valenciasecreta.com/wp-content/uploads/2022/01/13123703/restaurantes-chinos-valencia-1024x683.jpg" },
            { id: 11, nombre: "Dim Sum Palace", categorias_id: 5, direccion: "Avenida Oriente 22, Barcelona", rating: 4.3, priceRange: "€€", image: "https://offloadmedia.feverup.com/valenciasecreta.com/wp-content/uploads/2022/01/13123704/277526606_706703347177521_4948663648545209465_n.jpg" },
            { id: 12, nombre: "Pekin Express", categorias_id: 5, direccion: "Calle Muralla 8, Sevilla", rating: 4.2, priceRange: "€€", image: "https://www.lavanguardia.com/files/image_990_484/uploads/2020/01/15/5e9977269a0d4.jpeg" },

            { id: 13, nombre: "Curry Masala", categorias_id: 7, direccion: "Calle Taj Mahal 12, Madrid", rating: 4.6, priceRange: "€€", image: "https://www.sentirsebiensenota.com/wp-content/uploads/2022/04/restaurantes-indios-valencia-1080x640.jpg" },
            { id: 14, nombre: "Palacio del Sabor", categorias_id: 7, direccion: "Avenida Ganges 5, Valencia", rating: 4.4, priceRange: "€€", image: "https://tumediodigital.com/wp-content/uploads/2021/03/comida-india-valencia.jpg" },
            { id: 15, nombre: "Namaste India", categorias_id: 7, direccion: "Boulevard Raj 10, Barcelona", rating: 4.7, priceRange: "€€", image: "https://phantom-elmundo.unidadeditorial.es/7279f37ebecb49cf7738402f76486caa/crop/0x0/1478x985/resize/746/f/webp/assets/multimedia/imagenes/2021/06/15/16237493606773.png" },

            { id: 16, nombre: "Hard Rock", categorias_id: 6, direccion: "Avenida de la Libertad 45, Madrid", rating: 4.2, priceRange: "€€", image: "https://ibiza-spotlight1.b-cdn.net/sites/default/files/styles/embedded_auto_740_width/public/article-images/138583/embedded-1901415944.jpeg?itok=oWiIVuDP" },
            { id: 17, nombre: "Steak House", categorias_id: 6, direccion: "Calle Ruta 66 77, Barcelona", rating: 4.5, priceRange: "€€", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/34/e2/7d/barbecued-pork-ribs.jpg?w=1200&h=-1&s=1" },
            { id: 18, nombre: "Bernie's Diner", categorias_id: 6, direccion: "Calle Manhattan 23, Valencia", rating: 4.3, priceRange: "€€", image: "https://offloadmedia.feverup.com/barcelonasecreta.com/wp-content/uploads/2015/07/09112834/usa-2.jpg" },

            { id: 19, nombre: "Taberna Flamenca", categorias_id: 4, direccion: "Calle Sevilla 7, Sevilla", rating: 4.6, priceRange: "€€", image: "https://s1.ppllstatics.com/hoy/www/multimedia/202111/13/media/cortadas/165813563--1968x1310.jpg" },
            { id: 20, nombre: "Casa del Arroz", categorias_id: 4, direccion: "Paseo de la Castellana 12, Madrid", rating: 4.4, priceRange: "€€", image: "https://ibiza-spotlight1.b-cdn.net/sites/default/files/styles/embedded_auto_740_width/public/article-images/138301/embedded-1808145593.jpg?itok=06R4cJZd" },
            { id: 21, nombre: "Sabores del Mar", categorias_id: 4, direccion: "Plaza del Mar 3, Barcelona", rating: 4.5, priceRange: "€€€", image: "https://imagenes.elpais.com/resizer/v2/D7EEJHYCERGLVFSCY43QPDLO6E.jpg?auth=0dbf855b68440ee29905c103edef7d7cc1add094e50abbc376b2494772c44dd9&width=1200" },

            { id: 22, nombre: "Oasis del Sabor", categorias_id: 10, direccion: "Calle del Desierto 14, Granada", rating: 4.6, priceRange: "€€", image: "https://www.sientemarruecos.viajes/wp-content/uploads/2019/10/El-Restaurante-Al-Mounia-es-un-restaurante-marroqu%C3%AD-en-Madrid.jpg" },
            { id: 23, nombre: "El Sultán", categorias_id: 10, direccion: "Avenida Oasis 18, Córdoba", rating: 4.5, priceRange: "€€", image: "https://www.guiarepsol.com/content/dam/repsol-guia/contenidos-imagenes/comer/nuestros-favoritos/restaurante-el-califa-(vejer,-c%C3%A1diz)/00El_Califa_.jpg" },
            { id: 24, nombre: "Mezze Lounge", categorias_id: 10, direccion: "Boulevard Dubai 25, Madrid", rating: 4.7, priceRange: "€€", image: "https://marruecoshoy.com/wp-content/uploads/2021/09/chebakia.png" },

            { id: 25, nombre: "Bangkok Delight", categorias_id: 9, direccion: "Calle Siam 4, Barcelona", rating: 4.4, priceRange: "€€", image: "https://viajeatailandia.com/wp-content/uploads/2018/07/Restaurantes-Tailandia.jpg" },
            { id: 26, nombre: "Sabai Sabai", categorias_id: 9, direccion: "Avenida Phuket 21, Madrid", rating: 4.5, priceRange: "€€", image: "https://www.topasiatour.com/pic/thailand/city/Bangkok/guide/jianxing-restaurant.jpg" },

            { id: 27, nombre: "Thai Spice", categorias_id: 9, direccion: "Boulevard Chiang Mai 8, Valencia", rating: 4.7, priceRange: "€€", image: "https://www.hola.com/imagenes/viajes/2015030677296/bares-restaurantes-rascacielos-bangkok-tailandia/0-311-16/a_Sirocco---interior-a.jpg" },

            { id: 28, nombre: "Haller", categorias_id: 11, direccion: "Avenida Montmartre 9, Barcelona", rating: 4.7, priceRange: "€€", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/f8/0d/4d/arbol-de-yuca.jpg?w=2400&h=-1&s=1" },
            { id: 29, nombre: "Sublimotion", categorias_id: 11, direccion: "Paseo de la Castellana 13, Madrid", rating: 4.6, priceRange: "€€", image: "https://www.economistjurist.es/wp-content/uploads/sites/2/2023/08/293978.jpeg" },
            { id: 30, nombre: "Chez Marie", categorias_id: 11, direccion: "Calle Napoleón 19, Valencia", rating: 4.5, priceRange: "€€", image: "https://6e131064.rocketcdn.me/wp-content/uploads/2022/08/Girafe%C2%A9RomainRicard-5-1100x650-1.jpeg" },

            { id: 31, nombre: "Asador Don Julio", categorias_id: 2, direccion: "Calle de la Carne 9, Madrid", rating: 4.7, priceRange: "€€", image: "https://media.timeout.com/images/106116523/1536/864/image.webp" },
            { id: 32, nombre: "Casa del Fernet", categorias_id: 2, direccion: "Paseo Marítimo 11, Barcelona", rating: 4.6, priceRange: "€€", image: "https://rio-marketing.com/wp-content/uploads/2024/02/fernet1.webp" },
            { id: 33, nombre: "Empanadas Locas", categorias_id: 2, direccion: "Calle de Verdad 19, Valencia", rating: 4.5, priceRange: "€€", image: "https://cdn.inteligenciaviajera.com/wp-content/uploads/2019/11/comida-tipica-argentina.jpg" },

            { id: 34, nombre: "Green Delight", categorias_id: 12, direccion: "Avenida de la Paz 45, Madrid", rating: 4.7, priceRange: "€€", image: "https://menusapiens.com/wp-content/uploads/2017/04/Comida-Sana-Alta-Cocina-MenuSapiens.jpeg" },
            { id: 35, nombre: "Vida Verde", categorias_id: 12, direccion: "Calle de la Luna 8, Barcelona", rating: 4.6, priceRange: "€€", image: "https://imagenes.elpais.com/resizer/v2/BSUD6VP76FGXJJE75BHINHYRAY.jpg?auth=2b94a0b2cdda6a164ea7b90ff96035281c2cd1ae8ead08a9d6d24df0d8ad9882&width=1200" },
            { id: 36, nombre: "Hortaliza Viva", categorias_id: 12, direccion: "Calle Mayor 21, Valencia", rating: 4.5, priceRange: "€€", image: "https://blog.covermanager.com/wp-content/uploads/2024/05/Como-Crear-un-Menu-Sostenible-para-Restaurantes-2048x1365.jpg" },

            { id: 37, nombre: "Sabor Latino", categorias_id: 13, direccion: "Calle de Alcalá 22, Madrid", rating: 4.7, priceRange: "€€", image: "https://www.clarin.com/img/2021/06/03/_32tg_291_1256x620__1.jpg" },
            { id: 38, nombre: "El Fogón de la Abuela", categorias_id: 13, direccion: "Calle de la Reina 15, Barcelona", rating: 4.6, priceRange: "€€", image: "https://jotajotafoods.com/wp-content/uploads/2022/05/plato-Bandeja-Paisa.jpg" },
            { id: 39, nombre: "Casa Caribe", categorias_id: 13, direccion: "Paseo de la Castellana 33, Valencia", rating: 4.5, priceRange: "€€", image: "https://theobjective.com/wp-content/uploads/2024/04/2022-09-02.webp" }
        ];

        const fetchRestaurantFromBackend = async (restaurantId) => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes/${restaurantId}`);
                const data = await response.json();
                if (response.ok) {
                    const categoryData = await actions.obtenerUnaCategoria(data.categorias_id);
                    setCategoryName(categoryData ? categoryData.nombre_de_categoria : "No especificado");
                    setRestaurant({
                        ...data,
                        priceRange: data.priceRange || "No hay datos todavía",
                        rating: data.rating || "No hay datos todavía",
                        direccion: data.direccion || "No hay dirección disponible",
                        descripcion: data.descripcion || "No hay descripción disponible",
                    });
                } else {
                    setError("Error al cargar el restaurante");
                }
            } catch (err) {
                setError("Error de conexión con el servidor");
            }
            setLoading(false);
        };

        // Verificar si el restaurante es mockeado o viene del backend
        const foundRestaurant = mockRestaurants.find((r) => r.id === parseInt(id));
        if (foundRestaurant) {
            const fetchMockCategory = async (categoriaId) => {
                const categoryData = await actions.obtenerUnaCategoria(categoriaId);
                setCategoryName(categoryData ? categoryData.nombre_de_categoria : "No especificado");
            };

            fetchMockCategory(foundRestaurant.categorias_id);
            setRestaurant(foundRestaurant);
            setLoading(false);
        } else {
            fetchRestaurantFromBackend(id);
        }
    }, [id, actions]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!restaurant) return <div>No restaurant found</div>;

    return (
        <div className="container-detail-cards">
            <div className="restaurant-detail-layout">
                <div className="area-header">
                    <h1 className="titulo-principal">Tu restaurante elegido</h1>
                </div>
                <div className="restaurant-card">
                    <img
                        src={restaurant.image || "https://via.placeholder.com/150"}
                        alt={restaurant.nombre}
                        className="restaurant-image"
                    />
                    <div className="restaurant-info">
                        <h3>{restaurant.nombre}</h3>
                        <p>{restaurant.direccion}</p>
                        <p><strong>Tipo:</strong> {categoryName || "No especificado"}</p>
                        <p><strong>Valoración:</strong> {restaurant.rating || "No hay datos todavía"} ⭐</p>
                        <p><strong>Rango de Precios:</strong> {restaurant.priceRange}</p>
                    </div>
                </div>

                <div className="restaurant-description-container">
                    <div className="restaurant-description">
                        <h2>¿Todavía no nos conoces?</h2>
                        {restaurant.descripcion ? (
                            <p>{restaurant.descripcion}</p>
                        ) : (
                            <p>
                                <strong>{restaurant.nombre}</strong> es un acogedor restaurante ubicado en el corazón de la ciudad,
                                especializado en cocina <strong>{categoryName}</strong> con un toque contemporáneo.
                                El ambiente es cálido y relajado, con una decoración rústica y moderna a la vez,
                                que mezcla tonos de madera natural y luces tenues, creando un espacio perfecto
                                para disfrutar de una comida íntima o una reunión con amigos.
                            </p>
                        )}
                    </div>


                    <div className="restaurant-buttons">
                        <button onClick={openModal} className="action-button">RESERVA AHORA</button>
                        <button onClick={CartaOpenModal} className="action-button">VER NUESTRA CARTA</button>
                        <button onClick={openOpinionModal} className="action-button">VER OPINIONES</button>
                    </div>
                </div>
            </div>

            <div onClick={handleBackdropClick}>
                <Reserva
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    restaurante_id={id}
                />
                <CartaModal
                    isOpen={isCartaModalOpen}
                    onClose={CartaCloseModal}
                />
                <OpinionModal
                    isOpen={isOpinionModalOpen}
                    onClose={closeOpinionModal}
                    opinions={restaurant.opinions || opinions}
                    currentIndex={currentIndex}
                    nextOpinion={nextOpinion}
                    prevOpinion={prevOpinion}
                />
            </div>
        </div>
    );
};
