import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = "info", message = "" } = toast;

  const typeStyles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 icon-emerald",
    error: "bg-rose-50 text-rose-800 border-rose-200 icon-rose",
    info: "bg-indigo-50 text-indigo-800 border-indigo-200 icon-indigo",
  };

  const IconComponent =
    type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-md w-full px-4">
      <div
        className={`flex items-center justify-between p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all ${
          typeStyles[type] || typeStyles.info
        }`}
      >
        <div className="flex items-center gap-3">
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium leading-snug">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
