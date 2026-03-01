import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ImagePlus, X } from "lucide-react";

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
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black flex items-center gap-2">
            <AlertTriangle size={24} className="text-black" />
            Report Emergency
          </h1>
          <p className="text-neutral-500 mt-1">Report urgent campus issues. Add photo proofs if safe to do so.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4"
        >
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

          <div>
            <label className="block text-sm font-medium text-black mb-2">Photo proofs (optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoAdd}
              className="hidden"
            />
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative group">
                  <img
                    src={photo.data}
                    alt="Proof"
                    className="w-20 h-20 object-cover rounded-lg border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 text-neutral-400"
                >
                  <ImagePlus size={24} />
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Up to {MAX_PHOTOS} photos. Only add if it&apos;s safe.</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportEmergency;
