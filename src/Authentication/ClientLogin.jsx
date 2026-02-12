import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Auth.css";

export default function ClientLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      alert("Error fetching profile");
      return;
    }

    if (profile.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
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

      <p className="auth-switch">
        Are you an admin?{" "}
        <span onClick={() => navigate("/admin-login")}>Admin login</span>
      </p>

      <p className="auth-back">
        <span onClick={() => navigate("/")}> Go Back to Homepage</span>
      </p>
    </div>
  );
}
