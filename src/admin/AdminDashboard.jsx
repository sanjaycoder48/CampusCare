import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, PenTool } from "lucide-react";

const COMPLAINTS_KEY = "campuscare-complaints";
const EMERGENCIES_KEY = "campuscare-emergencies";

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    try {
      setComplaints(JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || "[]"));
      setEmergencies(JSON.parse(localStorage.getItem(EMERGENCIES_KEY) || "[]"));
    } catch {
      setComplaints([]);
      setEmergencies([]);
    }
  }, []);

  const totalComplaints = complaints.length;
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "Pending" || c.status === "Under Review" || c.status === "In Progress" || !c.status
  ).length;
  const totalEmergencies = emergencies.length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Admin Overview</h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">
          Overview of complaints and emergencies reported by campus students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate("/admin/complaints")}
          className="group flex flex-col p-6 bg-white border border-neutral-200/60 rounded-3xl text-left hover:border-black/10 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
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
          className="group flex flex-col p-6 bg-white border border-neutral-200/60 rounded-3xl text-left hover:border-black/10 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
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
          className="group flex flex-col p-6 bg-white border border-neutral-200/60 rounded-3xl text-left hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-rose-100 transition-colors duration-500"></div>
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
    </div>
  );
}

export default AdminDashboard;

