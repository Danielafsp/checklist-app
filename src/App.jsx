import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import ClientLogin from "./pages/ClientLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PromptChecklist from "./pages/Prompt/PromptChecklist.jsx";
import Area from "./pages/Prompt/PromptArea.jsx";
import SubdewChecklist from "./pages/Subdew/SubdewChecklist.jsx";
import FrugalUploader from "./pages/Frugal/FrugalUploader.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/prompt" element={<PromptChecklist />} />
      <Route path="/prompt/area/:areaId" element={<Area />} />
      <Route path="/subdew" element={<SubdewChecklist />} />
      <Route path="/frugal" element={<FrugalUploader />} />
    </Routes>
  );
}
