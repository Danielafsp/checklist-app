import { useState } from "react";
import "../../styles/Nano.css";

export default function Nano() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roofage: "",
    roofType: "",
    propertyType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Roof Armour form submitted:", formData);
  };

  return (
    <div className="client-request">
      <img className="title" src="/src/assets/nano.png" alt="ROOF ARMOUR" />
      <p className="title-label">Complimentary Service</p>
      <p className="subtitle">
        Not every roof needs a full replacement. Roof Armour is a cost-effective
        solution designed to extend the life of your existing roof, improve its
        appearance, and protect your home for years to come. If you’re unsure
        whether Roof Armour is right for your roof, get in touch with our team.
        We’ll assess your situation, answer your questions, and help you choose
        the best option — with no obligation.
      </p>
      <br />
      <h4 className="nano-heading">Contact Us Before You Replace Your Roof</h4>

      <form className="nano-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select
          name="roofAge"
          value={formData.roofAge}
          onChange={handleChange}
          required
        >
          <option value="">Roof Age *</option>
          <option value="0-7">0 - 7 Years</option>
          <option value="7+">7+ Years</option>
        </select>

        <select
          name="roofType"
          value={formData.roofType}
          onChange={handleChange}
          required
        >
          <option value="">Roof Type *</option>
          <option value="pitched">Pitched</option>
          <option value="flat">Flat</option>
          <option value="pitched&flat">Pitched & Flat</option>
        </select>

        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          required
        >
          <option value="">Type of Property *</option>
          <option value="Detached">Detached</option>
          <option value="Duplex">Duplex</option>
          <option value="Condominium">Condominium</option>
          <option value="Comercial/industrial">Comercial/Industrial</option>
        </select>

        <button type="submit" className="nano-submit">
          Request a Roof Assessment
        </button>

        <p className="nano-trust">
          No obligation. No pressure. Just honest advice.
        </p>
      </form>
    </div>
  );
}
