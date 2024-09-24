import React, { useRef } from "react";
import "../../styles/home.css";

export const Home = () => {
	const scrollContainerRef = useRef(null);

	// Función para desplazarse a la izquierda
	const scrollLeft = () => {
		scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
	};

	// Función para desplazarse a la derecha
	const scrollRight = () => {
		scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
	};

	return (
		<div>
			<div className="image-header">
				<div className="overlay">
					<h1>¡Bienvenido a Hoy No Cocino!</h1>
					<p>Encuentra los mejores restaurantes y realiza tus reservas de forma rápida y sencilla.</p>
				</div>
			</div>

			<div className="cuisine-scroll">
				<h2>Explora Tipos de Cocina</h2>
				<div className="scroll-wrapper">
					<button className="scroll-btn left" onClick={scrollLeft}>
						&lt;
					</button>

					<div className="scroll-container" ref={scrollContainerRef}>
						<div className="cuisine-card">Italiana</div>
						<div className="cuisine-card">Argentina</div>
						<div className="cuisine-card">Mexicana</div>
						<div className="cuisine-card">China</div>
						<div className="cuisine-card">Japonesa</div>
						<div className="cuisine-card">India</div>
						<div className="cuisine-card">Mediterránea</div>
					</div>

					<button className="scroll-btn right" onClick={scrollRight}>
						&gt;
					</button>
				</div>
			</div>
		</div>
	);
};
