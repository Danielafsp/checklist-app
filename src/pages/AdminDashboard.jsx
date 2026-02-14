import { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("roof");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString() : "—";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nano_requests")) || [];
    setRequests(saved);
  }, []);

  const handleStatusChange = (newStatus) => {
    if (!selectedRequest) return;

    const updatedRequest = {
      ...selectedRequest,
      status: newStatus,
      updatedAt: Date.now(),
    };

    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id ? updatedRequest : req,
    );

    setSelectedRequest(updatedRequest);
    setRequests(updatedRequests);
    localStorage.setItem("nano_requests", JSON.stringify(updatedRequests));
  };

  const handleSaveNotes = () => {
    if (!selectedRequest) return;

    const updatedRequest = {
      ...selectedRequest,
      notes: notesDraft,
      updatedAt: Date.now(),
    };

    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id ? updatedRequest : req,
    );

    setSelectedRequest(updatedRequest);
    setRequests(updatedRequests);
    localStorage.setItem("nano_requests", JSON.stringify(updatedRequests));

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
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

      {activeTab === "roof" && (
        <section className="admin-section roof">
          <h2>Roof Armour Requests</h2>
          <p>Overview of Roof Armour contact requests</p>

          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <>
              <ul>
                {requests.map((req) => (
                  <li
                    key={req.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedRequest(req);
                      setNotesDraft(req.notes || "");
                    }}
                  >
                    <strong>{req.name}</strong> — {req.email} —{" "}
                    <em>{req.status}</em>
                  </li>
                ))}
              </ul>

              {selectedRequest && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Request details</h3>

                  <p>
                    <strong>Name:</strong> {selectedRequest.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedRequest.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedRequest.phone}
                  </p>

                  <p>
                    <strong>Roof age:</strong> {selectedRequest.roofAge}
                  </p>
                  <p>
                    <strong>Roof type:</strong> {selectedRequest.roofType}
                  </p>
                  <p>
                    <strong>Property type:</strong>{" "}
                    {selectedRequest.propertyType}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option key="new" value="new">
                        New
                      </option>
                      <option key="contacted" value="contacted">
                        Contacted
                      </option>
                      <option key="closed" value="closed">
                        Closed
                      </option>
                    </select>
                  </p>
                  <p>
                    <strong>Notes:</strong>
                  </p>

                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add internal notes…"
                    rows={4}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    style={{ marginTop: "8px" }}
                  >
                    Save notes
                  </button>
                  {saved && (
                    <p style={{ color: "green", marginTop: "5px" }}>✓ Saved</p>
                  )}

                  <p>
                    <strong>Created:</strong>{" "}
                    {formatDate(selectedRequest.createdAt)}
                  </p>

                  <p>
                    <strong>Last updated:</strong>{" "}
                    {formatDate(selectedRequest.updatedAt)}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <div className="admin-empty">No reports yet.</div>
    </div>
  );
}
