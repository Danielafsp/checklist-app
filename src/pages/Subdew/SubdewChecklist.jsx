import { Link } from "react-router-dom";
import "../../styles/Checklist.css";
import subdewLogo from "../../assets/subdew.png";

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

export default function SubdewChecklist() {
  return (
    <div className="container">
      <figure className="area-logo">
        <img className="logo" src={subdewLogo} alt="SUBDEW" />
        <figcaption className="logo-label">Complimentary Service</figcaption>
      </figure>
      <p className="subtitle">
        Welcome to Subdew, your guide to spot 11 winter building deficiencies
        that can cause costly repairs.
        <br />
        <br />
        To use this tool simply walk around your development and complete the
        intuitive questionnaire, take pictures that show defeciencies, damage or
        areas you feel need to be included in the report.
        <br />
        <br />
        Once complete click Submit and a Fort Sands Advisor will review your
        report.
      </p>

      <div className="list">
        {areas.map((area) => (
          <Link key={area.id} to={`/subdew/area/${area.id}`} className="card">
            <span className="card-name">{area.name}</span>
            <span className="card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
