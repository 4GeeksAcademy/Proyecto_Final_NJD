//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

//include your index.scss file into the bundle
import "../styles/index.css";
import "../styles/aboutUs.css";

//import your own components
import Layout from "./layout";

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
