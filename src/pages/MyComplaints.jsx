import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, ImageIcon } from "lucide-react";

const STORAGE_KEY = "campuscare-complaints";

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setComplaints(saved ? JSON.parse(saved) : []);
    } catch {
      setComplaints([]);
    }
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-black">My Complaints</h1>
          <p className="text-neutral-500 mt-1">Track your submitted complaints and photo proofs</p>
        </div>
        <button
          onClick={() => navigate("/file-complaint")}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus size={20} />
          File New Complaint
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 mb-2">No complaints yet</p>
              <button
                onClick={() => navigate("/file-complaint")}
                className="text-black font-medium hover:underline"
              >
                File your first complaint with AI assistance
              </button>
            </div>
          ) : (
            complaints.map(({ id, title, category, description, status, photos = [] }) => (
              <div key={id} className="p-6 hover:bg-neutral-50">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
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
                  {photos.length > 0 && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={18} className="text-neutral-500" />
                        <span className="text-sm text-neutral-500">{photos.length} photo proof(s)</span>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyComplaints;
