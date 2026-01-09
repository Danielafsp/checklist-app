import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { promptQuestions } from "../../data/promptQuestions";
import { promptAreas } from "../../data/promptAreas";
import "../../styles/Area.css";

export default function PromptArea() {
  const { areaId } = useParams();
  const navigate = useNavigate();

  const id = parseInt(areaId, 10);

  const areaKeys = Object.keys(promptQuestions).map(Number);
  const TOTAL_AREAS = Math.max(...areaKeys);

  const questions = promptQuestions[id];
  const title = promptAreas[id];

  const [notes, setNotes] = useState({});
  const [photos, setPhotos] = useState({});
  const [ratings, setRatings] = useState({});
  const [uploading, setUploading] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goPrevious = () => {
    scrollToTop();
    navigate(`/prompt/area/${id - 1}`);
  };

  const goNext = () => {
    scrollToTop();
    navigate(`/prompt/area/${id + 1}`);
  };

  const handleSavingQuestion = (questionId) => {
    const payload = {
      questionId,
      rating: ratings[questionId],
      notes: notes[questionId] || "",
      photos: photos[questionId] || [],
    };

    console.log("saving question:", payload);

    setSaved((prev) => ({ ...prev, [questionId]: true }));
  };

  const [saved, setSaved] = useState({});

  const handleRemovePhoto = (questionId, indexToRemove) => {
    setPhotos((prev) => ({
      ...prev,
      [questionId]: prev[questionId].filter(
        (_, index) => index !== indexToRemove
      ),
    }));

    setSaved((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  return (
    <div className="area-container">
      <h1 className="area-title">{title}</h1>

      {!questions && <p>No questions found for this area.</p>}

      <ul className="area-list">
        {questions?.map((q) => (
          <li key={q.id} className="area-item">
            <p className="question-text">
              <strong>{q.text}</strong>
            </p>

            <label>rating: </label>
            <select
              className="select-input"
              value={ratings[q.id] || ""}
              onChange={(e) => {
                setRatings((prev) => ({ ...prev, [q.id]: e.target.value }));
                setSaved((prev) => ({ ...prev, [q.id]: false }));
              }}
            >
              <option value="">Select</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>

            <br />
            <br />

            <label>Notes:</label>
            <textarea
              rows="3"
              className="textarea-input"
              value={notes[q.id] || ""}
              onChange={(e) => {
                setNotes((prev) => ({ ...prev, [q.id]: e.target.value }));
                setSaved((prev) => ({ ...prev, [q.id]: false }));
              }}
            />

            <br />
            <br />

            <label>Photo:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="file-input"
              onChange={(e) => {
                setPhotos((prev) => ({
                  ...prev,
                  [q.id]: [
                    ...(prev[q.id] || []),
                    ...Array.from(e.target.files),
                  ],
                }));
                setSaved((prev) => ({ ...prev, [q.id]: false }));
              }}
            />

            {photos[q.id]?.length > 0 && (
              <ul className="file-list">
                {photos[q.id].map((photo, index) => (
                  <li key={index} className="file-item">
                    📷 {photo.name}
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={() => handleRemovePhoto(q.id, index)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {saved[q.id] ? (
              <span className="saved-label">Saved ✓</span>
            ) : (
              <button
                className="save-btn"
                onClick={() => handleSaveQuestion(q.id)}
                disabled={!ratings[q.id]}
              >
                Save
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="area-navigation">
        {id > Math.min(...areaKeys) && (
          <button className="nav-btn" onClick={goPrevious}>
            ← Previous
          </button>
        )}

        {id < TOTAL_AREAS && (
          <button className="nav-btn" onClick={goNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
