import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../styles/Auth.css";

export default function ClientRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    propertyName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, propertyName, address, email, password, confirmPassword } =
      formData;

    if (
      !name ||
      !propertyName ||
      !address ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGNUP ERROR:", error);
    console.log("SIGNUP DATA:", data);

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("Something went wrong during registration.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "client",
    });

    if (profileError) {
      alert("Error creating profile: " + profileError.message);
      return;
    }

    alert("Registration successful!");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h1>Client Registration</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          name="propertyName"
          placeholder="Property Name"
          value={formData.propertyName}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" className="button-primary">
          Register
        </button>
      </form>

      <p className="auth-switch">
        Already registered?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
      <br />
      <p className="auth-back">
        <span onClick={() => navigate("/")}> Go Back to Homepage</span>
      </p>
    </div>
  );
}
