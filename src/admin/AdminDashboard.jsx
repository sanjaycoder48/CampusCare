import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, Users } from "lucide-react";

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
  const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;
  const totalEmergencies = emergencies.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Admin Overview</h1>
        <p className="text-neutral-500 mt-1">
          High-level view of complaints and emergencies coming from the user portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate("/admin/complaints")}
          className="flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-lg text-left hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 text-black">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-black">{totalComplaints}</p>
            <p className="text-sm text-neutral-500">Total complaints</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/complaints")}
          className="flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-lg text-left hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 text-black">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-black">{pendingComplaints}</p>
            <p className="text-sm text-neutral-500">Pending complaints</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/emergencies")}
          className="flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-lg text-left hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 text-black">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-black">{totalEmergencies}</p>
            <p className="text-sm text-neutral-500">Reported emergencies</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

