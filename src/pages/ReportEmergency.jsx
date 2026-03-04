import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ImagePlus, X, AlertCircle } from "lucide-react";

const STORAGE_KEY = "campuscare-emergencies";
const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 500 * 1024;

function ReportEmergency() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [emergencies, setEmergencies] = useState([]);
  const [form, setForm] = useState({
    type: "Medical",
    location: "",
    description: "",
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setEmergencies(saved ? JSON.parse(saved) : []);
  }, []);

  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > MAX_PHOTOS) {
      alert(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_PHOTO_SIZE) {
        alert(`${file.name} is too large. Max 500KB per photo.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((p) => [...p, { name: file.name, data: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmergency = {
      id: Date.now(),
      ...form,
      photos: photos.map((p) => p.data),
      time: new Date().toISOString(),
      status: "Reported",
      reportedBy: "user",
    };
    const updated = [newEmergency, ...emergencies];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigate("/");
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight flex items-center gap-3">
          <div className="flex items-center justify-center p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
          Report Emergency
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">Immediately alert campus authorities to urgent situations. Add photo proofs only if it is completely safe to do so.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-rose-200/50 rounded-3xl shadow-sm p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-8 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-rose-800 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0 text-rose-500" />
          <p>For immediate life-threatening situations, always call emergency services (911) first before using this form.</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-black tracking-tight">
                Emergency Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all font-medium appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="Medical">Medical Emergency</option>
                <option value="Security">Security Incident</option>
                <option value="Fire">Fire / Smoke</option>
                <option value="Other">Other Urgent Issue</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-black tracking-tight flex items-center gap-1.5">
                Exact Location
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Building B, Floor 2, Near Lab 3"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-black text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-black tracking-tight flex items-center gap-1.5">
              Brief Description
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Quickly describe what is happening..."
              rows={4}
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-black text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-black tracking-tight">
                Photo Proofs (Optional)
              </label>
              <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-md">
                {photos.length} / {MAX_PHOTOS}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 border-dashed rounded-2xl">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoAdd}
                className="hidden"
              />

              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 mb-3">
                    <ImagePlus size={20} className="text-neutral-400" />
                  </div>
                  <p className="text-sm font-semibold text-black mb-1">Add visual context</p>
                  <p className="text-xs text-neutral-500 max-w-[200px] mb-4">Only take photos if you are currently in a safe location.</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-semibold text-black hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-sm"
                  >
                    Select Files
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={photo.data}
                        alt="Proof"
                        className="w-24 h-24 object-cover rounded-xl border border-neutral-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-100 scale-90 shadow-md"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 bg-white border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-neutral-400 gap-1"
                    >
                      <ImagePlus size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/20 transition-all active:scale-[0.98]"
            >
              Submit Emergency Alert
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3.5 bg-white border border-neutral-200 text-black rounded-xl font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReportEmergency;
