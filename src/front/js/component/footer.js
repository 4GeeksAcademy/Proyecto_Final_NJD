import React, { Component } from "react";

export const Footer = () => (
	<footer>
		<div class="footer-container">
			<div class="footer-section">
				<h3>Hoy no cocino</h3>
				<p>Reservas en los mejores restaurantes de alta calidad.</p>
			</div>

			<div class="footer-section">
				<h4>Enlaces útiles</h4>
				<ul>
					<li><a href="#about">Sobre nosotros</a></li>
					<li><a href="#faq">Preguntas frecuentes</a></li>
					<li><a href="#unete">Eres un restaurante?</a></li>

				</ul>
			</div>

			<div class="footer-section">
				<h4>Contáctanos</h4>
				<p>Email: contacto@hoynococino.es</p>
				<p>Teléfono: +123 456 789</p>
			</div>

			<div class="footer-section">
				<h4>Nuestras redes</h4>
				<a href="https://facebook.com" target="_blank">Facebook</a> |
				<a href="https://instagram.com" target="_blank">Instagram</a> |
				<a href="https://twitter.com" target="_blank">Twitter</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2024 Hoy no cocino. Todos los derechos reservados.</p>
		</div>
	</footer>
);
