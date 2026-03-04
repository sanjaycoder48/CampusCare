import { useState, useEffect } from "react";
import { FileText, ImageIcon, Clock, Check, Eye, PenTool, X, Trash2 } from "lucide-react";

const STORAGE_KEY = "campuscare-complaints";

const TRACKER_STEPS = ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"];

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins || 1} mins ago`;
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setComplaints(saved ? JSON.parse(saved) : []);
    } catch {
      setComplaints([]);
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete ALL student complaints from the database? This action cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setComplaints([]);
    }
  };

  const pendingCount = complaints.filter(c => c.status === "Pending" || !c.status).length;
  const inProgressCount = complaints.filter(c => c.status === "Under Review" || c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Complaint Management</h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">
            Review, update status, and manage student issue reports
          </p>
        </div>

        {complaints.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-600 border border-neutral-200 rounded-xl font-medium hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 shadow-sm shrink-0"
          >
            <Trash2 size={18} />
            <span>Clear All Database</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={24} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">New / Pending</p>
            <p className="text-3xl font-bold text-black tracking-tight">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PenTool size={24} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">In Progress</p>
            <p className="text-3xl font-bold text-black tracking-tight">{inProgressCount}</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Check size={24} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Resolved</p>
            <p className="text-3xl font-bold text-black tracking-tight">{resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 sm:px-8 py-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black tracking-tight">Active Complaint Register</h2>
          <span className="text-xs font-semibold text-neutral-500 bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
            {complaints.length} Total
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {complaints.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Inbox Zero</h3>
              <p className="text-neutral-500 font-medium max-w-sm mx-auto">
                There are currently no active complaints from students. Great job!
              </p>
            </div>
          ) : (
            complaints.map(
              ({ id, title, category, description, status = "Pending", createdAt, photos = [] }) => {
                const isRejected = status === "Rejected";

                return (
                  <div key={id} className={`p-6 sm:p-8 transition-colors ${isRejected ? 'bg-neutral-50/50 opacity-75' : 'hover:bg-neutral-50/30'}`}>
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Content Column */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-6">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-100 text-black shrink-0 shadow-sm border border-neutral-200/60">
                          <FileText size={24} strokeWidth={2} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-black tracking-tight leading-tight">{title}</h3>
                            <span
                              className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase shrink-0 shadow-sm ${status === "Rejected"
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : status === "Pending"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : status === "Resolved"
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-blue-100 text-blue-800 border border-blue-200"
                                }`}
                            >
                              {status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
                              {category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:block" />
                            <span className="text-xs sm:text-sm font-medium text-neutral-500 flex items-center gap-1.5">
                              <Clock size={14} />
                              {formatTimeAgo(createdAt)}
                            </span>
                          </div>

                          {description && (
                            <div className="mt-5 p-4 bg-neutral-50 rounded-xl border border-neutral-200/60">
                              <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                                {description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Side Actions Column */}
                      <div className="lg:w-72 shrink-0 flex flex-col gap-6 lg:border-l lg:border-neutral-100 lg:pl-8">
                        {/* Status Manager */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">
                            Update Status
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {status === "Pending" && (
                              <button
                                onClick={() => updateStatus(id, "Under Review")}
                                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                              >
                                <Eye size={14} />
                                Begin Review
                              </button>
                            )}
                            {(status === "Pending" || status === "Under Review") && (
                              <button
                                onClick={() => updateStatus(id, "In Progress")}
                                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors shadow-sm"
                              >
                                <PenTool size={14} />
                                Start Work
                              </button>
                            )}
                            {status !== "Resolved" && status !== "Rejected" && (
                              <>
                                <button
                                  onClick={() => updateStatus(id, "Resolved")}
                                  className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors shadow-sm"
                                >
                                  <Check size={14} />
                                  Resolve
                                </button>
                                <button
                                  onClick={() => updateStatus(id, "Rejected")}
                                  className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors shadow-sm"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </>
                            )}
                            {(status === "Resolved" || status === "Rejected") && (
                              <button
                                onClick={() => updateStatus(id, "Under Review")}
                                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm"
                              >
                                Reopen Complaint
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Photos */}
                        {photos.length > 0 && (
                          <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">
                              Attached Evidence ({photos.length})
                            </span>
                            <div className="flex gap-2 flex-wrap">
                              {photos.map((src, i) => (
                                <a key={i} href={src} target="_blank" rel="noreferrer" className="block relative group">
                                  <img
                                    src={src}
                                    alt={`Proof ${i + 1}`}
                                    className="w-[72px] h-[72px] object-cover rounded-xl border border-neutral-200 shadow-sm group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon size={16} className="text-white" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;

