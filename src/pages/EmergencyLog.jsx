import { useState, useEffect } from "react";
import { Plus, AlertCircle, MapPin, Clock } from "lucide-react";

const STORAGE_KEY = "campuscare-emergencies";

function EmergencyLog() {
  const [emergencies, setEmergencies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 1, type: "Medical", location: "Building A, Room 101", description: "Student fainted", time: new Date().toISOString(), status: "Active" },
      { id: 2, type: "Security", location: "Main Gate", description: "Suspicious activity reported", time: new Date().toISOString(), status: "Resolved" },
    ];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "Medical",
    location: "",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emergencies));
  }, [emergencies]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmergency = {
      id: Date.now(),
      ...form,
      time: new Date().toISOString(),
      status: "Active",
    };
    setEmergencies([newEmergency, ...emergencies]);
    setForm({ type: "Medical", location: "", description: "" });
    setShowForm(false);
  };

  const updateStatus = (id, status) => {
    setEmergencies(emergencies.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-black">Emergency Log</h1>
          <p className="text-neutral-500 mt-1">Track and manage campus emergencies</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus size={20} />
          Log Emergency
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white border border-neutral-200 rounded-lg"
        >
          <h3 className="font-semibold text-black mb-4">New Emergency Report</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black"
              >
                <option value="Medical">Medical</option>
                <option value="Security">Security</option>
                <option value="Fire">Fire</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Building B, Floor 2"
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the emergency"
                rows={3}
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {emergencies.map(({ id, type, location, description, time, status }) => (
            <div key={id} className="p-6 hover:bg-neutral-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 shrink-0">
                    <AlertCircle size={24} className="text-black" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-black">{type}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === "Active"
                            ? "bg-black/10 text-black"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-neutral-600 text-sm">
                      <MapPin size={14} />
                      {location}
                    </div>
                    {description && (
                      <p className="mt-2 text-neutral-600 text-sm">{description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-neutral-500 text-xs">
                      <Clock size={12} />
                      {new Date(time).toLocaleString()}
                    </div>
                  </div>
                </div>
                {status === "Active" && (
                  <button
                    onClick={() => updateStatus(id, "Resolved")}
                    className="px-3 py-1.5 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 shrink-0"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmergencyLog;
