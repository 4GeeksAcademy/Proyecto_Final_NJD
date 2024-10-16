import React, { useEffect } from 'react';
import '../../styles/aboutUs.css';

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <div className="custom-container position-relative text-center">
                <img
                    src="https://ca.slack-edge.com/T0BFXMWMV-U06KNHAQYQP-96473a851c5e-512"
                    alt="Foto"
                    className="rounded-circle custom-img"
                />
                <h2 className="custom-title">Daria Dacha Zotova</h2>
                <p className="custom-text">A todos mis amigos que estuvieron a mi lado cada día, gracias por su apoyo incondicional. Este proyecto es también suyo. Y, sobre todo, a mis compañeros de equipo: sin vostros, nada de esto habría sido posible.</p>

            </div>

            <div className="custom-container position-relative text-center">
                <img
                    src="https://ebootcamp.net/wp-content/uploads/2021/11/4Geeks-Academy.jpeg"
                    alt="Foto"
                    className="rounded-circle custom-img"
                />
                <h2 className="custom-title">Nelson Valero</h2>
                <p className="custom-text">"Desde siempre, he creído en el poder de la buena comida para conectar personas y crear momentos memorables. Con HOY NO COCINO, mi objetivo es ofrecer una plataforma que no solo facilite encontrar y reservar en los mejores restaurantes, sino que también enriquezca la experiencia gastronómica de cada usuario. Queremos ser el puente entre los amantes de la buena mesa y los restaurantes que tienen mucho que ofrecer. Nuestro compromiso es seguir mejorando y creciendo para brindar siempre un servicio de excelencia. ¡Gracias por ser parte de esta gran comunidad!”</p>
            </div>

            <div className="custom-container position-relative text-center">
                <img
                    src="https://ca.slack-edge.com/T0BFXMWMV-U06UJA41DMW-eeb675e51ad6-192"
                    alt="Foto"
                    className="rounded-circle custom-img"
                />
                <h2 className="custom-title">Juan M. Pintos</h2>
                <p className="custom-text">Feliz de poder materializar en este proyecto todas las horas dedicadas...no fue facil, ni un poco. Agradecido al grupo que me toco en estas 18 semanas, pasamos de ser desconocidos a ser casi familia en algunos casos. No quisiera olvidarme de los profes...infinitas gracias por la paciencia! </p>
            </div>

            <div className="custom-container position-relative text-center">
                <img
                    src="https://ca.slack-edge.com/T0BFXMWMV-U0729U8H47K-dcf39ac815c4-512"
                    alt="Foto"
                    className="rounded-circle custom-img"
                />
                <h2 className="custom-title">Iván Fuentes Mahíllo</h2>
                <p className="custom-text">
                    Aprendiz de todo y maestro de nada. Espero que os guste el proyecto!
                    Millones de gracias a todos y en especial a mis compañeros de grupo
                    por su dedicación y por las innumerables horas que han empleado
                    para que esto salga adelante.
                </p>
            </div>
            <img
                src="https://media.revistaad.es/photos/6171a738289a522423bdd868/16:9/w_2560%2Cc_limit/Le%25C3%25B1a_%2520Lolo%2520Mestanza_11.JPG"
                alt="Foto"
                className="background-img"
            />
        </div>
    );
};


