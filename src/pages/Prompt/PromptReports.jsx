import "../../styles/AdminDashboard.css";

export default function PromptReports() {
  return (
    <section className="admin-section">
      <h2>PROMPT Inspections</h2>
      <p>Overview of submitted Prompt reports</p>

      <div className="admin-state admin-empty">
        No Prompt inspections submitted yet.
      </div>
    </section>
  );
}
