import "../../styles/AdminDashboard.css";

export default function SubdewReports() {
  return (
    <section className="admin-section">
      <h2>SUBDEW Inspections</h2>
      <p>Overview of submitted Subdew reports</p>

      <div className="admin-state admin-empty">
        No Subdew inspections available.
      </div>
    </section>
  );
}
