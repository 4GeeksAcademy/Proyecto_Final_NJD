import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
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
import ErrorBoundary from "./component/ErrorBoundary";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL === "") return <BackendURL />;
    console.log("BASENAME:", basename);


    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Navbar />
                <ErrorBoundary>
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route element={<Home />} path="/home" />
                    <Route element={<RestaurantSearch />} path="/restaurantes/:categoria_id" />
                    <Route element={<RegistroCompletoRestaurante />} path="/registro_restaurante" />
                    <Route element={<AreaPrivadaUsuario />} path="/private/:user_id" />
                    <Route element={<PrivateView />} path="/private" />
                    <Route element={<RestaurantDetail />} path="/restaurant/detail/:id" />
                    <Route element={<FAQ />} path="/faq" />
                    <Route element={<About />} path="/about" />
                    <Route element={<VistaPrivadaRestaurante />} path="/vistaPrivadaRestaurante/:restaurante_id" />
                    <Route element={<VistaCloudinary />} path="/vistaCloudinary/:restaurante_id" />
                    <Route element={<h1>Not found!</h1>} path="*" />
                </Routes>
                </ErrorBoundary>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
