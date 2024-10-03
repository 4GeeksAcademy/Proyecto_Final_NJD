import React, { useState } from "react";

export const RegistroRestaurante = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Iniciar Sesión como Restaurante" : "Registrar Restaurante"}</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input type="email" className="form-control" id="email" placeholder="example@correo.com" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" placeholder="Contraseña" />
                </div>

                {!isLogin && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="restaurant-name" className="form-label">Nombre del Restaurante</label>
                            <input type="text" className="form-control" id="restaurant-name" placeholder="Nombre de tu restaurante" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <input type="tel" className="form-control" id="phone" placeholder="+34 645 28 79 36" />
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-primary">{isLogin ? "Iniciar Sesión" : "Registrar Restaurante"}</button>
            </form>

            <button className="btn btn-secondary mt-3" onClick={toggleAuthMode}>
                {isLogin ? "¿No tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia Sesión"}
            </button>
        </div>
    );
};
