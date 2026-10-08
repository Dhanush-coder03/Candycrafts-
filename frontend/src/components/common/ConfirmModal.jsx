import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-soft-lg border border-cream-300 relative transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-walnut-400 hover:text-walnut-800 transition p-1 rounded-full hover:bg-cream-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-walnut-900">{title || "Confirm Action"}</h3>
            <span className="text-xs text-walnut-400 tracking-wider uppercase font-semibold">Candy Crafts Admin</span>
          </div>
        </div>

        <p className="text-sm text-walnut-600 mb-6 leading-relaxed">
          {message || "Are you sure you want to proceed with this action?"}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-walnut-700 bg-cream-100 hover:bg-cream-200 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 shadow-sm transition active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
