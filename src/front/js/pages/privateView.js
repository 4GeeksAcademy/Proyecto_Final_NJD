import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '/workspaces/Proyecto_Final_NJD/src/front/styles/privateView.css'; 

const PrivateView = () => {
    const [user, setUser] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fakeUser = { name: "Daria" }; 
        setUser(fakeUser);
    }, []);

    const handleHomeClick = () => {
        navigate('/');
    };

    if (!user) {
        return <p>Cargando usuario...</p>; 
    }

    return (
        <div className="private-view minimal-background">
            <div className="welcome-box minimal-box">
                <h1 className="private-view-title minimal-title">
                    ¡Bienvenida, {user.name}!
                </h1>
                <p className="private-view-text minimal-text">
                    Ahora ya puedes disfrutar de la experiencia <strong>¡Hoy no cocino!</strong> al máximo. Encuentra tu restaurante ideal y haz tu reserva ya mismo.
                </p>

                <button className="minimal-button" onClick={handleHomeClick}>
                    Encuentra tu restaurante
                </button>
            </div>
        </div>
    );
};

export default PrivateView;
