import { useState, useEffect } from "react";
import "../../styles/Nano.css";
import nanoLogo from "../../assets/nano.png";

const initialDraft = {
  tool: "roof-armour",
  name: "",
  email: "",
  phone: "",
  roofAge: "",
  roofType: "",
  propertyType: "",
  createdBy: "client",
  status: "new",
  notes: "",
  updatedAt: Date.now(),
};

export default function Nano() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [draft, setDraft] = useState(initialDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("draft:roof-armour");
    if (saved) {
      setDraft(JSON.parse(saved));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("draft:roof-armour", JSON.stringify(draft));
  }, [draft, hydrated]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login or register to submit your request.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("nano_requests")) || [];

    const newRequest = {
      id: crypto.randomUUID(), // ⭐ NEW
      ...draft,
      status: "new",
      notes: "",
      createdAt: Date.now(), // ⭐ timestamp
      updatedAt: Date.now(), // ⭐ timestamp
    };

    existing.push(newRequest);

    localStorage.setItem("nano_requests", JSON.stringify(existing));

    localStorage.removeItem("draft:roof-armour");
    setDraft(initialDraft);

    setSubmitted(true);
  };

  return (
    <div className="client-request">
      <figure className="nano-logo">
        <img className="logo" src={nanoLogo} alt="ROOF ARMOUR" />
        <figcaption className="logo-label">Complimentary Service</figcaption>
      </figure>

      {!submitted && (
        <>
          <p className="subtitle">
            Not every roof needs a full replacement. Roof Armour is a
            cost-effective solution designed to extend the life of your existing
            roof, improve its appearance, and protect your home for years to
            come. If you’re unsure whether Roof Armour is right for your roof,
            get in touch with our team. We’ll assess your situation, answer your
            questions, and help you choose the best option — with no obligation.
          </p>
          <br />
          <h4 className="nano-heading">
            Contact Us Before You Replace Your Roof
          </h4>
        </>
      )}

      {!submitted ? (
        <form className="nano-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={draft.name}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                name: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            disabled={!isLoggedIn}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={draft.email}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                email: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            disabled={!isLoggedIn}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={draft.phone}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                phone: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            disabled={!isLoggedIn}
            required
          />

          <select
            name="roofAge"
            value={draft.roofAge}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                roofAge: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            disabled={!isLoggedIn}
            required
          >
            <option value="">Roof Age *</option>
            <option value="0-7">0 - 7 Years</option>
            <option value="7+">7+ Years</option>
          </select>

          <select
            name="roofType"
            value={draft.roofType}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                roofType: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            disabled={!isLoggedIn}
            required
          >
            <option value="">Roof Type *</option>
            <option value="pitched">Pitched</option>
            <option value="flat">Flat</option>
            <option value="pitched&flat">Pitched & Flat</option>
          </select>

          <select
            name="propertyType"
            value={draft.propertyType}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                propertyType: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            disabled={!isLoggedIn}
            required
          >
            <option value="">Type of Property *</option>
            <option value="Detached">Detached</option>
            <option value="Duplex">Duplex</option>
            <option value="Condominium">Condominium</option>
            <option value="Comercial/industrial">Comercial / Industrial</option>
          </select>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="nano-submit"
            disabled={!isLoggedIn || loading}
          >
            {loading ? "Sending..." : "Request a Roof Assessment"}
          </button>

          <p className="nano-trust">
            No obligation. No pressure. Just honest advice.
          </p>
        </form>
      ) : (
        <div className="confirmation-message fade-in">
          <p>
            Request received! Our <strong> Roof Armour Specialist</strong> will
            contact you soon.
          </p>
        </div>
      )}
      {!isLoggedIn && (
        <p className="login-hint">
          Please login or register to request a Roof Armour assessment.
        </p>
      )}
    </div>
  );
}
