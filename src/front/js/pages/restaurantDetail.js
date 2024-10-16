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
    ];

    const nextOpinion = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % opinions.length);
    };

    const prevOpinion = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + opinions.length) % opinions.length);
    };

    useEffect(() => {
        const mockRestaurants = [
            { id: 1, name: "Trattoria Bella", tipo: "Italiana", address: "Calle Mayor 45, Madrid", rating: 4.7, priceRange: "€€", image: "https://i0.wp.com/travelandleisure-es.com/wp-content/uploads/2024/04/TAL-ristorante-seating-ITLNRESTAURANTS0424-5403b234cdbd4026b2e98bed659b1634.webp?fit=750%2C500&ssl=1" },
            { id: 2, name: "Pasta Fresca", tipo: "Italiana", address: "Calle de la Paz 10, Valencia", rating: 4.3, priceRange: "€€", image: "https://static.wixstatic.com/media/e7e925_6e8c1ffb4cd8432ea5a37cec591048ad~mv2.jpg/v1/fill/w_2880,h_1598,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/e7e925_6e8c1ffb4cd8432ea5a37cec591048ad~mv2.jpg" },
            // Agrega aquí los otros 37 mockeados...
        ];

        const fetchRestaurantFromBackend = async (restaurantId) => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes/${restaurantId}`);
                const data = await response.json();
                if (response.ok) {
                    setRestaurant({
                        ...data,
                        priceRange: data.priceRange || "No hay datos todavía",
                        opinions: data.opinions || "No hay opiniones todavía",
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
            setRestaurant(foundRestaurant);
            setLoading(false);
        } else {
            fetchRestaurantFromBackend(id);
        }
    }, [id]);

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
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="restaurant-image"
                    />
                    <div className="restaurant-info">
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.address}</p>
                        <p><strong>Valoración:</strong> {restaurant.rating || "No hay datos todavía"} ⭐</p>
                        <p><strong>Rango de Precios:</strong> {restaurant.priceRange}</p>
                    </div>
                </div>

                <div className="restaurant-description-container">
                    <div className="restaurant-description">
                        <h2>¿Todavía no nos conoces?</h2>
                        <p>
                            <strong>{restaurant.name}</strong> es un acogedor restaurante ubicado en el corazón de la ciudad,
                            especializado en cocina <strong>{restaurant.tipo}</strong> con un toque contemporáneo.
                            El ambiente es cálido y relajado, con una decoración rústica y moderna a la vez,
                            que mezcla tonos de madera natural y luces tenues, creando un espacio perfecto
                            para disfrutar de una comida íntima o una reunión con amigos.
                        </p>
                    </div>

                    <div className="restaurant-buttons">
                        <button onClick={openModal} className="action-button">RESERVA AHORA</button>
                        <button onClick={CartaOpenModal} className="action-button">VER NUESTRA CARTA</button>
                        <button onClick={openOpinionModal} className="action-button">VER OPINIONES</button>
                    </div>
                </div>
            </div>

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
    );
};
