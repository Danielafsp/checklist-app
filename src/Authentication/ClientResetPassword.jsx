import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../styles/Auth.css";

export default function ClientResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      navigate("/login");
    }
  };

  if (!isValidSession) {
    return <p>Invalid or expired link. Please request a new password reset.</p>;
  }

  return (
    <div className="auth-container">
      <h1>Set New Password</h1>

      <form className="auth-form" onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="button-primary">
          Confirm New Password
        </button>
      </form>

      <p className="auth-back">
        <span onClick={() => navigate("/login")}>Back to Login</span>
      </p>
    </div>
  );
}
