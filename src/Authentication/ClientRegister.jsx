import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function ClientRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    propertyName: "",
    address: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.propertyName ||
      !formData.address ||
      !formData.email
    ) {
      alert("Please fill in all fields");
      return;
    }

    alert("Registration successful! You can now log in.");
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

        <button type="submit" className="button-primary">
          Register
        </button>
      </form>

      <p className="auth-switch">
        Already registered?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
}
