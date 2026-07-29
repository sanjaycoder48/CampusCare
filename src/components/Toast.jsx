import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type, message } = toast;

  let bg = "bg-slate-900 text-white";
  let icon = <Info className="w-5 h-5 text-sky-400" />;

  if (type === "success") {
    bg = "bg-slate-900 text-white border border-emerald-500/30";
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  } else if (type === "error") {
    bg = "bg-slate-900 text-white border border-rose-500/30";
    icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
  } else if (type === "info") {
    bg = "bg-slate-900 text-white border border-indigo-500/30";
    icon = <Info className="w-5 h-5 text-indigo-400" />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl max-w-md ${bg}`}>
        {icon}
        <span className="text-xs font-semibold tracking-wide leading-relaxed">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
