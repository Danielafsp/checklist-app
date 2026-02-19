import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "../../styles/Nano.css";
import nanoLogo from "../../assets/nano.png";

const initialDraft = {
  tool: "roof-armour",
  name: "",
  email: "",
  phone: "",
  roof_age: "",
  roof_type: "",
  property_type: "",
  created_by: "client",
  status: "new",
  notes: "",
  updatedAt: Date.now(),
};

export default function Nano() {
  const { user } = useAuth();

  const [draft, setDraft] = useState(initialDraft);
  const [hydrated, setHydrated] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("roof_requests").insert([
      {
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        roof_age: draft.roof_age,
        roof_type: draft.roof_type,
        property_type: draft.property_type,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    localStorage.removeItem("draft:roof-armour");
    setDraft(initialDraft);
    setSubmitted(true);
    setLoading(false);
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
            placeholder="Full Name *"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            disabled={!user}
            required
          />

          <input
            type="email"
            placeholder="Email Address *"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            disabled={!user}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number *"
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            disabled={!user}
            required
          />

          <select
            value={draft.roof_age}
            onChange={(e) => setDraft({ ...draft, roof_age: e.target.value })}
            disabled={!user}
            required
          >
            <option value="">Roof Age *</option>
            <option value="0-7">0 - 7 Years</option>
            <option value="7+">7+ Years</option>
          </select>

          <select
            value={draft.roof_type}
            onChange={(e) => setDraft({ ...draft, roof_type: e.target.value })}
            disabled={!user}
            required
          >
            <option value="">Roof Type *</option>
            <option value="pitched">Pitched</option>
            <option value="flat">Flat</option>
            <option value="pitched&flat">Pitched & Flat</option>
          </select>

          <select
            value={draft.property_type}
            onChange={(e) =>
              setDraft({ ...draft, property_type: e.target.value })
            }
            disabled={!user}
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
            disabled={!user || loading}
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
      {!user && (
        <p className="login-hint">
          Please login or register to request a Roof Armour assessment.
        </p>
      )}
    </div>
  );
}
