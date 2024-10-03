//API EMAIL
import React, { useState } from 'react';

const ReservaForm = () => {
    const [email, setEmail] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const reservaData = {
            email,
            restaurant_name: restaurantName,
            reservation_date: reservationDate,
            reservation_time: reservationTime
        };

        // Enviar los datos al backend
        fetch('/send-mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservaData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Correo de confirmación enviado correctamente.");
            } else {
                alert("Hubo un problema enviando el correo.");
            }
        })
        .catch(error => {
            console.error("Error enviando el correo: ", error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Nombre del restaurante:</label>
                <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Fecha de la reserva:</label>
                <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Hora de la reserva:</label>
                <input
                    type="time"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Hacer reserva</button>
        </form>
    );
};

export default ReservaForm;
