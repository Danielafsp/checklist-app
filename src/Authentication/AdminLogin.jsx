import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("isAdmin", "true");
    navigate("/admin");
  };

  return (
    <div className="auth-container">
      <h1>Admin Login</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button type="submit" className="button-primary">
          Login
        </button>
      </form>

      <p className="auth-back">
        <span onClick={() => navigate("/")}>Go back to Homepage</span>
      </p>
    </div>
  );
}
