import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/AdminDashboard.css";

export default function FrugalReports() {
  const [requests, setRequests] = useState([]);
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

    if (!error) {
      setRequests(data);
    }

    setLoading(false);
  };

  const handleDownload = async (filePath) => {
    const { data, error } = await supabase.storage
      .from("frugal-files")
      .createSignedUrl(filePath, 60); // 60 seconds

    if (error) {
      console.error(error);
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  if (loading) return <p>Loading...</p>;

  if (requests.length === 0) return <p>No Frugal requests yet.</p>;

  return (
    <div>
      <h2>Frugal Reports</h2>

      {requests.map((request) => (
        <div key={request.id} className="report-card">
          <p>
            <strong>Status:</strong> {request.status}
          </p>
          <p>
            <strong>Visit Date:</strong> {request.visit_date}
          </p>
          <p>
            <strong>Notes:</strong> {request.notes}
          </p>

          <div>
            <strong>Files:</strong>
            <ul>
              {request.frugal_files.map((file) => (
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
      ))}
    </div>
  );
}
