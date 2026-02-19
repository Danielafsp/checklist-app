import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import "../../styles/AdminDashboard.css";

export default function NanoRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString() : "—";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("nano_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedRequest) return;

    const { error } = await supabase
      .from("nano_requests")
      .update({
        status: newStatus,
        updated_at: new Date(),
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      const updated = { ...selectedRequest, status: newStatus };
      setSelectedRequest(updated);
      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;

    const { error } = await supabase
      .from("nano_requests")
      .update({
        notes: notesDraft,
        updated_at: new Date(),
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      const updated = { ...selectedRequest, notes: notesDraft };
      setSelectedRequest(updated);
      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );

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
    <section className="admin-section roof">
      <h2>Roof Armour Requests</h2>
      <p>Overview of Roof Armour contact requests</p>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
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
                <strong>Roof age:</strong> {selectedRequest.roof_age}
              </p>
              <p>
                <strong>Roof type:</strong> {selectedRequest.roof_type}
              </p>
              <p>
                <strong>Property type:</strong> {selectedRequest.property_type}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </p>

              <p>
                <strong>Notes:</strong>
              </p>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={4}
                style={{ width: "100%", marginTop: "5px" }}
              />

              <button onClick={handleSaveNotes} style={{ marginTop: "8px" }}>
                Save Notes
              </button>

              <button onClick={handleDownloadPDF} style={{ marginTop: "10px" }}>
                Download as PDF
              </button>

              {saved && (
                <p style={{ color: "green", marginTop: "5px" }}>✓ Saved</p>
              )}

              <p>
                <strong>Last updated:</strong> {""}
                {formatDate(selectedRequest.updated_at)}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
