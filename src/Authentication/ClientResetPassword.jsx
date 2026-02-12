import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../styles/Auth.css";

export default function ClientResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset email sent!");
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
