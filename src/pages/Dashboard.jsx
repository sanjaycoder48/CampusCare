import { useState, useEffect } from "react";
import { AlertCircle, FileText, Bell, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EMERGENCY_KEY = "campuscare-emergencies";
const COMPLAINTS_KEY = "campuscare-complaints";

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins} mins ago`;
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function Dashboard() {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        setEmergencies(JSON.parse(localStorage.getItem(EMERGENCY_KEY) || "[]"));
        setComplaints(JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || "[]"));
      } catch {
        setEmergencies([]);
        setComplaints([]);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const openEmergencies = emergencies.filter((e) => e.status === "Active").length;
  const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;
  const resolvedCount = emergencies.filter((e) => e.status === "Resolved").length;

  const stats = [
    {
      label: "Open Emergencies",
      value: String(openEmergencies),
      icon: Bell,
      color: "bg-black/10",
      onClick: () => navigate("/emergency-log"),
    },
    {
      label: "Pending Complaints",
      value: String(pendingComplaints),
      icon: FileText,
      color: "bg-black/10",
      onClick: () => navigate("/complaints"),
    },
    {
      label: "Resolved",
      value: String(resolvedCount),
      icon: TrendingUp,
      color: "bg-black/10",
      onClick: () => navigate("/emergency-log"),
    },
  ];

  const recentEmergencies = emergencies
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      type: e.type,
      location: e.location,
      time: formatTimeAgo(e.time),
      status: e.status,
    }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Welcome back. Here&apos;s your campus overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-lg text-left hover:bg-neutral-50 transition-colors"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color} text-black`}>
              <Icon size={24} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-black">{value}</p>
              <p className="text-sm text-neutral-500">{label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-black">Recent Emergencies</h2>
          <button
            onClick={() => navigate("/emergency-log")}
            className="text-sm font-medium text-black hover:text-neutral-600"
          >
            View all
          </button>
        </div>
        <div className="divide-y divide-neutral-100">
          {recentEmergencies.length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-500 text-sm">
              No emergencies logged yet.
            </div>
          ) : (
            recentEmergencies.map(({ id, type, location, time, status }) => (
              <div
                key={id}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/5">
                    <AlertCircle size={20} className="text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-black">{type} — {location}</p>
                    <p className="text-sm text-neutral-500">{time}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    status === "Active"
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
