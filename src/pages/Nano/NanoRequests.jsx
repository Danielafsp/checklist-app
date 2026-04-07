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
      .from("roof_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setRequests(data);

      if (data.length > 0) {
        setSelectedRequest(data[0]);
        setNotesDraft(data[0].notes || "");
      }
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (
      !selectedRequest ||
      selectedRequest.status?.toLowerCase().trim() === "draft"
    )
      return;

    const { error } = await supabase
      .from("roof_requests")
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
      .from("roof_requests")
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

  if (loading) {
    return <p className="admin-loading">Loading...</p>;
  }

  if (requests.length === 0) {
    return <p className="admin-empty">No Roof Armour requests yet.</p>;
  }

  const isDraft = selectedRequest?.status?.toLowerCase().trim() === "draft";

  return (
    <>
      <div className="reports-sidebar">
        <div className="reports-list">
          {requests.map((request) => (
            <div
              key={request.id}
              className={`report-item ${selectedRequest?.id === request.id ? "active" : ""}`}
              onClick={() => {
                setSelectedRequest(request);
                setNotesDraft(request.notes || "");
              }}
            >
              <strong>{request.name}</strong>

              <div>{request.email}</div>

              <div>{new Date(request.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-viewer">
        {!selectedRequest && <p>Select a request.</p>}

        {selectedRequest && (
          <div className="admin-section roof">
            <h2>Roof Armour Request</h2>

            {isDraft && (
              <p className="draft-warning">
                This request is a draft and cannot be modified or exported.
              </p>
            )}

            <div className="admin-row">
              <strong>Name</strong>
              <span>{selectedRequest.name}</span>
            </div>

            <div className="admin-row">
              <strong>Email</strong>
              <span>{selectedRequest.email}</span>
            </div>

            <div className="admin-row">
              <strong>Phone</strong>
              <span>{selectedRequest.phone}</span>
            </div>

            <div className="admin-row">
              <strong>Roof Age</strong>
              <span>{selectedRequest.roof_age}</span>
            </div>

            <div className="admin-row">
              <strong>Roof Type</strong>
              <span>{selectedRequest.roof_type}</span>
            </div>

            <div className="admin-row">
              <strong>Property Type</strong>
              <span>{selectedRequest.property_type}</span>
            </div>

            <div className="admin-row">
              <strong>Status</strong>
              <select
                value={selectedRequest.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isDraft}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="inspection-area">
              <div className="area-title">Internal Notes</div>
              <textarea
                className="admin-notes"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={4}
                disabled={isDraft}
              />

              <button
                className="admin-button"
                onClick={handleSaveNotes}
                disabled={isDraft}
                style={{ marginTop: "8px" }}
              >
                Save Notes
              </button>

              {saved && (
                <p style={{ color: "green", marginTop: "5px" }}>✓ Saved</p>
              )}
            </div>

            <button
              className="admin-button"
              onClick={handleDownloadPDF}
              disabled={isDraft}
              style={{ marginTop: "10px" }}
            >
              Download as PDF
            </button>

            <p style={{ marginTop: "15px" }}>
              <strong>Last updated:</strong> {""}
              {formatDate(selectedRequest.updated_at)}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
