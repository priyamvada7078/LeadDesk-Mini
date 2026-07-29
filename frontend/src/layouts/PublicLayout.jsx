import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center py-2 lg:py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
