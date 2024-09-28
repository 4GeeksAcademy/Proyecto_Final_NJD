import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../img/logoblanco.png";
import "/workspaces/Proyecto_Final_NJD/src/front/styles/index.css"


export const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand">
						<img src={logoImage} />
					</span>
				</Link>
				<div className="ml-auto nav-links">

					<a className="iniciar" href="/login">Iniciar Sesión</a>
					<a className="registrar" href="/register">Registro</a>

				</div>
			</div>
		</nav>
	);
};
