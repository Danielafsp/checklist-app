import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import logo from "../assets/fsweblogo.webp";
import "../styles/Navbar.css";
import BackButton from "./BackButton";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const isHome = location.pathname === "/";
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const goToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(false);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const firstName = profile?.name?.split(" ")[0] || "";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">{!isHome && <BackButton />}</div>

        <div className="navbar-center">
          {!isHome && <img src={logo} alt="logo" className="nav-logo" />}
        </div>

        <div className="navbar-right">
          {!isAuthenticated ? (
            <button className="nav-auth-button" onClick={handleLogin}>
              Login
            </button>
          ) : (
            <div className="user-menu">
              <button
                className="nav-auth-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                Hello, {firstName} {profile?.role === "client" && "▾"}
              </button>

              {menuOpen && (
                <div className="dropdown">
                  {profile?.role === "client" && (
                    <button onClick={goToProfile}>Profile</button>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
