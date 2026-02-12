import { useNavigate } from "react-router-dom";
import "../styles/ClientDashboard.css";
import logo from "../assets/fsweblogo.webp";
import Navbar from "../components/NavBar";

import PromptImg from "../assets/prompt.png";
import SubdewImg from "../assets/subdew.png";
import FrugalImg from "../assets/frugal.png";
import NanoImg from "../assets/nano.png";

export default function ClientDashboard() {
  const navigate = useNavigate();

  const items = [
    {
      img: PromptImg,
      route: "/prompt",
    },
    {
      img: SubdewImg,
      route: "/subdew",
    },
    {
      img: FrugalImg,
      route: "/frugal",
    },
    {
      img: NanoImg,
      route: "/nano",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="client-dashboard-container">
        <img src={logo} alt="Fortsands Logo" className="home-logo" />

        <h1 className="client-dashboard-title">Condo Board Tools</h1>
        <p className="client-dashboard-subtitle">
          A streamlined toolkit to support condo boards with compliance,
          documentation, and informed decision-making.
        </p>

        <div className="client-dashboard-grid">
          {items.map((item) => (
            <div
              key={item.route}
              className="client-dashboard-card"
              onClick={() => navigate(item.route)}
            >
              <img src={item.img} alt="" className="client-dashboard-image" />
            </div>
          ))}
        </div>
      </div>

      <div className="home-button">
        <button className="home-btn" onClick={() => navigate("/team")}>
          Contact your Fort Sands Team
        </button>
      </div>
    </>
  );
}
