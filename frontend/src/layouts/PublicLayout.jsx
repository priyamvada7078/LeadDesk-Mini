import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}