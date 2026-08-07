import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, AlertTriangle, Upload, X, ShieldAlert, Sparkles } from "lucide-react";
import { createComplaint, createEmergency } from "../api.js";
import Toast from "../components/Toast.jsx";

const DEPARTMENTS = [
  "Maintenance",
  "Electrical",
  "Plumbing",
  "IT Support",
  "Hostel",
  "Cafeteria",
  "Library",
  "Transport",
  "Security",
  "Academic"
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function FileComplaint() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("complaint");

  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "Maintenance",
    priority: "Medium",
    location: "",
    description: "",
    photos: []
  });

  const [emergencyForm, setEmergencyForm] = useState({
    type: "Medical",
    location: "",
    description: "",
    photos: []
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePhotoAdd = (e, targetForm, setTargetForm) => {
    const files = Array.from(e.target.files || []);
    if (targetForm.photos.length + files.length > 4) {
      showToast("error", "Maximum 4 photos allowed.");
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setTargetForm(prev => ({ ...prev, photos: [...prev.photos, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index, setTargetForm) => {
    setTargetForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintForm.title || !complaintForm.location || !complaintForm.description) {
      showToast("error", "Please fill in all required complaint fields.");
      return;
    }

    setLoading(true);
    const created = await createComplaint(complaintForm);
    setLoading(false);

    if (created) {
      showToast("success", "Complaint filed successfully!");
      setTimeout(() => navigate("/complaints"), 1200);
    }
  };

  const handleSubmitEmergency = async (e) => {
    e.preventDefault();
    if (!emergencyForm.location || !emergencyForm.description) {
      showToast("error", "Please specify emergency location and description.");
      return;
    }

    setLoading(true);
    const created = await createEmergency({
      ...emergencyForm,
      time: new Date().toISOString(),
      status: "Reported",
      reportedBy: "user"
    });
    setLoading(false);

    if (created) {
      showToast("error", "EMERGENCY ALERT DISPATCHED TO CAMPUS SECURITY!");
      setTimeout(() => navigate("/complaints"), 1200);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
          {mode === "emergency" ? (
            <AlertTriangle className="w-8 h-8 text-rose-600 animate-pulse" />
          ) : (
            <MessageSquare className="w-8 h-8 text-neutral-900" />
          )}
          Issue & Emergency Reporting
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          File standard department complaints or broadcast immediate campus emergency alerts.
        </p>
      </div>

      {/* Segmented Button Group */}
      <div className="flex bg-neutral-100 p-1.5 rounded-full border border-neutral-200">
        <button
          type="button"
          onClick={() => setMode("complaint")}
          className={`flex-1 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === "complaint"
              ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Standard Complaint
        </button>
        <button
          type="button"
          onClick={() => setMode("emergency")}
          className={`flex-1 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === "emergency"
              ? "bg-rose-600 text-white shadow-md shadow-rose-200"
              : "text-rose-700 hover:bg-rose-100/50"
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Urgent Emergency Alert
        </button>
      </div>

      {/* STANDARD COMPLAINT FORM */}
      {mode === "complaint" ? (
        <form onSubmit={handleSubmitComplaint} className="m3-card p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Complaint Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Broken AC dripping water in Library Silent Study Zone"
              value={complaintForm.title}
              onChange={e => setComplaintForm({ ...complaintForm, title: e.target.value })}
              className="w-full p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Department Category *</label>
              <select
                value={complaintForm.category}
                onChange={e => setComplaintForm({ ...complaintForm, category: e.target.value })}
                className="w-full p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Priority Level *</label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setComplaintForm({ ...complaintForm, priority: p })}
                    className={`py-2.5 rounded-full text-xs font-bold transition-all ${
                      complaintForm.priority === p
                        ? p === "Urgent" || p === "High"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Specific Campus Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Block C, 3rd Floor Washroom / Hostel B Room 204"
              value={complaintForm.location}
              onChange={e => setComplaintForm({ ...complaintForm, location: e.target.value })}
              className="w-full p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Detailed Issue Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the issue, severity, and any hazards..."
              value={complaintForm.description}
              onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })}
              className="w-full p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Photo Attachments (Max 4)</label>
            <div className="flex items-center gap-3 flex-wrap">
              {complaintForm.photos.map((img, idx) => (
                <div key={idx} className="w-20 h-20 bg-neutral-100 rounded-2xl overflow-hidden relative group border border-neutral-200">
                  <img src={img} alt="attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx, setComplaintForm)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {complaintForm.photos.length < 4 && (
                <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50 flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-neutral-900 transition-colors">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => handlePhotoAdd(e, complaintForm, setComplaintForm)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/complaints")}
              className="m3-button-tonal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="m3-button-filled"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      ) : (
        /* EMERGENCY ALERT FORM */
        <form onSubmit={handleSubmitEmergency} className="m3-card border-2 border-rose-300 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-semibold leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>Emergency alerts notify campus security and quick response teams immediately. For immediate life-threatening situations, call emergency services (911/112) first.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Emergency Type *</label>
              <select
                value={emergencyForm.type}
                onChange={e => setEmergencyForm({ ...emergencyForm, type: e.target.value })}
                className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Medical">Medical Emergency</option>
                <option value="Security">Security Incident / Tailgating</option>
                <option value="Fire">Fire / Chemical Hazard</option>
                <option value="Other">Other Urgent Situation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Exact Campus Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Football Ground / Chemistry Lab 2"
                value={emergencyForm.location}
                onChange={e => setEmergencyForm({ ...emergencyForm, location: e.target.value })}
                className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Brief Incident Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the urgent situation quickly..."
              value={emergencyForm.description}
              onChange={e => setEmergencyForm({ ...emergencyForm, description: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Emergency Photo Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Photo Proof (Optional, only if safe)</label>
            <div className="flex items-center gap-3 flex-wrap">
              {emergencyForm.photos.map((img, idx) => (
                <div key={idx} className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden relative group border border-slate-200">
                  <img src={img} alt="emergency attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx, setEmergencyForm)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {emergencyForm.photos.length < 3 && (
                <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 flex flex-col items-center justify-center cursor-pointer text-rose-600 hover:bg-rose-100 transition-colors">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => handlePhotoAdd(e, emergencyForm, setEmergencyForm)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="m3-button-tonal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-md shadow-rose-200 transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> {loading ? "Broadcasting..." : "Broadcast Emergency Alert"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
