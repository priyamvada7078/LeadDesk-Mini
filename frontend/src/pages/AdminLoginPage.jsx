import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginAdmin({
        email: email.trim(),
        password,
      });

      if (res.success && res.token) {
        login(res.token);
        navigate('/admin', { replace: true });
      } else {
        setError(res.message || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Invalid email or password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1E293B] p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/90 dark:border-[#334155] transition-all">
        
        {/* Card Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shadow-inner mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">Admin Portal Login</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-[#CBD5E1]">
            Sign in to access your LeadDesk Mini admin dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-sm font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@leaddesk.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
