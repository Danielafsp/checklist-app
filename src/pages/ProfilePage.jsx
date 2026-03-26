import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
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
        `*, inspection_areas (id, area_id; question_answers (id, question_number, rating, question_notes (note), question_photos (photo_url)))`,
      )
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    setReports(reportsData);

    const { data: frugal } = await supabase
      .from("frugal_requests")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    const frugalIds = frugal.map((f) => f.id);

    const { data: files } = await supabase
      .from("frugal_files")
      .select("*")
      .in("frugal_request_id", frugalIds);

    const frugalWithFiles = frugal.map((f) => ({
      ...f,
      file_url: files.find((file) => file.frugal_request_id === f.id)?.file_url,
    }));

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
        source: " inspection",
        data: i,
      })),
      ...(frugalWithFiles || []).map((f) => ({
        id: f.id,
        type: f.tool,
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

  function handleDownload(report) {
    if (report.source === "inspection") {
      downloadInspectionPDF(report.data);
    }

    if (report.source === "roof") {
      downloadRoofPDF(report.data);
    }

    if (report.source === "frugal" && report.data.file_url) {
      const publicUrl = supabase.storage
        .from("frugal-files")
        .getPublicUrl(report.data.file_url).data.publicURL;
      window.open(publicUrl, "_blank");
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

    doc.save(`${data.name}-roof.pdf`);
  }

  function downloadInspectionPDF(data) {
    const doc = new jsPDF();

    let y = 20;

    const addLine = (text) => {
      doc.text(text, 20, y);
      y += 8;
    };

    addLine(`Inspection ID: ${data.id}`);
    addLine(`Type: ${data.tool}`);
    addLine(`Status: ${data.status}`);
    addLine(`Created: ${new Date(data.created_at).toLocaleString()}`);

    y += 5;

    data.inspection_areas?.forEach((area) => {
      addLine(`Area: ${area.area_id}`);

      area.question_answers?.forEach((answer) => {
        addLine(`Q${answer.question_number} → ${answer.rating}/5`);

        if (answer.question_notes?.note) {
          addLine(`Note: ${answer.question_notes.note}`);
        }
      });

      y += 5;
    });

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
