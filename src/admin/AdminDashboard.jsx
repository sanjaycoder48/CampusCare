import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  AlertTriangle,
  Users,
  ChevronRight,
  ShieldAlert,
  Calendar,
  PackageSearch,
  GraduationCap,
  BookOpen
} from "lucide-react";
import { fetchComplaints, fetchEmergencies } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    Promise.all([fetchComplaints(), fetchEmergencies()]).then(([cData, eData]) => {
      setComplaints(cData || []);
      setEmergencies(eData || []);
    });
  }, []);

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === "Submitted" || c.status === "Pending").length;
  const inProgressComplaints = complaints.filter(c => c.status === "In Progress" || c.status === "Assigned").length;
  const unresolvedEmergencies = emergencies.filter(e => e.status !== "Resolved").length;

  const quickActions = [
    { label: "Complaint Manager", icon: FileText, path: "/admin/complaints", count: totalComplaints },
    { label: "Emergency Dispatch", icon: AlertTriangle, path: "/admin/emergencies", count: unresolvedEmergencies },
    { label: "Events & Clubs", icon: Calendar, path: "/admin/events" },
    { label: "Lost & Found Claims", icon: PackageSearch, path: "/admin/lostfound" },
    { label: "Honours & Minors", icon: GraduationCap, path: "/admin/honours-minors" },
    { label: "Academic Syllabus", icon: BookOpen, path: "/admin/syllabus" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300 border border-indigo-400/20">
            <ShieldAlert size={14} /> Security & Operations Center
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Executive Command</h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
            Monitor real-time student complaints, emergency dispatch queues, degree program applications, and department club events.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Complaints</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalComplaints}</div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Review</span>
          <div className="text-3xl font-extrabold text-amber-700 mt-2">{pendingComplaints}</div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">In Progress / Assigned</span>
          <div className="text-3xl font-extrabold text-indigo-700 mt-2">{inProgressComplaints}</div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Active Emergencies</span>
          <div className="text-3xl font-extrabold text-rose-700 mt-2">{unresolvedEmergencies}</div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map(act => {
          const IconC = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => navigate(act.path)}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 p-6 rounded-[28px] text-left transition-all duration-200 shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
                  <IconC size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{act.label}</h3>
                  {act.count !== undefined && (
                    <span className="text-xs text-slate-400 font-medium">{act.count} active records</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>

      {/* Recent Emergencies Table */}
      <div className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-xs">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Urgent Dispatch Records</h2>
          <button
            onClick={() => navigate("/admin/emergencies")}
            className="m3-button-tonal"
          >
            Dispatch Center <ChevronRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {emergencies.slice(0, 3).map(emerg => (
            <div key={emerg.id} className="p-6 px-8 flex items-center justify-between hover:bg-slate-50/60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{emerg.type} Emergency at {emerg.location}</h4>
                  <p className="text-xs text-slate-500">{emerg.description}</p>
                </div>
              </div>
              <StatusBadge status={emerg.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
