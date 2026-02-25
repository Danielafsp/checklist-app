import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ClientResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");
    navigate("/login");
  };

  return (
    <div>
      <h1>Set New Password</h1>
      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}
