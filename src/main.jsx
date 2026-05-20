import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../assets/styles.css";

const savedTheme = window.localStorage.getItem("site-theme");
document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
document.body.classList.add("has-motion");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
