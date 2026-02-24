import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { promptQuestions } from "../../data/promptQuestions";
import { promptAreas } from "../../data/promptAreas";
import { supabase } from "../../lib/supabase";

import "../../styles/Area.css";

export default function PromptArea() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const id = parseInt(areaId, 10);

  const [inspectionId, setInspectionId] = useState(null);
  const [loadingInspection, setLoadingInspection] = useState(true);

  const [notes, setNotes] = useState({});
  const [photos, setPhotos] = useState({});
  const [ratings, setRatings] = useState({});
  const [saved, setSaved] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const areaKeys = Object.keys(promptQuestions).map(Number);
  const TOTAL_AREAS = Math.max(...areaKeys);

  const questions = promptQuestions[id];
  const title = promptAreas[id];

  useEffect(() => {
    const getOrCreateInspection = async () => {
      if (!user) return;

      setLoadingInspection(true);

      const { data: existing, error: fetchError } = await supabase
        .from("inspections")
        .select("*")
        .eq("tool", "prompt")
        .eq("created_by", user.id)
        .eq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Fetch draft error:", fetchError);
        setLoadingInspection(false);
        return;
      }

      if (existing) {
        setInspectionId(existing.id);
        if (existing.status === "submitted") {
          setSubmitted(true);
        }
        setLoadingInspection(false);
        return;
      }

      const { data: created, error: createError } = await supabase
        .from("inspections")
        .insert({
          tool: "prompt",
          created_by: user.id,
          status: "draft",
          created_at: new Date(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Create draft error:", createError);
      } else {
        setInspectionId(created.id);
      }

      setLoadingInspection(false);
    };

    getOrCreateInspection();
  }, [user]);

  useEffect(() => {
    if (!inspectionId) return;

    const ensureAreaExists = async () => {
      const { error } = await supabase.from("inspection_areas").upsert(
        {
          inspection_id: inspectionId,
          area_id: id,
        },
        { onConflict: "inspection_id,area_id" },
      );

      if (error) {
        console.error("Error ensuring area exists:", error);
      }
    };

    ensureAreaExists();
  }, [inspectionId, id]);

  useEffect(() => {
    if (!inspectionId) return;

    const loadExistingAnswers = async () => {
      try {
        const { data: areaData, error: areaError } = await supabase
          .from("inspection_areas")
          .select("id")
          .eq("inspection_id", inspectionId)
          .eq("area_id", id)
          .single();

        if (areaError || !areaData) return;

        const { data: answers, error: answersError } = await supabase
          .from("question_answers")
          .select(
            `
          id,
          question_number,
          rating,
          question_notes (note),
          question_photos (photo_url)
        `,
          )
          .eq("area_inspection_id", areaData.id);

        if (answersError || !answers) return;

        const loadedRatings = {};
        const loadedNotes = {};
        const loadedSaved = {};
        const loadedPhotos = {};

        answers.forEach((answer) => {
          loadedRatings[answer.question_number] = answer.rating;

          loadedNotes[answer.question_number] =
            answer.question_notes?.[0]?.note || "";

          if (answer.question_photos?.length > 0) {
            loadedPhotos[answer.question_number] = answer.question_photos.map(
              (p) => ({
                name: "Saved photo",
                url: p.photo_url,
                isSaved: true,
              }),
            );
          }

          loadedSaved[answer.question_number] = true;
        });

        setRatings(loadedRatings);
        setNotes(loadedNotes);
        setSaved(loadedSaved);
        setPhotos(loadedPhotos);
      } catch (err) {
        console.error("Error loading existing answers:", err);
      }
    };

    loadExistingAnswers();
  }, [inspectionId, id]);

  const handleSavingQuestion = async (questionNumber) => {
    if (!inspectionId || !user) return;

    try {
      setUploading(true);

      const { data: areaData, error: areaError } = await supabase
        .from("inspection_areas")
        .select("id")
        .eq("inspection_id", inspectionId)
        .eq("area_id", id)
        .single();

      if (areaError) throw areaError;

      const { data: answerData, error: answerError } = await supabase
        .from("question_answers")
        .upsert(
          {
            area_inspection_id: areaData.id,
            question_number: questionNumber,
            rating: parseInt(ratings[questionNumber]),
          },
          { onConflict: "area_inspection_id,question_number" },
        )
        .select()
        .single();

      if (answerError) throw answerError;

      const { error: noteError } = await supabase.from("question_notes").upsert(
        {
          question_answer_id: answerData.id,
          note: notes[questionNumber] || "",
        },
        { onConflict: "question_answer_id" },
      );

      if (noteError) throw noteError;

      if (photos[questionNumber]?.length > 0) {
        for (const file of photos[questionNumber]) {
          const filePath = `${inspectionId}/area-${id}/question-${questionNumber}/${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("inspection-photos")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload failed:", uploadError);
            continue;
          }

          const { data: publicUrlData } = supabase.storage
            .from("inspection-photos")
            .getPublicUrl(filePath);

          await supabase.from("question_photos").insert({
            question_answer_id: answerData.id,
            photo_url: publicUrlData.publicUrl,
          });
        }
      }

      setPhotos((prev) => ({
        ...prev,
        [questionNumber]: [],
      }));

      setSaved((prev) => ({ ...prev, [questionNumber]: true }));
    } catch (err) {
      console.error("Error saving question:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!inspectionId) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      const { error } = await supabase
        .from("inspections")
        .update({ status: "submitted_at", submitted_at: new Date() })
        .eq("id", inspectionId);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePhoto = (questionId, indexToRemove) => {
    setPhotos((prev) => ({
      ...prev,
      [questionId]: prev[questionId].filter(
        (_, index) => index !== indexToRemove,
      ),
    }));

    setSaved((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const goPrevious = () => {
    scrollToTop();
    navigate(`/prompt/area/${id - 1}`);
  };

  const goNext = () => {
    scrollToTop();
    navigate(`/prompt/area/${id + 1}`);
  };

  if (loadingInspection) {
    return <div className="area-container">Loading inspection...</div>;
  }

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

            {submitted && (
              <p className="read-only-hint">
                🔒 This report has been submitted and is now read-only.
              </p>
            )}

            <label>rating: </label>
            <select
              className="select-input"
              value={ratings[q.id] || ""}
              disabled={!user || submitted}
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
              disabled={!user || submitted}
              placeholder={!user ? "Login to add notes" : ""}
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
              disabled={!user || submitted}
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
                {photos[q.id]?.map((photo, index) => (
                  <li key={index} className="file-item">
                    {photo.isSaved ? (
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📷 View saved photo
                      </a>
                    ) : (
                      <span className="file-name">📷 {photo.name}</span>
                    )}

                    {!submitted && (
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => handleRemovePhoto(q.id, index)}
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!user ? (
              <p className="login-hint">
                🔒 Login to save answers and upload photos
              </p>
            ) : submitted ? (
              <span className="saved-label">Submitted ✓</span>
            ) : saved[q.id] ? (
              <span className="saved-label">Saved ✓</span>
            ) : (
              <button
                className="save-btn"
                onClick={() => handleSavingQuestion(q.id)}
                disabled={!ratings[q.id]}
              >
                Save
              </button>
            )}
          </li>
        ))}
      </ul>

      {user && id === TOTAL_AREAS && (
        <div className="final-submit-section">
          {!submitted ? (
            <>
              <button
                className="submit-report-btn"
                onClick={handleSubmitReport}
                disabled={!user || submitted}
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>

              {submitError && <p className="error-text">{submitError}</p>}
            </>
          ) : (
            <div className="confirmation-message fade-in">
              <p>
                <strong>Your entries have been successfully submitted.</strong>
                <br />A member of the <strong>Fort Sands team</strong> will
                contact you within
                <strong> 3–5 business days.</strong>
              </p>
            </div>
          )}
        </div>
      )}

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
