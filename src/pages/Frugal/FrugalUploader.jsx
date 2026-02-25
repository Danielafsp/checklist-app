import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "../../styles/Frugal.css";
import frugalLogo from "../../assets/frugal.png";

export default function Frugal() {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      file,
      uploaded: false,
      uploading: false,
    }));

    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleFileUpload = async (index) => {
    if (!user) return;

    const fileObject = files[index];
    const file = fileObject.file;

    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, uploading: true } : f)),
    );

    const filePath = `frugal/${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("frugal-files")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      setErrorMessage("Error uploading file.");
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, uploading: false } : f)),
      );
      return;
    }

    const { data } = supabase.storage
      .from("frugal-files")
      .getPublicUrl(filePath);

    setFiles((prev) =>
      prev.map((f, i) =>
        i === index
          ? { ...f, uploading: false, uploaded: true, fileUrl: data.publicUrl }
          : f,
      ),
    );
  };

  const handleFileDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (files.length === 0) {
      return "Please upload at least one file.";
    }

    if (files.some((f) => !f.uploaded)) {
      return "Please upload all selected files before submitting.";
    }

    if (!visitDate) {
      return "Please select a preferred on-site visit date.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage("Please login or register to submit your request.");
      return;
    }

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // 1️⃣ Insert request
      const { data: requestData, error: requestError } = await supabase
        .from("frugal_requests")
        .insert([
          {
            property_address: "Not provided yet",
            visit_date: visitDate,
            notes,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      const requestId = requestData.id;

      const fileInserts = files.map((f) => ({
        frugal_request_id: requestId,
        file_url: f.fileUrl,
        file_name: f.file.name,
      }));

      const { error: filesError } = await supabase
        .from("frugal_files")
        .insert(fileInserts);

      if (filesError) throw filesError;

      setSubmitted(true);
      localStorage.removeItem("frugalDraft");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const isSubmitDisabled =
    !visitDate || files.some((f) => !f.uploaded) || loading;

  useEffect(() => {
    if (submitted) return;

    localStorage.setItem(
      "frugalDraft",
      JSON.stringify({ files, notes, visitDate }),
    );
  }, [files, notes, visitDate, submitted]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("frugalDraft");

    if (!savedDraft) return;

    try {
      const parsedDraft = JSON.parse(savedDraft);

      if (parsedDraft.files || parsedDraft.notes || parsedDraft.visitDate) {
        setFiles(parsedDraft.files || []);
        setNotes(parsedDraft.notes || "");
        setVisitDate(parsedDraft.visitDate || "");
      }
    } catch {
      localStorage.removeItem("frugalDraft");
    }
  }, []);

  useEffect(() => {
    if (errorMessage) setErrorMessage("");
  }, [files, notes, visitDate]);

  return (
    <div className="client-request">
      <figure className="frugal-logo">
        <img className="logo" src={frugalLogo} alt="FRUGAL" />
        <figcaption className="logo-label">Complimentary Service</figcaption>
      </figure>

      {!submitted && (
        <>
          <section className="frugal-video-section">
            <h2 className="video-title">How does Frugal Work!</h2>
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/bJbFoEDwYvs"
                title="How does Frugal Work"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          <p className="subtitle">
            Take the next step toward smarter property management. Built for
            Property Managers and Condo Boards. Frugal can streamline your
            planning, budgeting, and project oversight.
          </p>

          <br />
          <h4>Start your Frugal Journey</h4>
          <p>
            Please complete all fields below and upload your current Reserve
            Fund Study.
          </p>
        </>
      )}

      {!submitted && errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="request-form">
          <label>
            Upload files:
            <input
              type="file"
              multiple
              disabled={!user}
              onChange={handleFileChange}
            />
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
                          disabled={!user || f.uploading}
                          onClick={() => handleFileUpload(index)}
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

      {!user && (
        <p className="login-hint">
          Please login or register to upload files and submit your request.
        </p>
      )}
    </div>
  );
}
