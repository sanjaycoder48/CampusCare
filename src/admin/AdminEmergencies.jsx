import { useState, useEffect } from "react";
import { AlertTriangle, ImageIcon, MapPin, Clock, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "campuscare-emergencies";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString();
}

function AdminEmergencies() {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setEmergencies(saved ? JSON.parse(saved) : []);
    } catch {
      setEmergencies([]);
    }
  }, []);

  const updateStatus = (id, status) => {
    setEmergencies((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, status } : e));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const reportedByUsers = emergencies.filter((e) => e.reportedBy === "user");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Emergencies</h1>
        <p className="text-neutral-500 mt-1">
          Review emergencies reported from the user portal and update their status.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-black">Reported emergencies</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {reportedByUsers.length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-500 text-sm">
              No emergencies reported yet from the user portal.
            </div>
          ) : (
            reportedByUsers.map(
              ({ id, type, location, description, status, time, photos = [] }) => (
                <div key={id} className="p-6 hover:bg-neutral-50">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/10 shrink-0">
                          <AlertTriangle size={24} className="text-black" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-black">{type}</h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                status === "Reported"
                                  ? "bg-black/10 text-black"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-neutral-600 text-sm">
                            <MapPin size={14} />
                            <span className="truncate">{location}</span>
                          </div>
                          {description && (
                            <p className="mt-2 text-neutral-600 text-sm">{description}</p>
                          )}
                          <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(time)}
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
                      {status === "Reported" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(id, "In Progress")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-100"
                        >
                          <CheckCircle2 size={14} />
                          Mark in progress
                        </button>
                      )}
                      {status === "In Progress" && (
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

export default AdminEmergencies;

