import React from "react";

export default function StatusBadge({ status }) {
  const getBadgeStyle = (statusStr) => {
    const statusLower = (statusStr || "").toLowerCase();

    switch (statusLower) {
      // Complaints & Emergencies
      case "submitted":
      case "pending":
      case "open":
      case "reported":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "under review":
      case "matched":
      case "claim requested":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "assigned":
      case "in progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "resolved":
      case "verified":
      case "returned":
      case "approved":
      case "available":
      case "claimed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "closed":
      case "rejected":
      case "booked":
      case "maintenance":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
      case "high":
      case "urgent":
        return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        status
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
}
