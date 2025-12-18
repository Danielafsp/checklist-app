import { useNavigate, useLocation } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname.startsWith("/prompt/area")) {
      navigate("/prompt");
    } else if (location.pathname === "/prompt") {
      navigate("/client");
    } else {
      navigate("/client");
    }
  };

  const getLabel = () => {
    if (location.pathname.startsWith("/prompt/area")) {
      return "← Back to Prompt";
    }
    if (location.pathname === "/prompt") {
      return "← Back to Tools";
    }
    return null;
  };

  if (!getLabel()) return null;

  return (
    <button className="nav-back" onClick={handleBack}>
      {getLabel()}
    </button>
  );
}
