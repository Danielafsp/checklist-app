import { useState } from "react";

export default function Frugal() {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      files,
      notes,
      visitDate,
    });

    setSubmitted(true);
  };

  return (
    <div className="client-request">
      <h1>Project Request</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="request-form">
          <label>
            Upload files:
            <input type="file" multiple onChange={handleFileChange} />
          </label>

          <label>
            Notes:
            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant information here..."
            />
          </label>

          <label>
            Preferred on-site visit date:
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </label>

          <button type="submit">Submit request</button>
        </form>
      ) : (
        <div className="confirmation-message">
          <p>
            A member of the team will contact you in
            <strong> 3 to 5 business days.</strong>
          </p>
        </div>
      )}
    </div>
  );
}
