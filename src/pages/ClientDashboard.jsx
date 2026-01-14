import { useNavigate } from "react-router-dom";
import "../styles/ClientDashboard.css";

import PromptImg from "../assets/Prompt.webp";
import SubdewImg from "../assets/Subdew.webp";
import FrugalImg from "../assets/Frugal.webp";
import NanoImg from "../assets/roofrevive.webp";

export default function ClientDashboard() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Proactive Property Maintenance",
      img: PromptImg,
      route: "/prompt",
    },
    {
      label: "Winter Building Deficiencies",
      img: SubdewImg,
      route: "/subdew",
    },
    {
      label: "Reserve Fund Analysis",
      img: FrugalImg,
      route: "/frugal",
    },
    {
      label: "Revive NOT Replace",
      img: NanoImg,
      route: "/nano",
    },
  ];

  return (
    <div className="client-dashboard-container">
      <h1 className="client-dashboard-title">Condo Board Tools</h1>

      <div className="client-dashboard-grid">
        {items.map((item) => (
          <div
            key={item.route}
            className="client-dashboard-card"
            onClick={() => navigate(item.route)}
          >
            <img
              src={item.img}
              alt={item.label}
              className="client-dashboard-image"
            />
            <p className="client-dashboard-label">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
