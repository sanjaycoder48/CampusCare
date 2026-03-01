import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, PenLine, Clock } from "lucide-react";

const COMPLAINTS_KEY = "campuscare-complaints";
const EMERGENCIES_KEY = "campuscare-emergencies";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins} mins ago`;
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        setComplaints(JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || "[]"));
        setEmergencies(JSON.parse(localStorage.getItem(EMERGENCIES_KEY) || "[]"));
      } catch {
        setComplaints([]);
        setEmergencies([]);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const myPendingComplaints = complaints.filter((c) => c.status === "Pending").length;
  const myReportedEmergencies = emergencies.filter((e) => e.reportedBy === "user").length;
  const recentComplaints = complaints.slice(0, 3);

  const stats = [
    {
      label: "My Pending Complaints",
      value: String(myPendingComplaints),
      icon: FileText,
      onClick: () => navigate("/complaints"),
    },
    {
      label: "Emergencies I Reported",
      value: String(myReportedEmergencies),
      icon: AlertTriangle,
      onClick: () => navigate("/complaints"),
    },
    {
      label: "File New Complaint",
      icon: PenLine,
      action: true,
      onClick: () => navigate("/file-complaint"),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Track your complaints and report issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, action, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-lg text-left hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 text-black">
              <Icon size={24} strokeWidth={1.75} />
            </div>
            <div>
              {action ? (
                <p className="font-medium text-black">{label}</p>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-black">{value}</p>
                  <p className="text-sm text-neutral-500">{label}</p>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-black">Recent Complaints</h2>
          <button
            onClick={() => navigate("/complaints")}
            className="text-sm font-medium text-black hover:text-neutral-600"
          >
            View all
          </button>
        </div>
        <div className="divide-y divide-neutral-100">
          {recentComplaints.length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-500 text-sm">
              No complaints yet.{" "}
              <button
                onClick={() => navigate("/file-complaint")}
                className="text-black font-medium hover:underline"
              >
                File one with AI
              </button>
            </div>
          ) : (
            recentComplaints.map(({ id, title, category, status, createdAt }) => (
              <div
                key={id}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/5">
                    <FileText size={20} className="text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-black">{title}</p>
                    <p className="text-sm text-neutral-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTimeAgo(createdAt)} · {category}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    status === "Pending"
                      ? "bg-black/10 text-black"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
