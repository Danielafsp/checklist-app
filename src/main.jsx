import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ClientLogin from "./pages/ClientLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
    </Routes>
  </BrowserRouter>
);
