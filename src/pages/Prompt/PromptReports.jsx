import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import "../../styles/AdminDashboard.css";

export default function PromptReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString() : "—";

  const fetchReports = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("inspections")
      .select(
        `
      *,
      profiles ( name, email, property_name, address ),
      inspection_areas (
        id,
        area_id,
        question_answers (
          id,
          question_number,
          rating,
          question_notes (
            note
          ),
          question_photos (
            photo_url
          )
        )
      )
    `,
      )
      .eq("tool", "prompt")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data);
      console.log("All reports:", data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const submittedReports = reports.filter((r) => r.status === "submitted");

  const draftReports = reports.filter((r) => r.status === "draft");

  const handleDownloadPDF = async () => {
    if (!selectedReport) return;

    const doc = new jsPDF();
    let y = 20;

    const addLine = (text) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(text, 20, y);
      y += 8;
    };

    doc.setFontSize(16);
    doc.text("PROMPT Inspection Report", 20, y);
    y += 15;

    doc.setFontSize(12);

    addLine(
      `Created By: ${selectedReport.profiles?.name || selectedReport.created_by}`,
    );
    addLine(`Inspection ID: ${selectedReport.id}`);
    addLine(`Status: ${selectedReport.status}`);
    addLine(`Created: ${formatDate(selectedReport.created_at)}`);
    addLine(`Submitted: ${formatDate(selectedReport.submitted_at)}`);
    addLine(`Client Name: ${selectedReport.profiles?.name || "—"}`);
    addLine(`Email: ${selectedReport.profiles?.email || "—"}`);
    addLine(`Property: ${selectedReport.profiles?.property_name || "—"}`);
    addLine(`Address: ${selectedReport.profiles?.address || "—"}`);

    y += 10;

    for (const area of selectedReport.inspection_areas || []) {
      addLine(`Area: ${area.area_id}`);
      y += 5;

      for (const answer of area.question_answers || []) {
        addLine(
          `Question ${answer.question_number} — Rating: ${answer.rating}/5`,
        );

        if (answer.question_notes?.note) {
          const splitText = doc.splitTextToSize(
            answer.question_notes.note,
            170,
          );
          splitText.forEach((line) => addLine(`Note: ${line}`));
        }

        if (answer.question_photos?.length > 0) {
          for (const photo of answer.question_photos) {
            if (y > 200) {
              doc.addPage();
              y = 20;
            }

            try {
              const img = await fetch(photo.photo_url)
                .then((res) => res.blob())
                .then(
                  (blob) =>
                    new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(blob);
                    }),
                );

              doc.addImage(img, "JPEG", 20, y, 80, 60);
              y += 70;
            } catch (err) {
              addLine("Photo could not be loaded.");
            }
          }
        }

        y += 5;
      }

      y += 10;
    }

    doc.save(`prompt-inspection-${selectedReport.id}.pdf`);
  };

  return (
    <section className="admin-section">
      <h2>PROMPT Inspections</h2>
      <p>Overview of all Prompt inspections</p>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No Prompt inspections submitted yet.</p>
      ) : (
        <>
          <h3>Submitted Reports</h3>
          {submittedReports.length === 0 ? (
            <p>No submitted reports yet.</p>
          ) : (
            <div className="reports-grid">
              {submittedReports.map((report) => (
                <div
                  key={report.id}
                  className="report-card"
                  onClick={() => setSelectedReport(report)}
                >
                  <h4>Inspection #{report.id}</h4>
                  <p>
                    <strong>Status:</strong> Submitted
                  </p>
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {formatDate(report.submitted_at)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: "40px" }}>In Progress</h3>
          {draftReports.length === 0 ? (
            <p>No inspections currently in progress.</p>
          ) : (
            <div className="reports-grid">
              {draftReports.map((report) => (
                <div
                  key={report.id}
                  className="report-card draft"
                  onClick={() => setSelectedReport(report)}
                >
                  <h4>Inspection #{report.id}</h4>
                  <p>
                    <strong>Status:</strong> Draft
                  </p>
                  <p>
                    <strong>Started:</strong> {formatDate(report.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}

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

              {selectedReport.inspection_areas?.map((area) => (
                <div key={area.id} className="inspection-area">
                  <h4 className="area-title">Area: {area.area_id}</h4>

                  {area.question_answers?.map((answer) => (
                    <div key={answer.id} className="inspection-question">
                      <p>
                        <strong>Question {answer.question_number}:</strong>{" "}
                        {answer.rating}/5
                      </p>

                      {answer.question_notes?.note && (
                        <p className="inspection-note">
                          Note: {answer.question_notes.note}
                        </p>
                      )}

                      {answer.question_photos?.length > 0 && (
                        <div className="inspection-photos">
                          {answer.question_photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo.photo_url}
                              alt="Inspection"
                              className="inspection-photo"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {selectedReport && (
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={handleDownloadPDF}
                    style={{ marginTop: "15px" }}
                  >
                    Download as PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
