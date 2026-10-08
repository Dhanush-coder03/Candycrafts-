import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const Toast = () => {
  const { toast, closeToast } = useProducts();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, closeToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-sage-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-terracotta-500 shrink-0" />
  };

  const borders = {
    success: 'border-sage-200 bg-white/95',
    error: 'border-red-200 bg-white/95',
    info: 'border-terracotta-200 bg-white/95'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full transition-all duration-300">
      <div className={`p-4 rounded-2xl shadow-soft-lg border flex items-center justify-between gap-3 ${borders[toast.type || 'info']} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          {icons[toast.type] || icons.info}
          <p className="text-sm font-medium text-walnut-800 tracking-wide">
            {toast.message}
          </p>
        </div>
        <button
          onClick={closeToast}
          className="text-walnut-400 hover:text-walnut-700 transition p-1 rounded-lg"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
