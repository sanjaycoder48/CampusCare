import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, PenLine, Clock, ChevronRight, Calendar, Package, DoorOpen, Coffee } from "lucide-react";
import { fetchComplaints, fetchEmergencies } from "../api";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins || 1} mins ago`;
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchComplaints(),
      fetchEmergencies()
    ]).then(([complaintsData, emergenciesData]) => {
      setComplaints(complaintsData);
      setEmergencies(emergenciesData);
    });
  }, []);

  const myPendingComplaints = complaints.filter((c) => c.status === "Pending" || !c.status).length;
  const myReportedEmergencies = emergencies.filter((e) => e.reportedBy === "user").length;
  const recentComplaints = complaints.slice(0, 4);

  const stats = [
    {
      label: "My Pending Complaints",
      value: String(myPendingComplaints),
      icon: FileText,
      onClick: () => navigate("/complaints"),
      bg: "bg-neutral-50",
      iconBg: "bg-white border border-neutral-200 shadow-sm text-black"
    },
    {
      label: "Emergencies I Reported",
      value: String(myReportedEmergencies),
      icon: AlertTriangle,
      onClick: () => navigate("/complaints"),
      bg: "bg-neutral-50",
      iconBg: "bg-white border border-rose-100 shadow-sm text-rose-600"
    },
    {
      label: "Campus Events",
      icon: Calendar,
      action: true,
      actionText: "View schedule",
      onClick: () => navigate("/events"),
      bg: "bg-indigo-50",
      iconBg: "bg-white border border-indigo-200 shadow-sm text-indigo-600"
    },
    {
      label: "Facility Booking",
      icon: DoorOpen,
      action: true,
      actionText: "Reserve spaces",
      onClick: () => navigate("/facilities"),
      bg: "bg-cyan-50",
      iconBg: "bg-white border border-cyan-200 shadow-sm text-cyan-600"
    },
    {
      label: "Cafeteria & Mess",
      icon: Coffee,
      action: true,
      actionText: "View today's menu",
      onClick: () => navigate("/cafeteria"),
      bg: "bg-orange-50",
      iconBg: "bg-white border border-orange-200 shadow-sm text-orange-600"
    },
    {
      label: "Lost & Found",
      icon: Package,
      action: true,
      actionText: "Report or retrieve",
      onClick: () => navigate("/lostfound"),
      bg: "bg-amber-50",
      iconBg: "bg-white border border-amber-200 shadow-sm text-amber-600"
    },
    {
      label: "File New Complaint",
      icon: PenLine,
      action: true,
      actionText: "Get AI assistance",
      onClick: () => navigate("/file-complaint"),
      bg: "bg-black md:col-span-2 lg:col-span-1",
      iconBg: "bg-white/10 text-white"
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">Welcome back! Track your complaints and report campus issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, action, bg, iconBg, onClick, actionText }) => (
          <button
            key={label}
            onClick={onClick}
            className={`group flex items-center gap-5 p-6 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${action ? "hover:shadow-black/20" : "hover:shadow-neutral-200 ring-1 ring-neutral-200"
              } ${bg}`}
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
              <Icon size={24} strokeWidth={2} />
            </div>
            <div>
              {action ? (
                <>
                  <p className={`font-bold ${bg.includes("bg-black") ? "text-white" : "text-black"} text-lg tracking-tight`}>{label}</p>
                  <p className={`${bg.includes("bg-black") ? "text-white/70" : "text-neutral-500"} text-sm mt-1`}>{actionText}</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-black tracking-tight mb-1">{value}</p>
                  <p className="text-sm font-medium text-neutral-500">{label}</p>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 sm:px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h2 className="text-lg font-bold text-black tracking-tight">Recent Complaints</h2>
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-black transition-colors group"
          >
            View all
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="divide-y divide-neutral-100">
          {recentComplaints.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-neutral-400" />
              </div>
              <p className="text-neutral-500 font-medium mb-3">No complaints yet.</p>
              <button
                onClick={() => navigate("/file-complaint")}
                className="text-black font-semibold hover:text-neutral-600 transition-colors"
              >
                File one with AI
              </button>
            </div>
          ) : (
            recentComplaints.map(({ id, title, category, status, createdAt }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-5 hover:bg-neutral-50 transition-colors cursor-pointer group"
                onClick={() => navigate("/complaints")}
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-neutral-200 transition-all shrink-0">
                    <FileText size={22} className="text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-black tracking-tight mb-1">{title}</p>
                    <p className="text-sm text-neutral-500 flex items-center gap-2 font-medium">
                      <span>{category}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {formatTimeAgo(createdAt)}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 pl-17 sm:pl-0">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${status?.toLowerCase() === "rejected"
                        ? "bg-rose-100 text-rose-700"
                        : status === "Pending" || !status
                          ? "bg-neutral-100 text-neutral-700"
                          : status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {status || "Pending"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
