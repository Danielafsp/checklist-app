import { useParams, useNavigate } from "react-router-dom";
import { subdewQuestions } from "../../data/subdewQuestions";
import { subdewAreas } from "../../data/subdewAreas";
import "../../styles/Area.css";

export default function SubdewArea() {
  const { areaId } = useParams();
  const navigate = useNavigate();

  const id = parseInt(areaId, 10);

  const areaKeys = Object.keys(subdewQuestions).map(Number);
  const TOTAL_AREAS = Math.max(...areaKeys);

  const questions = subdewQuestions[id];
  const title = subdewAreas[id];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goPrevious = () => {
    scrollToTop();
    navigate(`/subdew/area/${id - 1}`);
  };

  const goNext = () => {
    scrollToTop();
    navigate(`/subdew/area/${id + 1}`);
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
            <select className="select-input">
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
            <textarea rows="3" className="textarea-input" />

            <label>Photo:</label>
            <input type="file" accept="image/*" className="file-input" />
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
