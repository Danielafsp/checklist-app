import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Team from "./pages/Team.jsx";

import PromptChecklist from "./pages/Prompt/PromptChecklist.jsx";
import PromptArea from "./pages/Prompt/PromptArea.jsx";

import SubdewChecklist from "./pages/Subdew/SubdewChecklist.jsx";
import SubdewArea from "./pages/Subdew/SubdewArea.jsx";

import FrugalUploader from "./pages/Frugal/FrugalUploader.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<MainLayout />}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/team" element={<Team />} />

          <Route path="/prompt" element={<PromptChecklist />} />
          <Route path="/prompt/area/:areaId" element={<PromptArea />} />

          <Route path="/subdew" element={<SubdewChecklist />} />
          <Route path="/subdew/area/:areaId" element={<SubdewArea />} />

          <Route path="/frugal" element={<FrugalUploader />} />

          <Route path="/nano" element={<Nano />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
