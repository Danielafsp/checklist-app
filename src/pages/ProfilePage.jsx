import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { promptAreas } from "../data/promptAreas";
import { promptQuestions } from "../data/promptQuestions";
import { subdewAreas } from "../data/subdewAreas";
import { subdewQuestions } from "../data/subdewQuestions";
import logo from "../assets/fsweblogo.webp";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    const { data: inspections } = await supabase
      .from("inspections")
      .select(
        `*, inspection_areas (id, area_id, question_answers (id, question_number, rating, question_notes (note), question_photos (photo_url)))`,
      )
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    const { data: frugal } = await supabase
      .from("frugal_requests")
      .select(`*, frugal_files (*)`)
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    const { data: roof } = await supabase
      .from("roof_requests")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .limit(4);

    const allReports = [
      ...(inspections || []).map((i) => ({
        id: i.id,
        type: i.tool,
        date: i.created_at,
        source: "inspection",
        data: i,
      })),
      ...(frugal || []).map((f) => ({
        id: f.id,
        type: f.tool || "frugal",
        date: f.created_at,
        source: "frugal",
        data: f,
      })),
      ...(roof || []).map((r) => ({
        id: r.id,
        type: "roof",
        date: r.created_at,
        source: "roof",
        data: r,
      })),
    ];

    const sorted = allReports
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    setReports(sorted);
  }

  async function handleSave() {
    await supabase.from("profiles").update(profile).eq("id", user.id);

    setEditing(false);
  }

  async function handleDownload(report) {
    if (report.source === "inspection") {
      downloadInspectionPDF(report.data);
    }

    if (report.source === "roof") {
      downloadRoofPDF(report.data);
    }

    if (report.source === "frugal") {
      const file = report.data.frugal_files?.[0];

      if (!file) return;

      const { data } = await supabase.storage
        .from("frugal-files")
        .createSignedUrl(file.file_url, 60);

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    }
  }

  function downloadRoofPDF(data) {
    const doc = new jsPDF();

    doc.text("Roof Armour Request", 20, 20);
    doc.text(`Name: ${data.name}`, 20, 30);
    doc.text(`Email: ${data.email}`, 20, 40);
    doc.text(`Phone: ${data.phone}`, 20, 50);
    doc.text(`Roof Age: ${data.roof_age}`, 20, 60);
    doc.text(`Roof Type: ${data.roof_type}`, 20, 70);
    doc.text(`Property Type: ${data.property_type}`, 20, 80);
    doc.text(`Status: ${data.status}`, 20, 90);
    doc.text(`Notes: ${data.notes || "-"}`, 20, 100);

    doc.save(`${data.name}-request.pdf`);
  }

  async function downloadInspectionPDF(data) {
    const doc = new jsPDF();

    const isPrompt = data.tool === "prompt";

    const areas = isPrompt ? promptAreas : subdewAreas;
    const questions = isPrompt ? promptQuestions : subdewQuestions;

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
    doc.text("Inspection Report", pageWidth / 2, y, { align: "center" });
    y += 15;

    doc.setFontSize(12);

    addLine(`Inspection ID: ${data.id}`);
    addLine(`Type: ${data.tool}`);
    addLine(`Status: ${data.status}`);
    addLine(`Created: ${new Date(data.created_at).toLocaleString()}`);
    addLine(`Submitted: ${data.submitted_at || "—"}`);

    y += 10;

    for (const area of data.inspection_areas || []) {
      const areaTitle = areas[area.area_id] || `Area ${area.area_id}`;

      addLine(`Area: ${areaTitle}`);
      y += 5;

      for (const answer of area.question_answers || []) {
        const questionText =
          questions[area.area_id]?.find((q) => q.id === answer.question_number)
            ?.text || `Question ${answer.question_number}`;

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
            } catch {
              addLine("Photo could not be loaded.");
            }
          }
        }

        y += 5;
      }

      y += 10;
    }

    doc.save(`inspection-${data.id}.pdf`);
  }

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        <input
          disabled={!editing}
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <input
          disabled={!editing}
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <input
          disabled={!editing}
          value={profile.property_name || ""}
          onChange={(e) =>
            setProfile({ ...profile, property_name: e.target.value })
          }
        />

        <input
          disabled={!editing}
          value={profile.address || ""}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
        />

        {!editing ? (
          <button onClick={() => setEditing(true)}>Edit</button>
        ) : (
          <button onClick={handleSave}>Save</button>
        )}
      </div>

      <div className="reports-grid">
        {reports.length === 0 && <p>No recent reports</p>}

        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <p>
              <strong>{report.type}</strong>
            </p>
            <p>{new Date(report.date).toLocaleDateString()}</p>

            <button onClick={() => handleDownload(report)}>
              {report.source === "frugal" ? "View File" : "Download PDF"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
