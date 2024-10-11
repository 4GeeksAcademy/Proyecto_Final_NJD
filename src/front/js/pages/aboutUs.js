import React, { useEffect } from 'react';
import '/workspaces/Proyecto_Final_NJD/src/front/styles/aboutUs.css'; 
// import Ivan from "../../img/ivan.jpg";

export const About = () => {
        useEffect(() => {
            // Desplazar la ventana hacia el tope superior al cargar el componente
            window.scrollTo(0, 0);
        }, []);

    return ( 
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            {/* Contenedor 1 */}
            <div className="custom-container position-relative text-center">
                <img 
                    src="https://ca.slack-edge.com/T0BFXMWMV-U06KNHAQYQP-96473a851c5e-512" 
                    alt="Foto" 
                    className="rounded-circle custom-img" 
                />
                <h2 className="custom-title">Daria Dacha</h2>
                <p className="custom-text">Este es el texto del contenedor 1</p>
                
            </div>

            {/* Contenedor 2 */}
            <div className="custom-container position-relative text-center">
                <img 
                    src="https://ebootcamp.net/wp-content/uploads/2021/11/4Geeks-Academy.jpeg" 
                    alt="Foto" 
                    className="rounded-circle custom-img" 
                />
                <h2 className="custom-title">Nelson Valero</h2>
                <p className="custom-text">Este es el texto del contenedor 2</p>
            </div>

            {/* Contenedor 3 */}
            <div className="custom-container position-relative text-center">
                <img 
                    src="https://ca.slack-edge.com/T0BFXMWMV-U06UJA41DMW-eeb675e51ad6-192" 
                    alt="Foto" 
                    className="rounded-circle custom-img" 
                />
                <h2 className="custom-title">Juan M. Pintos</h2>
                <p className="custom-text">Este es el texto del contenedor 3</p>
            </div>

            {/* Contenedor 4 */}
            <div className="custom-container position-relative text-center">
                <img 
                    src="https://ca.slack-edge.com/T0BFXMWMV-U0729U8H47K-dcf39ac815c4-512"
                    // src={Ivan} 
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

