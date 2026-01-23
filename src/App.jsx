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

import Nano from "./pages/Nano/Nano.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import Footer from "./components/Footer.jsx";

import ClientLogin from "./Authentication/ClientLogin.jsx";
import ClientRegister from "./Authentication/ClientRegister.jsx";
import AdminLogin from "./Authentication/AdminLogin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />

        <Route element={<MainLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/team" element={<Team />} />

          <Route
            path="/prompt"
            element={
              <ProtectedRoute role="client">
                <PromptChecklist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompt/area/:areaId"
            element={
              <ProtectedRoute role="client">
                <PromptArea />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subdew"
            element={
              <ProtectedRoute role="client">
                <SubdewChecklist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subdew/area/:areaId"
            element={
              <ProtectedRoute role="client">
                <SubdewArea />
              </ProtectedRoute>
            }
          />

          <Route
            path="/frugal"
            element={
              <ProtectedRoute role="client">
                <FrugalUploader />
              </ProtectedRoute>
            }
          />

          <Route
            path="/nano"
            element={
              <ProtectedRoute role="client">
                <Nano />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<ClientLogin />} />
          <Route path="/register" element={<ClientRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
