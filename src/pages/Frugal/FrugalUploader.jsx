import { useState } from "react";
import "../../styles/Frugal.css";

export default function Frugal() {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      file,
      uploaded: false,
      uploading: false,
    }));

    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleFileUpload = (index) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, uploading: true } : f)),
    );

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, uploading: false, uploaded: true } : f,
        ),
      );
    }, 1000);
  };

  const handleFileDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log({
      files,
      notes,
      visitDate,
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const isSubmitDisabled =
    !visitDate || files.some((f) => !f.uploaded) || loading;

  return (
    <div className="client-request">
      <h1 className="title">FRUGAL</h1>
      <p className="subtitle">
        Take the next step toward smarter property management. Built for
        Property Managers and Condo Boards. Frugal can streamline your planning,
        budgeting, and project oversight.
      </p>
      {!submitted && (
        <>
          <br />
          <h4>Start your Frugal Journey</h4>
          <p>
            Please complete all fields below and upload your current Reserve
            Fund Study.
          </p>
        </>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="request-form">
          <label>
            Upload files:
            <input type="file" multiple onChange={handleFileChange} />
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, index) => (
                  <li key={index} className="file-item">
                    <span>{f.file.name}</span>

                    <div className="file-actions">
                      {f.uploaded ? (
                        <span className="file-success">Uploaded</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFileUpload(index)}
                          disabled={f.uploading}
                        >
                          {f.uploading ? "Uploading..." : "Upload"}
                        </button>
                      )}

                      <button
                        type="button"
                        className="file-delete"
                        onClick={() => handleFileDelete(index)}
                        aria-label="Delete file"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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

          <button type="submit" disabled={isSubmitDisabled}>
            {loading ? "Submitting..." : "Submit request"}
          </button>
        </form>
      ) : (
        <div className="confirmation-message fade-in">
          <p>
            Your Frugal journey has now begun, your data is being analyzed. A
            Fort Sands Frugal Advisor will contact you in
            <strong> 3-5 Working days.</strong>
          </p>
        </div>
      )}
    </div>
  );
}
