import { Navigate } from "react-router-dom";

export default function ClientDashboard() {
  return <h1>Client Dashboard - Here the client will fill the checklist</h1>;
}

<button onClick={() => Navigate("/prompt")}>PROMPT</button>
<button onClick={() => Navigate("/subdew")}>SUBDEW</button>
<button onClick={() => Navigate("/frugal")}>FRUGAL</button>