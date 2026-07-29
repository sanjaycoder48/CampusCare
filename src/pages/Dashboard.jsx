import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, PenLine, Clock, ChevronRight, Calendar, Package, GraduationCap, BookOpen, Sparkles } from "lucide-react";
import { fetchComplaints, fetchEmergencies } from "../api";
import StatusBadge from "../components/StatusBadge";

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
      bg: "bg-indigo-50/60 border border-indigo-100",
      iconBg: "bg-indigo-600 text-white"
    },
    {
      label: "Emergencies Reported",
      value: String(myReportedEmergencies),
      icon: AlertTriangle,
      onClick: () => navigate("/file-complaint"),
      bg: "bg-rose-50/60 border border-rose-100",
      iconBg: "bg-rose-600 text-white"
    },
    {
      label: "Events & Clubs",
      icon: Calendar,
      action: true,
      actionText: "View department activities",
      onClick: () => navigate("/events"),
      bg: "bg-slate-900 text-white",
      iconBg: "bg-indigo-500 text-white"
    },
    {
      label: "Honours & Minors",
      icon: GraduationCap,
      action: true,
      actionText: "Specialization tracks",
      onClick: () => navigate("/honours-minors"),
      bg: "bg-white border border-slate-200/80",
      iconBg: "bg-purple-100 text-purple-700"
    },
    {
      label: "Academic Syllabus",
      icon: BookOpen,
      action: true,
      actionText: "5-unit course directory",
      onClick: () => navigate("/syllabus"),
      bg: "bg-white border border-slate-200/80",
      iconBg: "bg-sky-100 text-sky-700"
    },
    {
      label: "Lost & Found",
      icon: Package,
      action: true,
      actionText: "Report & claim items",
      onClick: () => navigate("/lostfound"),
      bg: "bg-white border border-slate-200/80",
      iconBg: "bg-amber-100 text-amber-800"
    },
    {
      label: "File New Issue / Alert",
      icon: PenLine,
      action: true,
      actionText: "Submit complaint or SOS",
      onClick: () => navigate("/file-complaint"),
      bg: "bg-indigo-600 text-white md:col-span-2 lg:col-span-1 shadow-md shadow-indigo-200",
      iconBg: "bg-white/20 text-white"
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* M3 Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/15">
            <Sparkles size={14} /> Material 3 Portal Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back, Student</h1>
          <p className="text-sm md:text-base text-indigo-100/80 max-w-2xl leading-relaxed">
            Monitor department issues, check academic syllabus, apply for Honours degrees, and view upcoming campus events.
          </p>
        </div>
      </div>

      {/* M3 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(item => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`group flex items-center gap-5 p-6 rounded-[28px] text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${item.bg}`}
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs ${item.iconBg}`}>
              <item.icon size={26} strokeWidth={2} />
            </div>
            <div>
              {item.action ? (
                <>
                  <p className={`font-bold text-lg tracking-tight ${item.bg.includes("text-white") ? "text-white" : "text-slate-900"}`}>{item.label}</p>
                  <p className={`text-xs mt-1 font-medium ${item.bg.includes("text-white") ? "text-slate-300" : "text-slate-500"}`}>{item.actionText}</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5">{item.value}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Recent Complaints Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-xs">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Complaints & Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live operational tracking status across campus services</p>
          </div>
          <button
            onClick={() => navigate("/complaints")}
            className="m3-button-tonal"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentComplaints.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium mb-3">No complaints filed yet.</p>
              <button
                onClick={() => navigate("/file-complaint")}
                className="m3-button-filled"
              >
                File a new complaint
              </button>
            </div>
          ) : (
            recentComplaints.map(({ id, title, category, status, createdAt }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                onClick={() => navigate("/complaints")}
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                      <span className="font-semibold text-slate-700">{category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {formatTimeAgo(createdAt)}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <StatusBadge status={status} />
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
