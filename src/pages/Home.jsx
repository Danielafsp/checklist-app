import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <p>Please choose how you want to log in:</p>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/client")}>Client Login</button>

        <button onClick={() => navigate("/admin")}>Admin Login</button>
      </div>
    </div>
  );
}
