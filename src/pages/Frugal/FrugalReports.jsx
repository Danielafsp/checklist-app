import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/AdminDashboard.css";

export default function FrugalReports() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("frugal_requests")
      .select(
        `
        *,
        profiles ( name ),
        frugal_files (*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRequests(data);

      if (data.length > 0) {
        setSelectedRequest(data[0]);
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
      .from("frugal_requests")
      .update({
        status: newStatus,
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      const updated = { ...selectedRequest, status: newStatus };

      setSelectedRequest(updated);

      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    } else {
      console.error("Error updating status:", error);
    }
  };

  const handleDownload = async (filePath) => {
    const { data, error } = await supabase.storage
      .from("frugal-files")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error(error);
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  if (loading) {
    return <p className="admin-loading">Loading...</p>;
  }

  if (requests.length === 0) {
    return <p className="admin-empty">No Frugal requests yet.</p>;
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
              onClick={() => setSelectedRequest(request)}
            >
              <strong>
                {request.profiles?.name || `Request ${request.id.slice(0, 6)}`}
              </strong>

              <div
                className={`status status-${request.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "_")}`}
              >
                {request.status}
              </div>

              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-viewer">
        {!selectedRequest && <p>Select a request to view details.</p>}

        {selectedRequest && (
          <div className="admin-section frugal">
            <h2>Frugal Requests</h2>

            {isDraft && (
              <p className="draft-warning">
                This request is a draft and cannot be modified or downloaded.
              </p>
            )}

            <div className="admin-row">
              <strong>Status</strong>
              <select
                value={selectedRequest.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isDraft}
              >
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="admin-row">
              <strong>Visit Date:</strong>
              <span>{selectedRequest.visit_date || "Not scheduled"}</span>
            </div>

            <div className="admin-row">
              <strong>Notes:</strong>
              <span>{selectedRequest.notes || "No notes provided"}</span>
            </div>

            <div className="inspection-area">
              <div className="area-title">Uploaded Files</div>

              {selectedRequest.frugal_files.length === 0 && (
                <p className="admin-empty">No files uploaded.</p>
              )}

              <ul>
                {selectedRequest.frugal_files.map((file) => (
                  <li key={file.id}>
                    {file.file_name}

                    <button
                      onClick={() => handleDownload(file.file_url)}
                      disabled={isDraft}
                      style={{ marginLeft: "10px" }}
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
