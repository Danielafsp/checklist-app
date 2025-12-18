import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/fsweblogo.webp";
import "../styles/Navbar.css";
import BackButton from "./BackButton";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="navbar">
      <BackButton />

      <img src={logo} alt="logo" className="nav-logo" />

      <div className="navbar-right">
        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
