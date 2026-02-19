import { useState } from "react";
import PromptReports from "./Prompt/PromptReports";
import SubdewReports from "./Subdew/SubdewReports";
import FrugalReports from "./Frugal/FrugalReports";
import NanoRequests from "./Nano/NanoRequests";

import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("prompt");

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={activeTab === "prompt" ? "active" : ""}
          onClick={() => setActiveTab("prompt")}
        >
          PROMPT
        </button>
        <button
          className={activeTab === "subdew" ? "active" : ""}
          onClick={() => setActiveTab("subdew")}
        >
          SUBDEW
        </button>
        <button
          className={activeTab === "frugal" ? "active" : ""}
          onClick={() => setActiveTab("frugal")}
        >
          FRUGAL
        </button>
        <button
          className={activeTab === "roof" ? "active" : ""}
          onClick={() => setActiveTab("roof")}
        >
          Roof Armour
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "prompt" && <PromptReports />}
        {activeTab === "subdew" && <SubdewReports />}
        {activeTab === "frugal" && <FrugalReports />}
        {activeTab === "roof" && <NanoRequests />}
      </div>
    </div>
  );
}
