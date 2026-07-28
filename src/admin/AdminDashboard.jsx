import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, PenTool, Calendar, GraduationCap, BookOpen, Package } from "lucide-react";
import { fetchComplaints, fetchEmergencies } from "../api";

function AdminDashboard() {
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

  const totalComplaints = complaints.length;
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "Submitted" || c.status === "Pending" || c.status === "Under Review" || c.status === "In Progress" || c.status === "Assigned"
  ).length;
  const totalEmergencies = emergencies.length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Admin Overview</h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">
          Campus operations, department activities, complaints resolution, and academic degree portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/admin/complaints")}
          className="group flex flex-col p-6 bg-white border border-neutral-200 rounded-3xl text-left hover:border-black/10 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-100/80 text-black mb-5 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
            <FileText size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-4xl font-bold text-black tracking-tight mb-1">{totalComplaints}</p>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Total Complaints</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/complaints")}
          className="group flex flex-col p-6 bg-white border border-neutral-200 rounded-3xl text-left hover:border-black/10 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <PenTool size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-4xl font-bold text-black tracking-tight mb-1">{inProgressComplaints}</p>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Active Complaints</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/emergencies")}
          className="group flex flex-col p-6 bg-white border border-neutral-200 rounded-3xl text-left hover:border-rose-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div className="relative">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mb-5 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
              <AlertTriangle size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-4xl font-bold text-black tracking-tight mb-1">{totalEmergencies}</p>
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Reported Emergencies</p>
            </div>
          </div>
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight pt-4">Management Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => navigate("/admin/events")}
          className="group flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-2xl text-left hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Calendar size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-black tracking-tight leading-tight">Events & Clubs</p>
            <p className="text-xs font-semibold text-neutral-500 mt-0.5">Department activities</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/honours-minors")}
          className="group flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-2xl text-left hover:border-purple-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shrink-0">
            <GraduationCap size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-black tracking-tight leading-tight">Honours & Minors</p>
            <p className="text-xs font-semibold text-neutral-500 mt-0.5">Approve applications</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/syllabus")}
          className="group flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-2xl text-left hover:border-sky-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shrink-0">
            <BookOpen size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-black tracking-tight leading-tight">Syllabus Manager</p>
            <p className="text-xs font-semibold text-neutral-500 mt-0.5">Edit 5-unit courses</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/lostfound")}
          className="group flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-2xl text-left hover:border-amber-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Package size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-black tracking-tight leading-tight">Lost & Found</p>
            <p className="text-xs font-semibold text-neutral-500 mt-0.5">Claim verification</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
