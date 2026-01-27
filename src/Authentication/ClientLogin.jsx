import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function ClientLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => u.email === email);

    if (!user) {
      alert("No account found with this email");
      return;
    }

    if (user.password !== password) {
      alert("Incorrect password");
      return;
    }

    login(user.email, "client");
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h1>Client Login</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" className="button-primary">
          Login
        </button>
      </form>

      <p className="auth-switch">
        <span onClick={() => navigate("/client-reset-password")}>
          Forgot Password?
        </span>
      </p>

      <p className="auth-switch">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")}>Register</span>
      </p>
      <br />
      <p className="auth-back">
        <span onClick={() => navigate("/")}> Go Back to Homepage</span>
      </p>
    </div>
  );
}
