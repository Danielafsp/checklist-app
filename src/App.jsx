import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import ClientLogin from "./pages/ClientLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/prompt" element={<PromptChecklists />} />
      <Route path="/subdew" element={<SubdewChecklist />} />
      <Route path="/frugal" element={<FrugalUploader />} />
    </Routes>
  );
}
