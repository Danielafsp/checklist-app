import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/fsweblogo.webp";
import "../styles/Navbar.css";
import BackButton from "./BackButton";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHome = location.pathname === "/";
  const isAuthenticated = !!user;

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
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
