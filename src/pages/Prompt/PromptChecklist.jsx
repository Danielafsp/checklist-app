import { Link } from "react-router-dom";
import "../../styles/Checklist.css";

const areas = [
  { id: 1, name: "RAINWATER MANAGEMENT SYSTEM" },
  { id: 2, name: "ROOF" },
  { id: 3, name: "EXTERIOR WALLS" },
  { id: 4, name: "FOUNDATION" },
  { id: 5, name: "WINDOWS & DOORS" },
  { id: 6, name: "BALCONIES & DECKS" },
  { id: 7, name: "FENCES" },
  { id: 8, name: "LANDSCAPING & DRAINAGE" },
  { id: 9, name: "SIDEWALKS & PARKING LOTS" },
  { id: 10, name: "PARKADES" },
  { id: 11, name: "COMMON AREAS" },
];

export default function PromptChecklist() {
  return (
    <div className="container">
      <h1 className="title">PROMPT</h1>
      <p className="subtitle">
        Everyone on a condo board should feel empowered to help protect their
        community and the equity in their building.
      </p>

      <div className="list">
        {areas.map((area) => (
          <Link key={area.id} to={`/prompt/area/${area.id}`} className="card">
            <span className="card-name">{area.name}</span>
            <span className="card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
