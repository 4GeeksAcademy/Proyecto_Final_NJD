import React, { useEffect } from "react"; // Asegúrate de importar React
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Esto hace scroll a la parte superior cuando cambia la ruta
  }, [location]);

  return <>{children}</>; // Retorna los componentes hijos envueltos
};

export default ScrollToTop;
