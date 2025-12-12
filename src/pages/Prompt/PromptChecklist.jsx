import { Link } from "react-router-dom";

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
    <div>
      <h1>PROMPT</h1>
      <p>
        Everyone on a condo board should feel empowered to help protect their
        community and the equity in their building.
      </p>

      <ul>
        {areas.map((area) => (
          <li key={area.id}>
            <Link to={`/prompt/area/${area.id}`}>{area.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
