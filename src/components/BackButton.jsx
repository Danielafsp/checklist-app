import { useNavigate, useLocation } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname.startsWith("/prompt/area")) {
      navigate("/prompt");
    } else if (location.pathname === "/prompt") {
      navigate("/client");
    } else if (location.pathname.startsWith("/subdew/area")) {
      navigate("/subdew");
    } else if (location.pathname === "/subdew") {
      navigate("/client");
    } else if (location.pathname === "/frugal") {
      navigate("client");
    } else if (location.pathname === "/nano") {
      navigate("client");
    } else if (location.pathname === "/team") {
      navigate("/");
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
    if (location.pathname.startsWith("/subdew/area")) {
      return "← Back to Subdew";
    }
    if (location.pathname === "/subdew") {
      return "← Back to Tools";
    }
    if (location.pathname === "/frugal") {
      return "← Back to Tools";
    }
    if (location.pathname === "/nano") {
      return "← Back to Tools";
    }
    if (location.pathname === "/team") {
      return "← Back to Home";
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
