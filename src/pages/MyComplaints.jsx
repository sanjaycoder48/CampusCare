import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, ImageIcon, Trash2, Check, Clock } from "lucide-react";
import { fetchComplaints, clearAllComplaints } from "../api";

const TRACKER_STEPS = ["Submitted", "Under Review", "In Progress", "Resolved"];

const getActiveStepIndex = (status) => {
  switch (status?.toLowerCase()) {
    case "pending": return 0;
    case "under review": return 1;
    case "in progress": return 2;
    case "resolved": return 3;
    case "rejected": return -1;
    default: return 0;
  }
};

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins || 1} mins ago`;
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints().then(data => setComplaints(data));
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your complaint history?")) {
      await clearAllComplaints();
      setComplaints([]);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">My Complaints</h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">Track the progress of your submitted complaints in real-time</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {complaints.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-600 border border-neutral-200 rounded-xl font-medium hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 shadow-sm"
            >
              <Trash2 size={18} />
              <span>Clear History</span>
            </button>
          )}
          <button
            onClick={() => navigate("/file-complaint")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
          >
            <Plus size={20} />
            File New Complaint
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {complaints.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 sm:p-16 text-center shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center">
                <FileText size={40} className="text-neutral-300" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No complaints yet</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              You haven't submitted any complaints. When you do, you'll be able to track their status here.
            </p>
            <button
              onClick={() => navigate("/file-complaint")}
              className="inline-flex items-center gap-2 text-black font-semibold hover:text-neutral-600 transition-colors"
            >
              <Plus size={20} />
              File your first complaint
            </button>
          </div>
        ) : (
          complaints.map(({ id, title, category, description, status, photos = [], createdAt }) => {
            const activeIndex = getActiveStepIndex(status);
            const isRejected = status?.toLowerCase() === "rejected";

            return (
              <div key={id} className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md hover:border-neutral-300 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-black/5 shrink-0">
                          <FileText size={24} className="text-black" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-black tracking-tight leading-tight">{title}</h3>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-sm font-medium text-neutral-600 flex items-center gap-1.5">
                              {category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:block" />
                            <span className="text-xs sm:text-sm text-neutral-500 flex items-center gap-1.5">
                              <Clock size={14} />
                              {formatTimeAgo(createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase shrink-0 ${isRejected
                            ? "bg-rose-100 text-rose-700"
                            : status === "Pending"
                              ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                              : status === "Resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {status || "Pending"}
                      </span>
                    </div>

                    {description && (
                      <p className="text-neutral-600 text-sm leading-relaxed mt-4 sm:pl-16">
                        {description}
                      </p>
                    )}
                  </div>

                  {photos.length > 0 && (
                    <div className="lg:w-64 shrink-0 mt-2 lg:mt-0 pt-4 lg:pt-0 lg:border-l lg:border-neutral-100 lg:pl-6">
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon size={16} className="text-neutral-500" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                          Attached Proofs ({photos.length})
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {photos.slice(0, 3).map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`Proof ${i + 1}`}
                            className="w-14 h-14 object-cover rounded-xl border border-neutral-200 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                        {photos.length > 3 && (
                          <div className="w-14 h-14 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-xs font-bold text-neutral-600 shadow-sm">
                            +{photos.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Tracker */}
                {!isRejected && (
                  <div className="mt-8 pt-6 border-t border-neutral-100 px-2 sm:px-6">
                    <div className="relative max-w-2xl mx-auto">
                      {/* Background Bar */}
                      <div className="absolute top-4 left-0 w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                        {/* Progress Bar */}
                        <div
                          className="absolute top-0 left-0 h-full bg-black transition-all duration-1000 ease-out"
                          style={{ width: `${(activeIndex / (TRACKER_STEPS.length - 1)) * 100}%` }}
                        />
                      </div>

                      <div className="relative flex justify-between">
                        {TRACKER_STEPS.map((step, index) => {
                          const isCompleted = index <= activeIndex;
                          const isCurrent = index === activeIndex;

                          return (
                            <div key={step} className="flex flex-col items-center gap-3 z-10 w-16 sm:w-24">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white transition-all duration-500 bg-white ${isCompleted
                                    ? "text-black drop-shadow-sm"
                                    : "text-neutral-300"
                                  } ${isCurrent ? "scale-110 drop-shadow-md ring-4 ring-black/5" : ""}`}
                              >
                                {isCompleted ? (
                                  <div className={`w-full h-full rounded-full flex items-center justify-center ${isCurrent ? "bg-black text-white" : "bg-black text-white"}`}>
                                    <Check size={14} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-3 h-3 rounded-full bg-neutral-200" />
                                )}
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs font-bold text-center tracking-wide uppercase transition-colors duration-300 ${isCompleted ? "text-black" : "text-neutral-400"
                                  }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
