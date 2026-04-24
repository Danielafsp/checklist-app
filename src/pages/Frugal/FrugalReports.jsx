import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/AdminDashboard.css";

export default function FrugalReports() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("submitted");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("frugal_requests")
      .select(
        `
        *,
        creator:created_by ( name ),
        reviewer:updated_by ( name ),
        frugal_files (*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRequests(data);

      const submitted = data.filter(
        (r) => r.status?.toLowerCase().trim() !== "draft",
      );

      if (submitted.length > 0) {
        setSelectedRequest(submitted[0]);
      } else {
        setSelectedRequest(null);
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not found:", userError);
      return;
    }

    const now = new Date();

    const { error } = await supabase
      .from("frugal_requests")
      .update({
        status: newStatus,
        updated_by: user.id,
        updated_at: now,
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      const updated = {
        ...selectedRequest,
        status: newStatus,
        updated_by: user.id,
        updated_at: now,
        reviewer: {
          name: user.user_metadata?.full_name || "You",
        },
      };

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

  const submittedRequests = requests.filter(
    (r) => r.status?.toLowerCase().trim() !== "draft",
  );

  const draftRequests = requests.filter(
    (r) => r.status?.toLowerCase().trim() === "draft",
  );

  const visibleRequests =
    sidebarTab === "submitted" ? submittedRequests : draftRequests;

  return (
    <>
      <div className="reports-sidebar">
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${sidebarTab === "submitted" ? "active" : ""}`}
            onClick={() => setSidebarTab("submitted")}
          >
            Submitted
            {submittedRequests.length > 0 && (
              <span className="sidebar-tab-count">
                {submittedRequests.length}
              </span>
            )}
          </button>
          <button
            className={`sidebar-tab ${sidebarTab === "draft" ? "active" : ""}`}
            onClick={() => setSidebarTab("draft")}
          >
            Drafts
            {draftRequests.length > 0 && (
              <span className="sidebar-tab-count">{draftRequests.length}</span>
            )}
          </button>
        </div>

        <div className="reports-list">
          {visibleRequests.length === 0 && (
            <p className="admin-empty" style={{ padding: "16px" }}>
              No{" "}
              {sidebarTab === "draft" ? "draft requests" : "submitted requests"}{" "}
              yet.
            </p>
          )}
          {visibleRequests.map((request) => (
            <div
              key={request.id}
              className={`report-item ${selectedRequest?.id === request.id ? "active" : ""}`}
              onClick={() => setSelectedRequest(request)}
            >
              <strong>
                {request.creator?.name || `Request ${request.id.slice(0, 6)}`}
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

            <p className="text-sm text-gray-500">
              {selectedRequest.reviewer?.name
                ? `Reviewed by ${selectedRequest.reviewer.name}`
                : "Not reviewed yet"}
            </p>

            <div className="admin-row">
              <strong>Client:</strong>
              <span>{selectedRequest.creator?.name || "—"}</span>
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
                      className="admin-button"
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
