import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";

const STORAGE_KEY = "campuscare-complaints";

function MyComplaints() {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Broken water fountain", category: "Maintenance", description: "Fountain near cafeteria not working", status: "Pending" },
      { id: 2, title: "WiFi issues in dorm", category: "Infrastructure", description: "No connection in rooms 201-205", status: "Resolved" },
    ];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Maintenance",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }, [complaints]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: Date.now(),
      ...form,
      status: "Pending",
    };
    setComplaints([newComplaint, ...complaints]);
    setForm({ title: "", category: "Maintenance", description: "" });
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-black">My Complaints</h1>
          <p className="text-neutral-500 mt-1">Submit and track your complaints</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus size={20} />
          New Complaint
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white border border-neutral-200 rounded-lg"
        >
          <h3 className="font-semibold text-black mb-4">Submit Complaint</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Brief title for your complaint"
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Safety">Safety</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your complaint in detail"
                rows={4}
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
          {complaints.map(({ id, title, category, description, status }) => (
            <div key={id} className="p-6 hover:bg-neutral-50">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 shrink-0">
                  <FileText size={24} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-black">{title}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status === "Pending"
                          ? "bg-black/10 text-black"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-0.5">{category}</p>
                  {description && (
                    <p className="mt-2 text-neutral-600 text-sm">{description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyComplaints;
