import { useParams } from "react-router-dom";
import { promptQuestions } from "../../data/promptQuestions";

export default function PromptArea() {
  const { areaId } = useParams();

  const questions = promptQuestions[areaId];

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Area {areaId}</h1>

      {!questions && <p>No questions found for this area.</p>}

      <ul>
        {questions?.map((q) => (
          <li key={q.id} style={{ marginBottom: "1rem" }}>
            <p>
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

            <br />
            <br />

            <label>Notes:</label>
            <br />
            <textarea rows="3" style={{ width: "100%" }} />

            <br />
            <br />

            <label>Photo:</label>
            <input type="file" accpet="image/*" />
          </li>
        ))}
      </ul>
    </div>
  );
}
