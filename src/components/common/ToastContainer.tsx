import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-white/95 dark:bg-slate-900/95 border-[#16A34A]/40 text-slate-800 dark:text-slate-100'
                : isError
                ? 'bg-white/95 dark:bg-slate-900/95 border-[#DC2626]/40 text-slate-800 dark:text-slate-100'
                : 'bg-white/95 dark:bg-slate-900/95 border-[#2563EB]/40 text-slate-800 dark:text-slate-100'
            }`}
          >
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="h-5 w-5 text-[#DC2626] shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              aria-label="Dismiss Notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
