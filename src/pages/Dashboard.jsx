import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, PenLine, Clock, ChevronRight, Calendar, Package, GraduationCap, BookOpen } from "lucide-react";
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
      setComplaints(complaintsData || []);
      setEmergencies(emergenciesData || []);
    });
  }, []);

  const myPendingComplaints = complaints.filter((c) => c.status === "Pending" || c.status === "Submitted").length;
  const myReportedEmergencies = emergencies.filter((e) => e.reportedBy === "user").length;
  const recentComplaints = complaints.slice(0, 4);

  const stats = [
    {
      label: "My Pending Complaints",
      value: String(myPendingComplaints),
      icon: FileText,
      onClick: () => navigate("/complaints"),
      bg: "bg-neutral-50",
      iconBg: "bg-white border border-neutral-200 shadow-xs text-black"
    },
    {
      label: "Emergencies Reported",
      value: String(myReportedEmergencies),
      icon: AlertTriangle,
      onClick: () => navigate("/file-complaint"),
      bg: "bg-neutral-50",
      iconBg: "bg-white border border-rose-100 shadow-xs text-rose-600"
    },
    {
      label: "Events & Clubs",
      icon: Calendar,
      action: true,
      actionText: "View department activities",
      onClick: () => navigate("/events"),
      bg: "bg-indigo-50",
      iconBg: "bg-white border border-indigo-200 shadow-xs text-indigo-600"
    },
    {
      label: "Honours & Minors",
      icon: GraduationCap,
      action: true,
      actionText: "Specialization tracks",
      onClick: () => navigate("/honours-minors"),
      bg: "bg-purple-50",
      iconBg: "bg-white border border-purple-200 shadow-xs text-purple-600"
    },
    {
      label: "Academic Syllabus",
      icon: BookOpen,
      action: true,
      actionText: "5-unit course directory",
      onClick: () => navigate("/syllabus"),
      bg: "bg-sky-50",
      iconBg: "bg-white border border-sky-200 shadow-xs text-sky-600"
    },
    {
      label: "Lost & Found",
      icon: Package,
      action: true,
      actionText: "Report & claim items",
      onClick: () => navigate("/lostfound"),
      bg: "bg-amber-50",
      iconBg: "bg-white border border-amber-200 shadow-xs text-amber-600"
    },
    {
      label: "File New Complaint",
      icon: PenLine,
      action: true,
      actionText: "Submit issue to department",
      onClick: () => navigate("/file-complaint"),
      bg: "bg-black md:col-span-2 lg:col-span-1",
      iconBg: "bg-white/10 text-white"
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">Welcome back! Track your campus services, department events, and syllabus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(item => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`group flex items-center gap-5 p-6 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${item.action ? "hover:shadow-black/20" : "hover:shadow-neutral-200 ring-1 ring-neutral-200"
              } ${item.bg}`}
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}>
              <item.icon size={24} strokeWidth={2} />
            </div>
            <div>
              {item.action ? (
                <>
                  <p className={`font-bold ${item.bg.includes("bg-black") ? "text-white" : "text-black"} text-lg tracking-tight`}>{item.label}</p>
                  <p className={`${item.bg.includes("bg-black") ? "text-white/70" : "text-neutral-500"} text-sm mt-1`}>{item.actionText}</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-black tracking-tight mb-1">{item.value}</p>
                  <p className="text-sm font-medium text-neutral-500">{item.label}</p>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
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
              <p className="text-neutral-500 font-medium mb-3">No complaints filed yet.</p>
              <button
                onClick={() => navigate("/file-complaint")}
                className="text-black font-semibold hover:text-neutral-600 transition-colors"
              >
                File a new complaint
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
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-white group-hover:shadow-xs border border-transparent group-hover:border-neutral-200 transition-all shrink-0">
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
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                      status?.toLowerCase() === "rejected"
                        ? "bg-rose-100 text-rose-700"
                        : status === "Submitted" || status === "Pending"
                          ? "bg-neutral-100 text-neutral-700"
                          : status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {status || "Submitted"}
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
