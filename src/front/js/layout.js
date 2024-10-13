import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { RestaurantSearch } from "./pages/restaurantSearch";
import { RegistroCompletoRestaurante } from "./pages/registro_restaurante";
import { PrivateView } from "./pages/privateView";
import { RestaurantDetail } from "./pages/restaurantDetail";
import { FAQ } from "./pages/faq";
import { About } from "./pages/aboutUs";
import { AreaPrivadaUsuario } from "./pages/vistaPrivadaUsuario";
import { VistaPrivadaRestaurante } from "./pages/vistaPrivadaRestaurante";
import VistaCloudinary from "./pages/vistaCloudinary";
import  RecoverPassword  from "./component/recoverPassword";
import  ResetPassword  from "./component/resetPassword"


const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div style={{ background: 'linear-gradient(to left, #2c2c2c, #6a6a6a)' }}>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Home />} path="/home" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<RestaurantSearch />} path="/restaurantes/:categoria_id" />

                        {/* Nueva ruta para el registro de restaurantes */}
                        <Route element={<RegistroCompletoRestaurante />} path="/registro_restaurante" />

                        {/* Vista privada para el usuario */}
                        <Route element={<AreaPrivadaUsuario />} path="/private/:user_id" /> {/* Página para editar perfil del usuario con el user_id */}

                        {/* Página de bienvenida o sección general privada */}
                        <Route element={<PrivateView />} path="/private" /> {/* Página general de área privada */}

                        <Route element={<RestaurantDetail />} path="/restaurant/detail/:id" />
                        {/* Vista privada */}
                        <Route element={<PrivateView />} path="/private" />
                        {/* Vista privada faq */}
                        <Route element={<FAQ />} path="/faq" />

                        {/* Vista About us */}
                        <Route element={<About />} path="/about" />

                        {/* Vista privada restaurante */}
                        <Route element={<VistaPrivadaRestaurante />} path="/vistaPrivadaRestaurante/:restaurante_id" />

                        {/* Nueva ruta para VistaCloudinary */}
                        <Route element={<VistaCloudinary />} path="/vistaCloudinary/:restaurante_id" />

                        {/* Ruta para la solicitud de recuperación de contraseña */}
                        <Route  element={<RecoverPassword /> }path="/recover/password" />

                        {/* Ruta para el restablecimiento de contraseña con token */}
                        <Route element={<ResetPassword />}  path="/reset/password/:token"/>


                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
