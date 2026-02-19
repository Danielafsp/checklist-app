import { useState } from "react";
import NanoRequests from "./Nano/NanoRequests";

import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("nano");

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button onClick={() => setActiveTab("prompt")}>PROMPT</button>
        <button onClick={() => setActiveTab("subdew")}>SUBDEW</button>
        <button onClick={() => setActiveTab("frugal")}>FRUGAL</button>
        <button onClick={() => setActiveTab("roof")}>Roof Armour</button>
      </div>

      {activeTab === "prompt" && (
        <section className="admin-section prompt">
          <h2>PROMPT Inspections</h2>
          <p>Overview of submitted Prompt reports</p>

          <div className="admin-state admin-empty">
            No Prompt inspections submitted yet.
          </div>
        </section>
      )}

      {activeTab === "subdew" && (
        <section className="admin-section subdew">
          <h2>SUBDEW Inspections</h2>
          <p>Overview of submitted Subdew reports</p>

          <div className="admin-state admin-empty">
            No Subdew inspections available.
          </div>
        </section>
      )}

      {activeTab === "frugal" && (
        <section className="admin-section frugal">
          <h2>FRUGAL Uploads</h2>
          <p>Overview of Frugal documentation</p>

          <div className="admin-state admin-empty">
            No documents uploaded yet.
          </div>
        </section>
      )}

      {activeTab === "roof" && <NanoRequests />}

      <div className="admin-empty">No reports yet.</div>
    </div>
  );
}
