import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "@/component/ScrollToTop";
import "../node_modules/react-image-gallery/styles/css/image-gallery.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
