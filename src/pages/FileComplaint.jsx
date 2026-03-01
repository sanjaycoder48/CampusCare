import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, ImagePlus, X, Sparkles } from "lucide-react";

const STORAGE_KEY = "campuscare-complaints";
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 500 * 1024;

function getAISuggestions(text) {
  const lower = text.toLowerCase();
  let category = "Other";
  const keywords = {
    Maintenance: ["broken", "leak", "repair", "fountain", "water", "ac", "heating", "light", "door", "window", "toilet"],
    Infrastructure: ["wifi", "internet", "network", "connection", "electricity", "power"],
    Safety: ["unsafe", "hazard", "danger", "dark", "lighting", "security", "lock"],
  };
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      category = cat;
      break;
    }
  }
  const words = text.trim().split(/\s+/).filter(Boolean);
  const title = words.length > 0
    ? words.slice(0, Math.min(8, words.length)).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "";
  return { category, title, refined: text.trim() ? `${text.trim()}.` : "" };
}

function FileComplaint() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Describe the issue you're facing on campus, and I'll help you draft a clear complaint. Mention the location, what's wrong, and how long it's been happening." },
  ]);
  const [form, setForm] = useState({
    title: "",
    category: "Maintenance",
    description: "",
  });
  const [photos, setPhotos] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendToAI = () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", content: userInput };
    setMessages((m) => [...m, userMsg]);
    setUserInput("");
    setIsTyping(true);
    setTimeout(() => {
      const { category, title, refined } = getAISuggestions(userInput);
      setForm((f) => ({ ...f, category, title: title || f.title, description: refined || f.description }));
      let reply = category !== "Other" ? `I suggest categorizing it as **${category}**. ` : "";
      reply += "I've filled the form. Add photos and submit when ready.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 800);
  };

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
      reader.onload = () => setPhotos((p) => [...p, { name: file.name, data: reader.result }]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index) => setPhotos((p) => p.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newComplaint = {
      id: Date.now(),
      ...form,
      photos: photos.map((p) => p.data),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newComplaint, ...saved]));
    navigate("/complaints");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black flex items-center gap-2">
          <Sparkles size={24} className="text-black" />
          File a Complaint
        </h1>
        <p className="text-neutral-500 mt-1">Use AI to draft your complaint and add photo proofs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col h-[420px]">
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center gap-2 bg-black/5">
            <Bot size={20} className="text-black" />
            <span className="font-medium text-black">AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-black text-white" : "bg-neutral-100 text-black"}`}>
                  {msg.content.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 px-4 py-2 rounded-lg text-sm text-neutral-500">Thinking...</div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendToAI()}
                placeholder="Describe your issue..."
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400"
              />
              <button type="button" onClick={handleSendToAI} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="font-semibold text-black mb-4">Your Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Brief title (AI can suggest)"
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black">
                <option value="Maintenance">Maintenance</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Safety">Safety</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail" rows={4} required className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Photo proofs</label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoAdd} className="hidden" />
              <div className="flex flex-wrap gap-2">
                {photos.map((photo, i) => (
                  <div key={i} className="relative group">
                    <img src={photo.data} alt="Proof" className="w-20 h-20 object-cover rounded-lg border border-neutral-200" />
                    <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 text-neutral-400">
                    <ImagePlus size={24} />
                  </button>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">Up to {MAX_PHOTOS} photos. Max 500KB each. Camera capture on mobile.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800">Submit Complaint</button>
              <button type="button" onClick={() => navigate("/complaints")} className="px-4 py-2 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FileComplaint;
