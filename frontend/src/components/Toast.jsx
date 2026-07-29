import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300 ${
        isSuccess
          ? 'bg-slate-900/95 dark:bg-[#1E293B]/95 text-emerald-400 border-emerald-500/30'
          : 'bg-slate-900/95 dark:bg-[#1E293B]/95 text-red-400 border-red-500/30'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      )}
      <p className="text-sm font-medium text-slate-100 flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
