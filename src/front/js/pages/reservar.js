import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CartaModal from "../component/cartaModal";
import ReservationModal from "../component/reservationModal";
import { Context } from "../store/appContext";

export const Reservar = () => {

    const { store, actions } = useContext(Context); // PARA ACCEDER AL STORE
    const { id } = useParams();
    const [usuario, setUsuario] = useState([]);
    const [valoracion, setValoracion = useState([])]
    const [restaurant, setRestaurant] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCartaModalOpen, setIsCartaModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const CartaOpenModal = () => {
        setIsCartaModalOpen(true);
    };
    const CartaCloseModal = () => {
        setIsCartaModalOpen(false);
    };


    const comments = [
        {
            id: { store.usuarios.id },
            name: { store.usuarios.nombres },
            valoracion: { store.usuarios.usuario_valoracion },
            comment: { store.usuarios.valoracion_comentario }
        }
    ]

    return (
        <div className="restaurant-detail-main-container">
            <div className="restaurant-detail-container">
                <h1>{store.restaurant.name}</h1>
                <p>
                    <i className="fas fa-utensils" style={{ color: "#232323" }}></i> Tipo de comida: {store.restaurant.tipo}
                </p>
                <p>
                    <i className="fas fa-map-marker-alt" style={{ color: "#232323" }}></i> Dirección: {store.restaurant.address}
                </p>
                <p>
                    <strong>Valoración:</strong> {store.restaurant.rating} ⭐
                </p>
                <p>
                    <i className="fas fa-dollar-sign" style={{ color: "#232323" }}></i> Rango de Precios: {store.restaurant.priceRange}
                </p>
                <img src={store.restaurant.image} alt={store.restaurant.name} />
            </div>

            <div className="restaurant-detail-container2">
                <h2>¿Todavía no nos conoces?</h2>
                <p><strong>{store.restaurant.name}</strong> es un acogedor restaurante ubicado en el corazón de la ciudad, especializado en cocina <strong>{store.restaurant.tipo}</strong> con un toque contemporáneo.
                    El ambiente es cálido y relajado, con una decoración rústica y moderna a la vez, que mezcla tonos de madera natural y luces tenues, creando un espacio perfecto para disfrutar de una comida íntima o una reunión con amigos.
                    El menú ofrece una variedad de platos elaborados con ingredientes frescos y de temporada, destacando sus tapas, pescados frescos y carnes a la brasa, acompañados de una selecta carta de vinos.
                    Además, el servicio es atento y cercano, asegurando que cada comensal se sienta como en casa.</p>

                {/* Botón para abrir el modal de la reserva */}
                <button onClick={openModal} className="open-booking-button">RESERVA AHORA</button>
                {/* Botón para abrir el moda de la carta */}
                <button onClick={CartaOpenModal} className="open-carta-button">VER NUESTRA CARTA</button>

                <img src="https://img.freepik.com/psd-gratis/vista-superior-mesa-comedor-comida_23-2150943885.jpg?t=st=1728223273~exp=1728226873~hmac=a0558292b669aa3609f4227c053bd92e38945bcb3f56c3a0ef0a97f0bb03fc81&w=2000" alt="Fondo Restaurante" className="restaurant-image-fondo" />

            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
            />

            <CartaModal
                isOpen={isCartaModalOpen}
                onClose={CartaCloseModal}
            />


            {/* Slider de opiniones */}
            <div className="opinions-slider">
                <h5 className="opinions-text">Opiniones de nuestros comensales</h5>
                <div className="opinion-card">
                    <img src={opinions[currentIndex].photo} alt={opinions[currentIndex].name} />
                    <h3>{opinions[currentIndex].name}</h3>
                    <p>{'⭐'.repeat(opinions[currentIndex].rating)}</p>
                    <p>"{opinions[currentIndex].comment}"</p>
                </div>
                <div className="button-opinions-container">
                    <button className="button-opinions1" onClick={prevOpinion}>Anterior</button>
                    <button className="button-opinions2" onClick={nextOpinion}>Siguiente</button>
                </div>
            </div>
        </div>
    );
};