import { useParams } from "react-router-dom";

export default function PromptArea() {
  const { areaId } = useParams();

  return (
    <div>
      <h1>Area {areaId}</h1>
      <p>This page will show the checklist questions.</p>
    </div>
  );
}
