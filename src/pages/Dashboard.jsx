import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, AlertTriangle, PenLine, Clock, ChevronRight,
  Calendar, Package, GraduationCap, BookOpen, Sparkles,
  ArrowUpRight, TrendingUp
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
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;
  const recentComplaints = complaints.slice(0, 4);

  const statusColor = (s) => {
    const status = (s || "").toLowerCase();
    if (status === "resolved") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (status === "in progress" || status === "assigned") return "bg-blue-50 text-blue-700 border border-blue-200";
    if (status === "rejected") return "bg-rose-50 text-rose-700 border border-rose-200";
    return "bg-neutral-100 text-neutral-700 border border-neutral-200";
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

      {/* ── Hero Welcome Card ── */}
      <div className="relative bg-black text-white rounded-3xl p-8 md:p-10 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -right-8 -bottom-20 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute left-1/2 -bottom-10 w-32 h-32 bg-white/[0.02] rounded-full" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[11px] font-semibold text-white/80 mb-4 border border-white/10">
            <Sparkles size={12} className="text-amber-300" />
            Campus Services Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, Student
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-lg leading-relaxed">
            Track complaints, register for events, explore academic programs, and manage lost items — all in one place.
          </p>
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/complaints")}
          className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:border-neutral-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <FileText size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-black transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-black tracking-tight">{myPendingComplaints}</div>
          <div className="text-[11px] font-medium text-neutral-400 mt-0.5">Pending Issues</div>
        </button>

        <button
          onClick={() => navigate("/file-complaint")}
          className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:border-rose-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-rose-500 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-black tracking-tight">{myReportedEmergencies}</div>
          <div className="text-[11px] font-medium text-neutral-400 mt-0.5">SOS Alerts</div>
        </button>

        <button
          onClick={() => navigate("/complaints")}
          className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-black tracking-tight">{resolvedComplaints}</div>
          <div className="text-[11px] font-medium text-neutral-400 mt-0.5">Resolved</div>
        </button>

        <button
          onClick={() => navigate("/events")}
          className="group bg-white border border-neutral-200/60 rounded-2xl p-5 text-left hover:border-neutral-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Calendar size={18} />
            </div>
            <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-black transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-black tracking-tight">{complaints.length}</div>
          <div className="text-[11px] font-medium text-neutral-400 mt-0.5">Total Cases</div>
        </button>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div>
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Events & Clubs", icon: Calendar, path: "/events", accent: "hover:border-violet-300 hover:bg-violet-50/50" },
            { label: "Lost & Found", icon: Package, path: "/lostfound", accent: "hover:border-amber-300 hover:bg-amber-50/50" },
            { label: "Honours & Minors", icon: GraduationCap, path: "/honours-minors", accent: "hover:border-purple-300 hover:bg-purple-50/50" },
            { label: "Syllabus", icon: BookOpen, path: "/syllabus", accent: "hover:border-sky-300 hover:bg-sky-50/50" },
            { label: "File Issue", icon: PenLine, path: "/file-complaint", accent: "hover:border-neutral-400 hover:bg-neutral-900 hover:text-white" },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`group flex flex-col items-center justify-center gap-2.5 py-6 bg-white border border-neutral-200/60 rounded-2xl transition-all duration-200 ${item.accent}`}
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon size={20} className="text-neutral-600 group-hover:text-current" />
              </div>
              <span className="text-xs font-bold text-neutral-700 group-hover:text-current">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Complaints ── */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 sm:px-8 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-black tracking-tight">Recent Complaints</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">Live status across campus departments</p>
          </div>
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-black transition-colors group px-3 py-1.5 rounded-lg hover:bg-neutral-50"
          >
            View all
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="divide-y divide-neutral-100">
          {recentComplaints.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={22} className="text-neutral-300" />
              </div>
              <p className="text-neutral-400 font-medium text-sm mb-3">No complaints filed yet.</p>
              <button
                onClick={() => navigate("/file-complaint")}
                className="px-5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                File your first complaint
              </button>
            </div>
          ) : (
            recentComplaints.map(({ id, title, category, status, createdAt }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-4 hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                onClick={() => navigate("/complaints")}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-black group-hover:text-white transition-all shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-black text-sm tracking-tight group-hover:text-neutral-700 transition-colors">{title}</p>
                    <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5 font-medium">
                      <span className="text-neutral-500">{category}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                      <span className="flex items-center gap-1"><Clock size={10} /> {formatTimeAgo(createdAt)}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 pl-14 sm:pl-0">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${statusColor(status)}`}>
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
