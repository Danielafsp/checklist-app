export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <p>Please choose how you want to log in:</p>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => (window.location.href = "/client-login")}>
          Client Login
        </button>

        <button onClick={() => (window.location.href = "/admin-login")}>
          Admin Login
        </button>
      </div>
    </div>
  );
}
