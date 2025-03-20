import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        console.log("ScrollToTop triggered for path:", location.pathname);

        // Método más robusto para scroll
        try {
            // Método estándar
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });

            // Alternativa para navegadores más antiguos
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            // Manejo de clases y estilos
            document.documentElement.classList.remove('is-loading');
            document.body.classList.remove('no-scroll');

            document.documentElement.style.overflowY = "auto";
            document.body.style.overflowY = "auto";
        } catch (error) {
            console.error("Error en ScrollToTop:", error);
        }
    }, [location.pathname]);

    return <>{children}</>;
};

export default ScrollToTop;