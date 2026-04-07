import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import { subdewAreas } from "../../data/subdewAreas";
import { subdewQuestions } from "../../data/subdewQuestions";
import logo from "../../assets/fsweblogo.webp";
import "../../styles/AdminDashboard.css";

export default function SubdewReports() {
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
      .eq("tool", "subdew")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      console.log("RAW REPORT DATA:", data);
      setReports(data);

      if (data.length > 0) {
        setSelectedReport(data[0]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!selectedReport || selectedReport.status === "draft") return;

    const { error } = await supabase
      .from("inspections")
      .update({
        status: newStatus,
      })
      .eq("id", selectedReport.id);

    if (!error) {
      const updated = { ...selectedReport, status: newStatus };

      setSelectedReport(updated);

      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    } else {
      console.error("Error updating status:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedReport) return;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 75;
    const logoX = (pageWidth - logoWidth) / 2;

    doc.addImage(logo, "WEBP", logoX, 10, logoWidth, 20);

    let y = 40;

    const addLine = (text) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(text, 20, y);
      y += 8;
    };

    doc.setFontSize(16);
    doc.text("SUBDEW Inspection Report", pageWidth / 2, y, { align: "center" });
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
      const areaTitle = subdewAreas[area.area_id] || `Area ${area.area_id}`;
      addLine(`Area: ${areaTitle}`);
      addLine("------------------------------------------------");
      y += 5;

      for (const answer of area.question_answers || []) {
        const questionText =
          subdewQuestions[area.area_id]?.find(
            (q) => q.id === answer.question_number,
          )?.text || `Question ${answer.question_number}`;

        addLine(questionText);
        addLine(`Rating: ${answer.rating}/5`);

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

    doc.save(`subdew-inspection-${selectedReport.id}.pdf`);
  };

  if (loading) {
    return <p className="admin-loading">Loading...</p>;
  }

  if (reports.length === 0) {
    return <p className="admin-empty">No Subdew reports yet.</p>;
  }

  const isDraft = selectedReport?.status === "draft";

  return (
    <>
      <div className="reports-sidebar">
        <div className="reports-list">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`report-item ${selectedReport?.id === report.id ? "active" : ""}`}
              onClick={() => setSelectedReport(report)}
            >
              <strong>
                Inspection by {report.profiles?.name || "Unnamed Client"}
              </strong>

              <div className={`status status-${report.status}`}>
                {report.status}
              </div>

              <div>
                {report.submitted_at
                  ? formatDate(report.submitted_at)
                  : formatDate(report.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-viewer">
        {!selectedReport && <p>Select a report to view details.</p>}

        {selectedReport && (
          <div className="admin-section subdew">
            <h2>Inspection Details</h2>

            <p>
              <strong>ID:</strong> {selectedReport.id}
            </p>

            {isDraft && (
              <p className="draft-warning">
                This inspection is a draft and cannot be modified or exported.
              </p>
            )}

            <div className="admin-row">
              <strong>Status</strong>
              <select
                value={selectedReport.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isDraft}
              >
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <p>
              <strong>Created:</strong> {formatDate(selectedReport.created_at)}
            </p>

            <p>
              <strong>Client:</strong> {selectedReport.profiles?.name || "—"}
            </p>

            <p>
              <strong>Property:</strong>{" "}
              {selectedReport.profiles?.property_name || "—"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {selectedReport.profiles?.address || "—"}
            </p>

            {selectedReport.inspection_areas?.map((area) => (
              <div key={area.id} className="inspection-area">
                <h4 className="area-title">
                  Area: {subdewAreas[area.area_id]}
                </h4>

                {area.question_answers?.map((answer) => (
                  <div key={answer.id} className="inspection-question">
                    <p>
                      {subdewQuestions[area.area_id]?.find(
                        (question) => question.id === answer.question_number,
                      )?.text || "Unknown Question"}
                    </p>

                    <p>Score: {answer.rating}/5</p>

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

            <button
              onClick={handleDownloadPDF}
              disabled={isDraft}
              style={{ marginTop: "15px" }}
            >
              Download as PDF
            </button>
          </div>
        )}
      </div>
    </>
  );
}
