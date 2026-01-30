import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <section className="admin-section prompt">
        <h2>PROMPT Inspections</h2>
        <p>Overview of submitted Prompt reports</p>

        <div className="admin-state admin-empty">
          No Prompt inspections submitted yet.
        </div>
      </section>

      <section className="admin-section subdew">
        <h2>SUBDEW Inspections</h2>
        <p>Overview of submitted Subdew reports</p>

        <div className="admin-state admin-empty">
          No Subdew inspections available.
        </div>
      </section>

      <section className="admin-section frugal">
        <h2>FRUGAL Uploads</h2>
        <p>Overview of Frugal documentation</p>

        <div className="admin-state admin-empty">
          No documents uploaded yet.
        </div>
      </section>

      <section className="admin-section roof">
        <h2>Roof Armour Requests</h2>
        <p>Overview of Roof Armour contact requests</p>

        <div className="admin-state admin-empty">
          No contact requests received yet.
        </div>
      </section>

      <div className="admin-empty">No reports yet.</div>
    </div>
  );
}
