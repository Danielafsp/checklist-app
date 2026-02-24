import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/AdminDashboard.css";

export default function PromptReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString() : "—";

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("tool", "prompt")
      .eq("status", "submitted")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data);
    }

    setLoading(false);
  };

  return (
    <section className="admin-section">
      <h2>PROMPT Inspections</h2>
      <p>Overview of submitted Prompt reports</p>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No Prompt inspections submitted yet.</p>
      ) : (
        <>
          <div className="reports-grid">
            {reports.map((report) => (
              <div
                key={report.id}
                className="report-card"
                onClick={() => setSelectedReport(report)}
              >
                <h4>Inspection #{report.id}</h4>
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Created:</strong> {formatDate(report.created_at)}
                </p>
              </div>
            ))}
          </div>

          {selectedReport && (
            <div style={{ marginTop: "20px" }}>
              <h3>Inspection Details</h3>

              <p>
                <strong>ID:</strong> {selectedReport.id}
              </p>
              <p>
                <strong>Tool:</strong> {selectedReport.tool}
              </p>
              <p>
                <strong>Status:</strong> {selectedReport.status}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {formatDate(selectedReport.created_at)}
              </p>
              <p>
                <strong>Created By:</strong> {selectedReport.created_by}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
