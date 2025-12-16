import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "/src/assets/fsweblogo.webp";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img
        src={logo}
        alt="Fortsands Logo"
        style={{ width: "160px", marginBottom: "2rem" }}
      />

      <h1 className="home-title">Condo Board Tools</h1>
      <p className="home-subtext">
        A streamlined toolkit to support condo boards with compliance,
        documentation, and informed decision-making.
      </p>

      <div className="home-buttons">
        <button className="home-bts" onClick={() => navigate("/client")}>
          Client Login
        </button>

        <button className="home-bts" onClick={() => navigate("/admin")}>
          Admin Login
        </button>
      </div>
    </div>
  );
}
