import { useNavigate, useLocation } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname.startsWith("/prompt/area")) {
      navigate("/prompt");
    } else if (location.pathname === "/prompt") {
      navigate("/");
    } else if (location.pathname.startsWith("/subdew/area")) {
      navigate("/subdew");
    } else if (location.pathname === "/subdew") {
      navigate("/");
    } else if (location.pathname === "/frugal") {
      navigate("/");
    } else if (location.pathname === "/nano") {
      navigate("/");
    } else if (location.pathname === "/team") {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  const getLabel = () => {
    if (location.pathname.startsWith("/prompt/area")) {
      return "← Back";
    }
    if (location.pathname === "/prompt") {
      return "← Back";
    }
    if (location.pathname.startsWith("/subdew/area")) {
      return "← Back";
    }
    if (location.pathname === "/subdew") {
      return "← Back";
    }
    if (location.pathname === "/frugal") {
      return "← Back";
    }
    if (location.pathname === "/nano") {
      return "← Back";
    }
    if (location.pathname === "/team") {
      return "← Back";
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
