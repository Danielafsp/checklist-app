import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Client Dashboard</h1>
      <p>Select a section</p>
      <div>
        <button onClick={() => navigate("/Prompt")}>PROMPT</button>
        <button onClick={() => navigate("/Subdew")}>SUBDEW</button>
        <button onClick={() => navigate("/Frugal")}>FRUGAL</button>
      </div>
    </div>
  );
}
