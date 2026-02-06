import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function ClientResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      alert("Please fill in all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      alert("No account found with this email");
      return;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated successfully!");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>

      <form className="auth-form" onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="button-primary">
          Reset Password
        </button>
      </form>

      <p className="auth-back">
        <span onClick={() => navigate("/login")}>Back to Login</span>
      </p>
    </div>
  );
}
