import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/fsweblogo.webp";
import "../styles/Navbar.css";
import BackButton from "./BackButton";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isAuthenticated = !!sessionStorage.getItem("user");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">{!isHome && <BackButton />}</div>

        <div className="navbar-center">
          {!isHome && <img src={logo} alt="logo" className="nav-logo" />}
        </div>

        <div className="navbar-right">
          {!isAuthenticated ? (
            <>
              <button className="nav-auth-button" onClick={handleLogin}>
                Login
              </button>
              <button className="nav-auth-button" onClick={handleRegister}>
                Register
              </button>
            </>
          ) : (
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
