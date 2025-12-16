import { useParams, useNavigate } from "react-router-dom";
import { promptQuestions } from "../../data/promptQuestions";
import "../../styles/PromptArea.css";

export default function PromptArea() {
  const { areaId } = useParams();
  const navigate = useNavigate();

  const id = parseInt(areaId, 10);
  const TOTAL_AREAS = object.keys(promptQuestions).length;

  const questions = promptQuestions[areaId];

  const goPrevious = () => navigate(`/prompt/area/${id - 1}`);
  const goNext = () => navigate(`/prompt/area/${id + 1}`);

  return (
    <div className="prompt-area-container">
      <h1 className="prompt-area-title">Area {areaId}</h1>

      {!questions && <p>No questions found for this area.</p>}

      <ul className="prompt-area-list">
        {questions?.map((q) => (
          <li key={q.id} className="prompt-area-item">
            <p className="question-text">
              <strong>{q.text}</strong>
            </p>

            <label>rating: </label>
            <select>
              <option value="">Select</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>

            <label>Notes:</label>
            <textarea rows="3" className="textarea-input" />

            <label>Photo:</label>
            <input type="file" accpet="image/*" className="file-input" />
          </li>
        ))}
      </ul>

      <div className="prompt-area-navigation">
        {id > 1 && (
          <button className="nav-btn" onClick={goPrevious}>
            ← Previous
          </button>
        )}

        {id > TOTAL_AREAS && (
          <button className="nav-btn" onClick={goNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
