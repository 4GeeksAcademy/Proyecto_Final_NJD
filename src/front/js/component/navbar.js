import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../../img/logoblanco.png";
import "/workspaces/Proyecto_Final_NJD/src/front/styles/index.css"

export const Navbar = () => {
	return (
		<>
			<nav className="navbar navbar-dark">
				<div className="container">
					<Link to="/">
						<span className="navbar-brand">
							<img src={logoImage} />
						</span>
					</Link>
					<div className="ml-auto nav-links">
						<a href="#loginModal" data-bs-toggle="modal" data-bs-target="#loginModal">
							Iniciar Sesión
						</a>
						<a href="#signupModal" data-bs-toggle="modal" data-bs-target="#signupModal">
							Registro
						</a>
					</div>
				</div>
			</nav>

			{/* Modal LOGIN */}
			<div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Correo electrónico</label>
									<input type="email" className="form-control" id="email" placeholder="example@correo.com" />
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Contraseña</label>
									<input type="password" className="form-control" id="password" placeholder="Contraseña" />
								</div>
								<button type="submit" className="btn btn-primary">Iniciar Sesión</button>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Modal SIGNUP */}
			<div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="signupModalLabel">Registro</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form>
								<div className="mb-3">
									<label htmlFor="firstName" className="form-label">Nombre</label>
									<input type="text" className="form-control" id="firstName" placeholder="Tu nombre" />
								</div>
								<div className="mb-3">
									<label htmlFor="lastName" className="form-label">Apellidos</label>
									<input type="text" className="form-control" id="lastName" placeholder="Tus apellidos" />
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Correo electrónico</label>
									<input type="email" className="form-control" id="email" placeholder="example@correo.com" />
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Contraseña</label>
									<input type="password" className="form-control" id="password" placeholder="Contraseña" />
								</div>
								<div className="mb-3">
									<label htmlFor="repeat-password" className="form-label">Repetir contraseña</label>
									<input type="password" className="form-control" id="repeat-password" placeholder="Repite la contraseña" />
								</div>
								<div className="mb-3">
									<label htmlFor="phone" className="form-label">Teléfono</label>
									<input type="tel" className="form-control" id="phone" placeholder="+34 645 28 79 37" />
								</div>
								<button type="submit" className="btn btn-primary">Registrarse</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
