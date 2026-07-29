import React from "react";

export default function StatusBadge({ status }) {
  const s = (status || "Pending").toLowerCase();

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (s === "submitted" || s === "open" || s === "pending" || s === "reported") {
    colorClasses = "bg-amber-100/80 text-amber-900 border-amber-300/60";
  } else if (s === "in progress" || s === "under review" || s === "assigned" || s === "matched" || s === "claim requested") {
    colorClasses = "bg-indigo-100/90 text-indigo-950 border-indigo-300/60 font-bold";
  } else if (s === "resolved" || s === "verified" || s === "returned" || s === "approved" || s === "joined") {
    colorClasses = "bg-emerald-100/90 text-emerald-950 border-emerald-300/60 font-bold";
  } else if (s === "closed" || s === "rejected" || s === "cancelled") {
    colorClasses = "bg-rose-100/90 text-rose-950 border-rose-300/60 font-bold";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border shadow-2xs ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status || "Pending"}
    </span>
  );
}
