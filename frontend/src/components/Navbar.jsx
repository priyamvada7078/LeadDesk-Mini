import { Link, useLocation } from 'react-router-dom';
import { Layers, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#334155]/80 transition-colors duration-200 shadow-xs shrink-0">
      <div className="max-w-[96rem] w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:bg-blue-500 transition-all duration-300">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            LeadDesk <span className="text-blue-600 dark:text-blue-500">Mini</span>
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#334155] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer shadow-xs"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 animate-in fade-in zoom-in duration-300" />
            )}
          </button>

          {/* Admin Link / Back Link */}
          {!isAdminPath ? (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white/90" />
              <span>Admin Login</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-[#CBD5E1] bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-[#334155] rounded-xl transition-all duration-300"
            >
              ← Back to Site
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
