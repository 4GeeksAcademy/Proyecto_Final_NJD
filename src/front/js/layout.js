import React, { useState } from "react";
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
import { RestaurantDetail } from "./pages/restaurantDetail"; 
import PrivateView from "./pages/privateView"; 


const Layout = () => {
    const [user, setUser] = useState({ name: "Daria" }); // Simulación de un usuario logueado
    const [favoritos, setFavoritos] = useState([]); // Simulación de favoritos del usuario

    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div style={{background:'linear-gradient(to left, #2c2c2c, #6a6a6a)'}}>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    
                    <Navbar user={user} favoritosCount={favoritos.length} />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Home />} path="/home" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<RestaurantSearch />} path="/restaurantes/:tipo" />
                        <Route element={<RestaurantDetail />} path="/restaurant/detail/:id" />
                        {/* Vista privada */}
                        <Route element={<PrivateView user={user} setFavoritos={setFavoritos} favoritos={favoritos} />} path="/private" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
