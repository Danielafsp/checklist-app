import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/fsweblogo.webp";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const showBack =
    location.pathname !== "/" &&
    location.pathname !== "/client" &&
    location.pathname !== "/admin";

  return (
    <header className="navbar">
      <div className="nav-left">
        {showBack && (
          <button className="nav-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
      </div>

      <img src={logo} alt="logo" className="nav-logo" />

      <div className="navbar-right"></div>
    </header>
  );
}
