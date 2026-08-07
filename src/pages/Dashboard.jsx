import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, AlertTriangle, PenLine, Clock, ChevronRight,
  Calendar, Package, GraduationCap, BookOpen,
  ArrowUpRight, TrendingUp, Activity, Bell
} from "lucide-react";
import { fetchComplaints, fetchEmergencies } from "../api";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins || 1}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    Promise.all([fetchComplaints(), fetchEmergencies()]).then(([c, e]) => {
      setComplaints(c || []);
      setEmergencies(e || []);
    });
  }, []);

  const pending = complaints.filter(c => c.status === "Pending" || c.status === "Submitted").length;
  const inProgress = complaints.filter(c => c.status === "In Progress" || c.status === "Assigned" || c.status === "Under Review").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const sosCount = emergencies.filter(e => e.reportedBy === "user").length;
  const recentComplaints = complaints.slice(0, 5);

  const statusColor = (s) => {
    const st = (s || "").toLowerCase();
    if (st === "resolved") return "bg-emerald-50 text-emerald-700";
    if (st === "in progress" || st === "assigned" || st === "under review") return "bg-blue-50 text-blue-700";
    if (st === "rejected" || st === "closed") return "bg-rose-50 text-rose-700";
    return "bg-neutral-100 text-neutral-600";
  };

  const priorityDot = (p) => {
    const pr = (p || "").toLowerCase();
    if (pr === "urgent" || pr === "high") return "bg-rose-500";
    if (pr === "medium") return "bg-amber-400";
    return "bg-neutral-300";
  };

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-[1360px] mx-auto space-y-6">

      {/* ─── Welcome ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight leading-tight">
            {getGreeting()}, Student
          </h1>
        </div>
        <button
          onClick={() => navigate("/file-complaint")}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
        >
          <PenLine size={14} /> New Report
        </button>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => navigate("/complaints")} className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-200 group-hover:text-neutral-500 transition-colors" />
          </div>
          <p className="text-3xl font-extrabold text-black tracking-tighter">{pending}</p>
          <p className="text-[11px] font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Pending</p>
        </button>

        <button onClick={() => navigate("/complaints")} className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-200 group-hover:text-neutral-500 transition-colors" />
          </div>
          <p className="text-3xl font-extrabold text-black tracking-tighter">{inProgress}</p>
          <p className="text-[11px] font-semibold text-neutral-400 mt-1 uppercase tracking-wider">In Progress</p>
        </button>

        <button onClick={() => navigate("/complaints")} className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-200 group-hover:text-neutral-500 transition-colors" />
          </div>
          <p className="text-3xl font-extrabold text-black tracking-tighter">{resolved}</p>
          <p className="text-[11px] font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Resolved</p>
        </button>

        <button onClick={() => navigate("/file-complaint")} className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:shadow-lg hover:border-rose-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-200 group-hover:text-rose-400 transition-colors" />
          </div>
          <p className="text-3xl font-extrabold text-black tracking-tighter">{sosCount}</p>
          <p className="text-[11px] font-semibold text-neutral-400 mt-1 uppercase tracking-wider">SOS Alerts</p>
        </button>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Events & Clubs", icon: Calendar, path: "/events", color: "text-violet-600 bg-violet-50" },
          { label: "Lost & Found", icon: Package, path: "/lostfound", color: "text-amber-600 bg-amber-50" },
          { label: "Honours & Minors", icon: GraduationCap, path: "/honours-minors", color: "text-purple-600 bg-purple-50" },
          { label: "Academic Syllabus", icon: BookOpen, path: "/syllabus", color: "text-sky-600 bg-sky-50" },
          { label: "My Complaints", icon: FileText, path: "/complaints", color: "text-neutral-700 bg-neutral-100" },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="group flex flex-col items-center gap-3 py-5 bg-white border border-neutral-200/60 rounded-2xl hover:shadow-md hover:border-neutral-300 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-200`}>
              <item.icon size={18} />
            </div>
            <span className="text-[11px] font-bold text-neutral-600 group-hover:text-black transition-colors">{item.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Recent Complaints ─── */}
      <div className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-black tracking-tight">Recent Activity</h2>
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-black transition-colors group"
          >
            View all <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText size={20} className="text-neutral-300" />
            </div>
            <p className="text-sm text-neutral-400 font-medium mb-4">No complaints filed yet</p>
            <button
              onClick={() => navigate("/file-complaint")}
              className="px-5 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              File your first report
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {recentComplaints.map(({ id, title, category, status, priority, createdAt }) => (
              <div
                key={id}
                onClick={() => navigate("/complaints")}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-neutral-50/60 transition-colors cursor-pointer group"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot(priority)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black truncate group-hover:text-neutral-700">{title}</p>
                  <p className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5 mt-0.5">
                    {category} <span className="text-neutral-200">·</span> <Clock size={10} /> {formatTimeAgo(createdAt)}
                  </p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusColor(status)}`}>
                  {status || "Submitted"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
