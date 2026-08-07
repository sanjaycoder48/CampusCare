import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  AlertTriangle,
  Users,
  ChevronRight,
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
    <div className="p-5 md:p-8 lg:p-10 max-w-[1360px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight leading-tight">
            Admin Overview
          </h1>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="text-3xl font-extrabold text-black tracking-tighter">{totalComplaints}</div>
          <span className="text-[11px] font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Total Complaints</span>
        </div>
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="text-3xl font-extrabold text-amber-600 tracking-tighter">{pendingComplaints}</div>
          <span className="text-[11px] font-semibold text-amber-600 mt-1 uppercase tracking-wider">Pending Review</span>
        </div>
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="text-3xl font-extrabold text-blue-600 tracking-tighter">{inProgressComplaints}</div>
          <span className="text-[11px] font-semibold text-blue-600 mt-1 uppercase tracking-wider">In Progress / Assigned</span>
        </div>
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
          <div className="text-3xl font-extrabold text-rose-600 tracking-tighter">{unresolvedEmergencies}</div>
          <span className="text-[11px] font-semibold text-rose-600 mt-1 uppercase tracking-wider">Active Emergencies</span>
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
              className="bg-white border border-neutral-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center transition-all">
                  <IconC size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base group-hover:text-black transition-colors">{act.label}</h3>
                  {act.count !== undefined && (
                    <span className="text-xs text-neutral-400 font-medium">{act.count} active records</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>

      {/* Recent Emergencies Table */}
      <div className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-black tracking-tight">Recent Urgent Dispatch Records</h2>
          <button
            onClick={() => navigate("/admin/emergencies")}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-black transition-colors group"
          >
            Dispatch Center <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="divide-y divide-neutral-50">
          {emergencies.slice(0, 3).map(emerg => (
            <div key={emerg.id} className="p-6 px-8 flex items-center justify-between hover:bg-neutral-50/60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{emerg.type} Emergency at {emerg.location}</h4>
                  <p className="text-xs text-neutral-500">{emerg.description}</p>
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
