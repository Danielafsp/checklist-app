import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

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
