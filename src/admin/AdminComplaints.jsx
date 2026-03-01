import { useState, useEffect } from "react";
import { FileText, ImageIcon, CheckCircle2, Clock } from "lucide-react";

const STORAGE_KEY = "campuscare-complaints";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString();
}

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setComplaints(saved ? JSON.parse(saved) : []);
    } catch {
      setComplaints([]);
    }
  }, []);

  const updateStatus = (id, status) => {
    setComplaints((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status } : c));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const pending = complaints.filter((c) => c.status === "Pending");
  const resolved = complaints.filter((c) => c.status !== "Pending");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Complaints</h1>
        <p className="text-neutral-500 mt-1">
          View and manage complaints submitted by students. Status updates are reflected in the Student Portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <p className="text-sm text-neutral-500">Pending complaints</p>
          <p className="text-3xl font-semibold text-black mt-1">{pending.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <p className="text-sm text-neutral-500">Resolved / closed</p>
          <p className="text-3xl font-semibold text-black mt-1">{resolved.length}</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-black">All complaints</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {complaints.length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-500 text-sm">
              No complaints have been submitted yet.
            </div>
          ) : (
            complaints.map(
              ({ id, title, category, description, status, createdAt, photos = [] }) => (
                <div key={id} className="p-6 hover:bg-neutral-50">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 shrink-0">
                          <FileText size={24} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-black truncate">{title}</h3>
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
                            <p className="mt-2 text-neutral-600 text-sm whitespace-pre-line">
                              {description}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(createdAt)}
                          </p>
                        </div>
                      </div>
                      {photos.length > 0 && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <div className="flex items-center gap-2">
                            <ImageIcon size={18} className="text-neutral-500" />
                            <span className="text-sm text-neutral-500">
                              {photos.length} photo proof(s)
                            </span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {photos.slice(0, 4).map((src, i) => (
                              <img
                                key={i}
                                src={src}
                                alt={`Proof ${i + 1}`}
                                className="w-16 h-16 object-cover rounded border border-neutral-200"
                              />
                            ))}
                            {photos.length > 4 && (
                              <div className="w-16 h-16 rounded border border-neutral-200 bg-neutral-100 flex items-center justify-center text-xs text-neutral-600">
                                +{photos.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(id, "Resolved")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-100"
                        >
                          <CheckCircle2 size={14} />
                          Mark resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;

