import { useState } from "react";
import PromptReports from "./Prompt/PromptReports";
import SubdewReports from "./Subdew/SubdewReports";
import FrugalReports from "./Frugal/FrugalReports";
import NanoRequests from "./Nano/NanoRequests";

import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("prompt");

  const renderActiveSection = () => {
    switch (activeTab) {
      case "prompt":
        return <PromptReports />;
      case "subdew":
        return <SubdewReports />;
      case "frugal":
        return <FrugalReports />;
      case "roof":
        return <NanoRequests />;
    }
  };

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

      <div className="admin-body">
        <div className="admin-content">{renderActiveSection()}</div>
      </div>
    </div>
  );
}
