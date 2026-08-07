import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, AlertTriangle, PenLine, Clock, ChevronRight,
  Calendar, Package, GraduationCap, BookOpen,
  ArrowUpRight, TrendingUp, Activity, Bell, ShieldCheck,
  CheckCircle2, Sparkles, PlusCircle
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

  const statusBadgeStyle = (s) => {
    const st = (s || "").toLowerCase();
    if (st === "resolved") return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    if (st === "in progress" || st === "assigned" || st === "under review") return "bg-sky-50 text-sky-700 border-sky-200/80";
    if (st === "rejected" || st === "closed") return "bg-rose-50 text-rose-700 border-rose-200/80";
    return "bg-amber-50 text-amber-800 border-amber-200/80";
  };

  const priorityBadge = (p) => {
    const pr = (p || "").toLowerCase();
    if (pr === "urgent" || pr === "high") {
      return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Urgent</span>;
    }
    if (pr === "medium") {
      return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Medium</span>;
    }
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>Normal</span>;
  };

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-[1360px] mx-auto space-y-7 animate-in fade-in duration-300">

      {/* ─── Hero Welcome Banner ─── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-neutral-900/10 border border-neutral-800">
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-neutral-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/90 border border-neutral-700/80 text-[11px] font-semibold text-neutral-300 backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Campus Operational • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {getGreeting()}, Student 👋
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed">
              Track your support tickets, stay informed on campus events, report emergencies, and access academic services seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/file-complaint")}
              className="flex items-center gap-2 px-5 py-3 bg-white text-neutral-950 text-xs font-extrabold rounded-xl hover:bg-neutral-100 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              <PenLine size={15} /> Submit New Report
            </button>
            <button
              onClick={() => navigate("/file-complaint")}
              className="flex items-center gap-2 px-4 py-3 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl border border-rose-500/30 transition-all duration-200 active:scale-[0.98]"
            >
              <AlertTriangle size={15} /> Emergency SOS
            </button>
          </div>
        </div>
      </div>

      {/* ─── Metrics Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Card */}
        <button 
          onClick={() => navigate("/complaints")} 
          className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 text-left hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Bell size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Needs Action
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">{pending}</p>
            <p className="text-xs font-semibold text-neutral-500">Pending Requests</p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-medium text-neutral-400 group-hover:text-neutral-700 transition-colors">
            <span>Awaiting Review</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* In Progress Card */}
        <button 
          onClick={() => navigate("/complaints")} 
          className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 text-left hover:shadow-xl hover:border-sky-200 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Activity size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
              Active
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">{inProgress}</p>
            <p className="text-xs font-semibold text-neutral-500">In Progress</p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-medium text-neutral-400 group-hover:text-neutral-700 transition-colors">
            <span>Staff Assigned</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Resolved Card */}
        <button 
          onClick={() => navigate("/complaints")} 
          className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 text-left hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <TrendingUp size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Completed
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">{resolved}</p>
            <p className="text-xs font-semibold text-neutral-500">Resolved Issues</p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-medium text-neutral-400 group-hover:text-neutral-700 transition-colors">
            <span>Closed Tickets</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* SOS Card */}
        <button 
          onClick={() => navigate("/file-complaint")} 
          className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 text-left hover:shadow-xl hover:border-rose-200 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <AlertTriangle size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
              Urgent
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">{sosCount}</p>
            <p className="text-xs font-semibold text-neutral-500">SOS Incident Logs</p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-medium text-neutral-400 group-hover:text-rose-600 transition-colors">
            <span>Security Dispatch</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* ─── Quick Access Navigation Bar ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Campus Services & Resources</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Events & Clubs", desc: "Discover activities", icon: Calendar, path: "/events", iconBg: "bg-violet-50 text-violet-600 border-violet-100" },
            { label: "Lost & Found", desc: "Reclaim lost items", icon: Package, path: "/lostfound", iconBg: "bg-amber-50 text-amber-600 border-amber-100" },
            { label: "Honours & Minors", desc: "Degree paths", icon: GraduationCap, path: "/honours-minors", iconBg: "bg-purple-50 text-purple-600 border-purple-100" },
            { label: "Academic Syllabus", desc: "Curriculum guides", icon: BookOpen, path: "/syllabus", iconBg: "bg-sky-50 text-sky-600 border-sky-100" },
            { label: "My Complaints", desc: "Status tracking", icon: FileText, path: "/complaints", iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="group flex flex-col p-4 bg-white border border-neutral-200/80 rounded-2xl text-left hover:shadow-lg hover:border-neutral-300 transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon size={19} />
                </div>
                <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-neutral-700 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 group-hover:text-black transition-colors">{item.label}</p>
                <p className="text-[11px] text-neutral-400 font-normal mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Recent Complaints Section ─── */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 tracking-tight">Recent Activity Log</h2>
              <p className="text-[11px] text-neutral-400 font-medium">Your latest submitted complaints and status changes</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black bg-white px-3.5 py-1.5 rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            View All Logs <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-4">
            <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-400">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-neutral-800">No active complaints logged</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">You currently have zero pending reports. If you encounter an issue on campus, click below to report.</p>
            </div>
            <button
              onClick={() => navigate("/file-complaint")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <PlusCircle size={15} /> Report New Issue
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentComplaints.map(({ id, title, category, status, priority, createdAt, location }) => (
              <div
                key={id}
                onClick={() => navigate("/complaints")}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-neutral-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-1">
                    {priorityBadge(priority)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900 truncate group-hover:text-black transition-colors">{title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium mt-1 flex-wrap">
                      <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">{category}</span>
                      {location && (
                        <>
                          <span className="text-neutral-300">•</span>
                          <span className="text-neutral-500">{location}</span>
                        </>
                      )}
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock size={11} /> {formatTimeAgo(createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${statusBadgeStyle(status)}`}>
                    {status || "Submitted"}
                  </span>
                  <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
