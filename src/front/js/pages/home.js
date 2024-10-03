import React, { useRef } from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom"; // Importamos Link para manejar la navegación

export const Home = () => {
	const scrollContainerRef = useRef(null);

	// Función para desplazarse a la izquierda
	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			if (scrollContainerRef.current.scrollLeft === 0) {
				// Si llegamos al principio, volvemos al final
				scrollContainerRef.current.scrollBy({
					left: scrollContainerRef.current.scrollWidth,
					behavior: "smooth",
				});
			} else {
				// Desplazarse a la izquierda normalmente
				scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
			}
		}
	};

	// Función para desplazarse a la derecha
	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const maxScrollLeft =
				scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

			if (scrollContainerRef.current.scrollLeft >= maxScrollLeft) {
				// Si llegamos al final, volvemos al principio
				scrollContainerRef.current.scrollTo({
					left: 0,
					behavior: "smooth",
				});
			} else {
				// Desplazarse a la derecha normalmente
				scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
			}
		}
	};

	// Función para manejar el envío del formulario
	const handleSubmit = (e) => {
		e.preventDefault();
		const form = e.target;
		const password = form.querySelector("#password").value;
		const repeatPassword = form.querySelector("#repeat-password").value;

		// Validación de contraseñas
		if (password !== repeatPassword) {
			alert("Las contraseñas no coinciden");
			return;
		}

		// Aquí puedes manejar el envío de datos al servidor
		alert("Formulario enviado correctamente");
		form.reset();
	};

	return (
		<div>
			<div className="image-header">
				<div className="overlay">
					<h1 className="text-white">¡Bienvenido a Hoy No Cocino!</h1>
					<p className="text-white">Encuentra los mejores restaurantes y realiza tus reservas de forma rápida y sencilla.</p>
				</div>
			</div>

			<div className="cuisine-scroll">
				<h2>Explora Tipos de Cocina</h2>
				<div className="scroll-wrapper">
					<button className="scroll-btn left" onClick={scrollLeft}>
						&lt;
					</button>

					<div className="scroll-container" ref={scrollContainerRef}>
						{/* Tarjetas de cocina */}
						{[
							{
								to: "/restaurantes/italiana",
								src: "https://media.istockphoto.com/id/1356961232/es/foto/espaguetis-con-alb%C3%B3ndigas-y-salsa-de-tomate-sobre-fondo-de-piedra.jpg?s=612x612&w=0&k=20&c=PCHiEkDs76zbU1zqbccuQVSTDuOzzhShryHGqwhcMxk=",
								alt: "Comida Italiana",
								label: "Italiana",
							},
							{
								to: "/restaurantes/argentina",
								src: "https://t4.ftcdn.net/jpg/06/47/71/83/360_F_647718371_xhN1faW9v3b0juc7RSwn7QkWBprCXvCK.jpg",
								alt: "Comida Argentina",
								label: "Argentina",
							},
							{
								to: "/restaurantes/mexicana",
								src: "https://png.pngtree.com/background/20230528/original/pngtree-restaurant-picture-image_2779734.jpg",
								alt: "Comida Mexicana",
								label: "Mexicana",
							},
							{
								to: "/restaurantes/mediterranea",
								src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsk0mG6T8jSeDXQNQlcVF0hqtGHVrmpVRqc_yFBUBSwgfZPsIp-oTvg9-e5Au468PgeZc&usqp=CAU",
								alt: "Comida Mediterránea",
								label: "Mediterránea",
							},
							{
								to: "/restaurantes/china",
								src: "https://st2.depositphotos.com/3300441/11588/i/380/depositphotos_115883670-stock-photo-chinese-food-blank-background.jpg",
								alt: "Comida China",
								label: "China",
							},
							{
								to: "/restaurantes/japonesa",
								src: "https://static3.depositphotos.com/1003713/173/i/380/depositphotos_1737431-stock-photo-japanese-food.jpg",
								alt: "Comida Japonesa",
								label: "Japonesa",
							},
							{
								to: "/restaurantes/india",
								src: "https://st4.depositphotos.com/1000589/30118/i/380/depositphotos_301181898-stock-photo-assorted-indian-food-on-black.jpg",
								alt: "Comida India",
								label: "India",
							},
							{
								to: "/restaurantes/americana",
								src: "https://st4.depositphotos.com/32042688/37964/i/450/depositphotos_379648604-stock-photo-burger-board-cheeseburger-fast-food.jpg",
								alt: "Comida Americana",
								label: "Americana",
							},
							{
								to: "/restaurantes/tailandesa",
								src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7ArYmmhHaJGjhvc6dtVRG2ry4SBOHa1_aA&s",
								alt: "Comida Tailandesa",
								label: "Tailandesa",
							},
							{
								to: "/restaurantes/arabe",
								src: "https://images.ecestaticos.com/jrya8NsDEIukDE4811K9viHOSJw=/4x155:1457x1245/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F2ef%2Fd23%2F6b1%2F2efd236b1a7c3c8fac9d379c04e7f659.jpg",
								alt: "Comida Arabe",
								label: "Arabe",
							},
							{
								to: "/restaurantes/internacional",
								src: "https://i0.wp.com/iamapassenger.com/wp-content/uploads/2021/02/paula-vermeulen-URjZkhqsuBk-unsplash.jpg?fit=3667%2C2750&ssl=1",
								alt: "Comida Internacional",
								label: "Internacional",
							},
							{
								to: "/restaurantes/latinoamerica",
								src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPJrK5FhZSciwBzr33zCT6IlttQe8D6XpoVB7sge1tfNIxRNLTPiX7ZP3jPlZfQjR1VN4&usqp=CAU",
								alt: "Comida Latinoamérica",
								label: "Latinoamérica",
							},
							{
								to: "/restaurantes/saludable",
								src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOZYgltbG_zDWGDxS-V_4ow_VLFZLpynfNTA&s",
								alt: "Comida Saludable",
								label: "Saludable",
							},
						].map(({ to, src, alt, label }, index) => (
							<div className="cuisine-card" key={index}>
								<Link to={to}>
									<img src={src} alt={alt} className="cuisine-image" />
									<span>{label}</span>
								</Link>
							</div>
						))}
					</div>
					<button className="scroll-btn right" onClick={scrollRight}>
						&gt;
					</button>
				</div>
			</div>

			{/* Jumbotron */}
			<div className="jumbotron-section">
				<img
					className="jumbotron-image"
					src="https://media.traveler.es/photos/6166d1a037c7dbc63e7ea9e9/master/w_2580%2Cc_limit/Peacock%2520Alley%2520(Xiamen%2C%2520China)%2520AB%2520Concept%25201.jpg"
					alt="Jumbotron"
				/>
				<div className="jumbotron-text">
					<h1 className="jumbotron-title">Únete a Nuestra Comunidad</h1>
					<h3 className="jumbotron-description">
						Descubre las mejores experiencias gastronómicas en tu ciudad.
						Regístrate y obtén acceso exclusivo a las mejores ofertas.
					</h3>
					{/* Botón que abre el modal */}
					<button
						className="join-button"
						data-bs-toggle="modal"
						data-bs-target="#signupModal"
					>
						Únete a nosotros. Regístrate
					</button>
				</div>
			</div>

			{/* Modal de Registro */}
			<div
				className="modal fade"
				id="signupModal"
				tabIndex="-1"
				aria-labelledby="signupModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="signupModalLabel">
								Registro
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="firstName" className="form-label">
										Nombre
									</label>
									<input
										type="text"
										className="form-control"
										id="firstName"
										placeholder="Tu nombre"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="lastName" className="form-label">
										Apellidos
									</label>
									<input
										type="text"
										className="form-control"
										id="lastName"
										placeholder="Tus apellidos"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">
										Correo electrónico
									</label>
									<input
										type="email"
										className="form-control"
										id="email"
										placeholder="example@correo.com"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">
										Contraseña
									</label>
									<input
										type="password"
										className="form-control"
										id="password"
										placeholder="Contraseña"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="repeat-password" className="form-label">
										Repetir contraseña
									</label>
									<input
										type="password"
										className="form-control"
										id="repeat-password"
										placeholder="Repite la contraseña"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="phone" className="form-label">
										Teléfono
									</label>
									<input
										type="tel"
										className="form-control"
										id="phone"
										placeholder="+34 645 28 79 37"
										required
									/>
								</div>
								<button type="submit" className="btn btn-primary">
									Registrarse
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};





		
