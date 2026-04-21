import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./pages/ProfilePage.jsx";
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
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ClientResetPassword from "./Authentication/ClientResetPassword.jsx";
import AdminForgotPassword from "./Authentication/AdminForgotPassword.jsx";
import ForgotPassword from "./Authentication/ResetPassword.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />

        <Route element={<MainLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="client">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/team" element={<Team />} />

          <Route path="/prompt" element={<PromptChecklist />} />
          <Route path="/prompt/area/:areaId" element={<PromptArea />} />

          <Route path="/subdew" element={<SubdewChecklist />} />
          <Route path="/subdew/area/:areaId" element={<SubdewArea />} />

          <Route path="/frugal" element={<FrugalUploader />} />

          <Route path="/nano" element={<Nano />} />

          <Route path="/login" element={<ClientLogin />} />
          <Route path="/register" element={<ClientRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/client-reset-password"
            element={
              <ClientResetPassword forgotPasswordPath="/forgot-password" />
            }
          />
          <Route
            path="/admin-forgot-password"
            element={<AdminForgotPassword />}
          />
          <Route
            path="/admin-reset-password"
            element={
              <ClientResetPassword forgotPasswordPath="/admin-forgot-password" />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
