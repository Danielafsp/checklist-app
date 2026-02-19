import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
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
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("roof_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setRequests(data);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!selectedRequest) return;

    const { error } = await supabase
      .from("roof_requests")
      .update({
        status: newStatus,
        updated_at: new Date(),
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;

    const { error } = await supabase
      .from("roof_requests")
      .update({
        notes: notesDraft,
        updated_at: new Date(),
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      setSelectedRequest({ ...selectedRequest, notes: notesDraft });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedRequest) return;

    const doc = new jsPDF();

    doc.text("Roof Armour Request", 20, 20);
    doc.text(`Name: ${selectedRequest.name}`, 20, 30);
    doc.text(`Email: ${selectedRequest.email}`, 20, 40);
    doc.text(`Phone: ${selectedRequest.phone}`, 20, 50);
    doc.text(`Roof Age: ${selectedRequest.roof_age}`, 20, 60);
    doc.text(`Roof Type: ${selectedRequest.roof_type}`, 20, 70);
    doc.text(`Property Type: ${selectedRequest.property_type}`, 20, 80);
    doc.text(`Status: ${selectedRequest.status}`, 20, 90);
    doc.text(`Notes: ${selectedRequest.notes || "-"}`, 20, 100);

    doc.save(`${selectedRequest.name}-request.pdf`);
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
              <div className="reports-grid">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="report-card"
                    onClick={() => {
                      setSelectedRequest(req);
                      setNotesDraft(req.notes || "");
                    }}
                  >
                    <h4>{req.name}</h4>
                    <p>{req.email}</p>
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>
                    <p>
                      <strong>Submitted:</strong> {formatDate(req.created_at)}
                    </p>
                  </div>
                ))}
              </div>

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

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    style={{ marginTop: "10px" }}
                  >
                    Download as PDF
                  </button>

                  {saved && (
                    <p style={{ color: "green", marginTop: "5px" }}>✓ Saved</p>
                  )}

                  <p>
                    <strong>Created:</strong>{" "}
                    {formatDate(selectedRequest.created_at)}
                  </p>

                  <p>
                    <strong>Last updated:</strong>{" "}
                    {formatDate(selectedRequest.updated_at)}
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
