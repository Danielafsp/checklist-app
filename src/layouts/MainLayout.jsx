import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="app-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
