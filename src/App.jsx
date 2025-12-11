import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ClientDashboard from ".pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
