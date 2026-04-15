import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://app.fortsands.com/client-reset-password",
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Password reset email sent! Check your inbox.");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <h1>Forgot Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="button-primary">
          Send Reset Email
        </button>
      </form>
      <p className="auth-back">
        <span onClick={() => navigate("/login")}>Back to Login</span>
      </p>
    </div>
  );
}
