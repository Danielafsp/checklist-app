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
              <strong>Request #{request.id}</strong>

              <div>{new Date(request.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-viewer">
        {!selectedRequest && <p>Select a request to view details.</p>}

        {selectedRequest && (
          <div className="admin-section frugal">
            <h2>Frugal Requests</h2>

            <div className="admin-row">
              <strong>Status:</strong>
              <span>{selectedRequest.status}</span>
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
                <p>No files uploaded.</p>
              )}

              <ul>
                {selectedRequest.frugal_files.map((file) => (
                  <li key={file.id}>
                    {file.file_name}

                    <button
                      onClick={() => handleDownload(file.file_url)}
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
