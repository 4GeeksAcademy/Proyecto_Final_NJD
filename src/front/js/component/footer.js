import React, { Component } from "react";

export const Footer = () => (
	<>
		<footer>
			<div className="footer-container">
				<div className="footer-section">
					<h3>Hoy no cocino</h3>
					<p>Reservas en los mejores restaurantes de alta calidad.</p>
				</div>

				<div className="footer-section">
					<h4>Enlaces útiles</h4>
					<ul>
						<li><a href="#about">Sobre nosotros</a></li>
						<li><a href="#faq">Preguntas frecuentes</a></li>
						<li>
							<a href="#restaurantModal" data-bs-toggle="modal" data-bs-target="#restaurantModal">
								¿Eres un restaurante?
							</a>
						</li>
					</ul>
				</div>

				<div className="footer-section">
					<h4>Contáctanos</h4>
					<p>Email: hoynococino.ceo@gmail.com</p>
					<p>Teléfono: +123 456 789</p>
				</div>

				<div className="footer-section">
					<h4>Nuestras redes</h4>
					<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |
					<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> |
					<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
				</div>
			</div>
			<div className="footer-bottom">
				<p>&copy; 2024 Hoy no cocino. Todos los derechos reservados.</p>
			</div>
		</footer>

		{/* Modal "¿Eres un restaurante?" */}
		<div className="modal fade" id="restaurantModal" tabIndex="-1" aria-labelledby="restaurantModalLabel" aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="restaurantModalLabel">Regístrate como Restaurante</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div className="modal-body">
						<form>
							<div className="mb-3">
								<label htmlFor="restaurant-name" className="form-label">Nombre del restaurante</label>
								<input type="text" className="form-control" id="restaurant-name" placeholder="Nombre de tu restaurante" />
							</div>
							<div className="mb-3">
								<label htmlFor="restaurant-email" className="form-label">Correo electrónico</label>
								<input type="email" className="form-control" id="restaurant-email" placeholder="example@correo.com" />
							</div>
							<div className="mb-3">
								<label htmlFor="restaurant-phone" className="form-label">Teléfono</label>
								<input type="tel" className="form-control" id="restaurant-phone" placeholder="+34 645 28 79 36" />
							</div>
							<div className="mb-3">
								<label htmlFor="restaurant-address" className="form-label">Dirección</label>
								<input type="text" className="form-control" id="restaurant-address" placeholder="Dirección del restaurante" />
							</div>
							<button type="submit" className="btn btn-primary">Enviar</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</>
);
