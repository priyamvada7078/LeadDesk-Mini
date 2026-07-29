import { useState } from 'react';
import { createLead } from '../api/leads';
import Toast from '../components/Toast';
import { Send, Zap, Lock, TrendingUp, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const BUDGET_OPTIONS = [
  'Less than ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  'More than ₹1,00,000',
];

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // View toggle state for Mobile & iPad: false = Hero view, true = Lead Form view
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
    } else if (name === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'budget') {
      if (!value) error = 'Please select a budget range';
    } else if (name === 'message') {
      if (!value.trim()) {
        error = 'Message is required';
      } else if (value.trim().length < 10) {
        error = 'Message must be at least 10 characters long';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error on typing
    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setToast({ show: false, type: 'success', message: '' });

    try {
      const res = await createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        budget: formData.budget,
        message: formData.message.trim(),
      });

      if (res.success) {
        setToast({
          show: true,
          type: 'success',
          message: res.message || 'Lead submitted successfully! We will get in touch with you shortly.',
        });
        setFormData({ name: '', email: '', budget: '', message: '' });
        setErrors({});
        setIsMobileFormOpen(false); // Return to hero overview on mobile/iPad after submission
      } else {
        setToast({
          show: true,
          type: 'error',
          message: res.message || 'Failed to submit lead. Please try again.',
        });
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Server error while submitting lead. Please try again.';
      setToast({
        show: true,
        type: 'error',
        message: serverMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Form component
  const renderLeadForm = (isMobileOrTablet = false) => (
    <div className={`w-full ${isMobileOrTablet ? 'max-w-xl mx-auto' : 'max-w-lg lg:max-w-xl'} bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/90 dark:border-[#334155] transition-all`}>
      {isMobileOrTablet && (
        <button
          type="button"
          onClick={() => setIsMobileFormOpen(false)}
          className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
        </button>
      )}

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">Get in Touch</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
          Fill in your details below and our team will get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor={isMobileOrTablet ? "mobile-name" : "name"} className="block text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id={isMobileOrTablet ? "mobile-name" : "name"}
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
              errors.name
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 focus:ring-red-500'
                : 'border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-500/20'
            } placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all shadow-xs`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={isMobileOrTablet ? "mobile-email" : "email"} className="block text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id={isMobileOrTablet ? "mobile-email" : "email"}
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="name@company.com"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
              errors.email
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 focus:ring-red-500'
                : 'border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-500/20'
            } placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all shadow-xs`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* Budget Range */}
        <div>
          <label htmlFor={isMobileOrTablet ? "mobile-budget" : "budget"} className="block text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] mb-1">
            Budget Range <span className="text-red-500">*</span>
          </label>
          <select
            id={isMobileOrTablet ? "mobile-budget" : "budget"}
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
              errors.budget
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 focus:ring-red-500'
                : 'border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-500/20'
            } focus:outline-none focus:ring-2 transition-all shadow-xs cursor-pointer`}
          >
            <option value="" disabled className="dark:bg-[#0F172A]">
              Select budget range
            </option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-[#0F172A]">
                {opt}
              </option>
            ))}
          </select>
          {errors.budget && <p className="mt-1 text-xs text-red-500 font-medium">{errors.budget}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor={isMobileOrTablet ? "mobile-message" : "message"} className="block text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id={isMobileOrTablet ? "mobile-message" : "message"}
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell us about your project requirements (min 10 characters)..."
            className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
              errors.message
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 focus:ring-red-500'
                : 'border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-500/20'
            } placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all shadow-xs`}
          />
          {errors.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-sm font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Lead...
            </span>
          ) : (
            <>
              <span>Submit Request</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-[#0F172A] w-full flex-1 flex flex-col justify-center transition-colors duration-200">
      {/* Dynamic Background Glow FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-20 right-0 w-96 h-96 bg-blue-600/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[96rem] w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-16 xl:px-20 py-4 lg:py-6 relative z-10">
        
        {/* ====================================================== */}
        {/* MOBILE & IPAD VIEW (< 1024px): Hero Overview -> "Get in Touch" Button -> Form */}
        {/* ====================================================== */}
        <div className="block lg:hidden">
          {!isMobileFormOpen ? (
            <div className="space-y-6 text-left animate-in fade-in duration-200">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> LeadDesk Mini SaaS Platform
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight leading-[1.14]">
                Capture More Leads.{' '}
                <span className="block mt-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 dark:from-blue-400 dark:via-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  Manage Every Opportunity.
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#CBD5E1] leading-relaxed max-w-2xl">
                Transform your inbound lead generation workflow with an intuitive, real-time lead capture system built for high-growth digital businesses and agency heroes.
              </p>

              {/* "Get in Touch" CTA Button for Mobile & iPad */}
              <button
                type="button"
                onClick={() => setIsMobileFormOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer transition-all duration-300"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 3 Feature Cards (1-col on phone, 3-col row on iPad md:grid-cols-3) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">⚡ Fast Lead Capture</h3>
                    <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">Instantly gather client requirements with zero friction.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">🔒 Secure Admin Dashboard</h3>
                    <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">Protected portal for admins to manage lead requests safely.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">📈 Track Every Client</h3>
                    <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">Monitor pipeline statuses across New, Contacted, & Closed.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              {renderLeadForm(true)}
            </div>
          )}
        </div>

        {/* ====================================================== */}
        {/* DESKTOP VIEW (>= 1024px): 2-Column Side-by-Side */}
        {/* ====================================================== */}
        <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* LEFT COLUMN: Hero & Feature Cards */}
          <div className="col-span-6 space-y-5 text-left w-full">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> LeadDesk Mini SaaS Platform
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight leading-[1.14]">
              Capture More Leads.{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 dark:from-blue-400 dark:via-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                Manage Every Opportunity.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#CBD5E1] leading-relaxed max-w-xl">
              Transform your inbound lead generation workflow with an intuitive, real-time lead capture system built for high-growth digital businesses and agency heroes.
            </p>

            {/* 3 Feature Cards */}
            <div className="space-y-3 pt-1 w-full">
              {/* Card 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:scale-[1.01] transition-all duration-300 group flex items-center gap-3.5 w-full">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors duration-300">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
                    ⚡ Fast Lead Capture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                    Instantly gather client requirements & budget ranges with zero friction.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:scale-[1.01] transition-all duration-300 group flex items-center gap-3.5 w-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-colors duration-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
                    🔒 Secure Admin Dashboard
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                    Protected portal for admins to manage and search lead requests safely.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:scale-[1.01] transition-all duration-300 group flex items-center gap-3.5 w-full">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors duration-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
                    📈 Track Every Client
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                    Monitor pipeline statuses across New, Contacted, and Closed effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Lead Form */}
          <div className="col-span-6 flex justify-center lg:justify-end w-full">
            {renderLeadForm(false)}
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'success', message: '' })}
        />
      )}
    </div>
  );
}
