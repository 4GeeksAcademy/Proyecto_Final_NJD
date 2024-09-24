import React, { useRef } from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  const scrollContainerRef = useRef(null);

  // Función para desplazarse a la izquierda
  const scrollLeft = () => {
    if (scrollContainerRef.current.scrollLeft === 0) {
      // Si llegamos al principio, volvemos al final
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    } else {
      // Desplazarse a la izquierda normalmente
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Función para desplazarse a la derecha
  const scrollRight = () => {
    const maxScrollLeft =
      scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

    if (scrollContainerRef.current.scrollLeft >= maxScrollLeft) {
      // Si llegamos al final, volvemos al principio
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      // Desplazarse a la derecha normalmente
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="header-container">
        <div className="image-header">
          <div className="text-left">
            <h1>¡Bienvenido a Hoy No Cocino!</h1>
            <p>
              Encuentra los mejores restaurantes y realiza tus reservas de forma rápida y
              sencilla.
            </p>
          </div>
        </div>
      </div>

      <div className="cuisine-scroll">
        <h2>Explora Tipos de Cocina</h2>
        <div className="scroll-wrapper">
          <button className="scroll-btn left" onClick={scrollLeft}>
            &lt;
          </button>

          <div className="scroll-container" ref={scrollContainerRef}>
            <div className="cuisine-card">
              <Link to="/restaurantes/italiana">
                <img
                  src="https://media.istockphoto.com/id/1356961232/es/foto/espaguetis-con-alb%C3%B3ndigas-y-salsa-de-tomate-sobre-fondo-de-piedra.jpg?s=612x612&w=0&k=20&c=PCHiEkDs76zbU1zqbccuQVSTDuOzzhShryHGqwhcMxk="
                  alt="Comida Italiana"
                  className="cuisine-image"
                />
                <span>Italiana</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/argentina">
                <img
                  src="https://t4.ftcdn.net/jpg/06/47/71/83/360_F_647718371_xhN1faW9v3b0juc7RSwn7QkWBprCXvCK.jpg"
                  alt="Comida Argentina"
                  className="cuisine-image"
                />
                <span>Argentina</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/mexicana">
                <img
                  src="https://png.pngtree.com/background/20230528/original/pngtree-restaurant-picture-image_2779734.jpg"
                  alt="Comida Mexicana"
                  className="cuisine-image"
                />
                <span>Mexicana</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/mediterranea">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsk0mG6T8jSeDXQNQlcVF0hqtGHVrmpVRqc_yFBUBSwgfZPsIp-oTvg9-e5Au468PgeZc&usqp=CAU"
                  alt="Comida Mediterránea"
                  className="cuisine-image"
                />
                <span>Mediterránea</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/china">
                <img
                  src="https://st2.depositphotos.com/3300441/11588/i/380/depositphotos_115883670-stock-photo-chinese-food-blank-background.jpg"
                  alt="Comida China"
                  className="cuisine-image"
                />
                <span>China</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/japonesa">
                <img
                  src="https://static3.depositphotos.com/1003713/173/i/380/depositphotos_1737431-stock-photo-japanese-food.jpg"
                  alt="Comida Japonesa"
                  className="cuisine-image"
                />
                <span>Japonesa</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/india">
                <img
                  src="https://st4.depositphotos.com/1000589/30118/i/380/depositphotos_301181898-stock-photo-assorted-indian-food-on-black.jpg"
                  alt="Comida India"
                  className="cuisine-image"
                />
                <span>India</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/americana">
                <img
                  src="https://st4.depositphotos.com/32042688/37964/i/450/depositphotos_379648604-stock-photo-burger-board-cheeseburger-fast-food.jpg"
                  alt="Comida Americana"
                  className="cuisine-image"
                />
                <span>Americana</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/tailandesa">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7ArYmmhHaJGjhvc6dtVRG2ry4SBOHa1_aA&s"
                  alt="Comida Tailandesa"
                  className="cuisine-image"
                />
                <span>Tailandesa</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/arabe">
                <img
                  src="https://images.ecestaticos.com/jrya8NsDEIukDE4811K9viHOSJw=/4x155:1457x1245/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F2ef%2Fd23%2F6b1%2F2efd236b1a7c3c8fac9d379c04e7f659.jpg"
                  alt="Comida Arabe"
                  className="cuisine-image"
                />
                <span>Arabe</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/internacional">
                <img
                  src="https://i0.wp.com/iamapassenger.com/wp-content/uploads/2021/02/paula-vermeulen-URjZkhqsuBk-unsplash.jpg?fit=3667%2C2750&ssl=1"
                  alt="Comida Internacional"
                  className="cuisine-image"
                />
                <span>Internacional</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/latinoamerica">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPJrK5FhZSciwBzr33zCT6IlttQe8D6XpoVB7sge1tfNIxRNLTPiX7ZP3jPlZfQjR1VN4&usqp=CAU"
                  alt="Comida Latinoamérica"
                  className="cuisine-image"
                />
                <span>Latinoamérica</span>
              </Link>
            </div>

            <div className="cuisine-card">
              <Link to="/restaurantes/saludable">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOZYgltbG_zDWGDxS-V_4ow_VLFZLpynfNTA&s"
                  alt="Comida Saludable"
                  className="cuisine-image"
                />
                <span>Saludable</span>
              </Link>
            </div>
          </div>

          <button className="scroll-btn right" onClick={scrollRight}>
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};
