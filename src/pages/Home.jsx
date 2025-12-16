import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/src/assets/fsweblogo.webp";

export default function Home() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#342E2E",
        color: "#FFFFFF",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="Fortsands Logo"
        style={{ width: "160px", marginBottom: "2rem" }}
      />

      {/* Heading */}
      <h1
        style={{
          fontFamily: "Raleway, sans-serif",
          marginBottom: "0.5rem",
          fontSize: "2rem",
          color: "#FFFFFF",
        }}
      >
        Condo Board Tools
      </h1>

      {/* Subtext */}
      <p style={{ maxWidth: "400px", marginBottom: "2rem", opacity: 0.9 }}>
        A streamlined toolkit to support condo boards with compliance,
        documentation, and informed decision-making.
      </p>

      {/* Login Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "320px",
          marginBottom: "3rem",
        }}
      >
        <button
          onClick={() => navigate("/client")}
          style={{
            backgroundColor: "#D47F35",
            color: "#FFFFFF",
            border: "none",
            padding: "0.9rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Client Login
        </button>

        <button
          onClick={() => navigate("/admin")}
          style={{
            backgroundColor: "#D47F35",
            color: "#FFFFFF",
            border: "none",
            padding: "0.9rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Admin Login
        </button>
      </div>

      {/* Expandable Contact Section */}
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <button
          onClick={() => setContactOpen(!contactOpen)}
          style={{
            width: "100%",
            backgroundColor: "#D47F35",
            color: "#FFFFFF",
            border: "none",
            padding: "0.9rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: contactOpen ? "0.5rem" : "0",
            transition: "all 0.3s ease",
          }}
        >
          {contactOpen ? "Hide Contact Info ▲" : "Contact Fortsands Support ▼"}
        </button>

        {contactOpen && (
          <div
            style={{
              backgroundColor: "#3F3838",
              padding: "1rem",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:4032507999"
                style={{ color: "#D47F35", textDecoration: "none" }}
              >
                (403) 250-7999
              </a>
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@fortsands.com"
                style={{ color: "#D47F35", textDecoration: "none" }}
              >
                info@fortsands.com
              </a>
            </p>

            <p>
              <strong>Address:</strong> 432 28 St NE, Calgary AB, T2A 6T3
            </p>

            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://www.fortsands.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#D47F35", textDecoration: "none" }}
              >
                www.fortsands.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
