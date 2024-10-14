import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/privateView.css'; 

export const PrivateView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/'); 
        }
    }, []);

    if (!sessionStorage.getItem('token')) {
        return <p>Cargando usuario...</p>; 
    }

    return (
        <div className="private-view minimal-background">
            <div className="welcome-box minimal-box">
                <h1 className="private-view-title minimal-title">
                    ¡Hola {sessionStorage.getItem('user_name')}, te damos la bienvenida a tu área privada!
                </h1>
                <p className="private-view-text minimal-text">
                    Ahora ya puedes disfrutar de la experiencia <strong>¡Hoy no cocino!</strong> al máximo. Encuentra tu restaurante ideal y haz tu reserva ya mismo.
                </p>

                <button className="minimal-button" onClick={() => navigate('/')}>
                    Encuentra tu restaurante
                </button>
            </div>
        </div>
    );
};

