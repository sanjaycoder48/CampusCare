import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, ImagePlus, X, Sparkles, AlertCircle } from "lucide-react";
import { createComplaint } from "../api";

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
      reply += "I've filled the form on the right. Add photos if you have any, and submit when ready.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComplaint = {
      ...form,
      photos: photos.map((p) => p.data),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    await createComplaint(newComplaint);
    navigate("/complaints");
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight flex items-center gap-3">
          <div className="flex items-center justify-center p-2 bg-black text-white rounded-xl">
            <Sparkles size={24} />
          </div>
          File a Complaint
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">Chat with our AI assistant to quickly draft a detailed, actionable complaint.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* AI Assistant Column */}
        <div className="lg:col-span-5 flex flex-col h-[500px] lg:h-[600px] bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <span className="font-bold text-black tracking-tight block">AI Assistant</span>
              <span className="text-xs text-neutral-500 font-medium">Ready to help</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div
                  className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-black text-white rounded-br-sm shadow-md shadow-black/10"
                      : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-sm shadow-sm"
                    }`}
                >
                  {msg.content.replace(/\*\*(.*?)\*\*/g, (match, p1) => `<strong class="font-bold">${p1}</strong>`)}
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white border border-neutral-200 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-neutral-100">
            <div className="flex items-end gap-2 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-200 focus-within:ring-2 focus-within:ring-black/5 focus-within:border-neutral-300 transition-all">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendToAI();
                  }
                }}
                placeholder="Describe your issue here..."
                rows={1}
                className="flex-1 max-h-32 px-4 py-3 bg-transparent text-sm text-black placeholder-neutral-400 resize-none outline-none overflow-y-auto"
                style={{ minHeight: "44px" }}
              />
              <button
                type="button"
                onClick={handleSendToAI}
                disabled={!userInput.trim()}
                className="shrink-0 p-3 bg-black text-white rounded-xl hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors"
              >
                <Send size={18} className={userInput.trim() ? "translate-x-0.5" : ""} />
              </button>
            </div>
            <p className="text-[10px] text-center text-neutral-400 mt-2 font-medium uppercase tracking-wider">Press Enter to send</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-neutral-100"></div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Final Details</span>
            <div className="flex-1 h-px bg-neutral-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-black tracking-tight flex items-center gap-1.5">
                  Complaint Title
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Broken Water Fountain in Library"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-black text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-black tracking-tight">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300 transition-all font-medium appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-black tracking-tight flex items-center gap-1.5">
                Detailed Description
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide all relevant details, specific location, and how long this has been an issue..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-black text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300 transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-black tracking-tight">
                  Attachments (Optional)
                </label>
                <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-md">
                  {photos.length} / {MAX_PHOTOS}
                </span>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 border-dashed rounded-2xl">
                <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoAdd} className="hidden" />

                {photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 mb-3">
                      <ImagePlus size={20} className="text-neutral-400" />
                    </div>
                    <p className="text-sm font-semibold text-black mb-1">Upload visual proofs</p>
                    <p className="text-xs text-neutral-500 max-w-[200px] mb-4">Adding photos helps authorities resolve issues faster.</p>
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
                        <img src={photo.data} alt="Proof" className="w-24 h-24 object-cover rounded-xl border border-neutral-200 shadow-sm" />
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
              <div className="flex items-start gap-1.5 text-xs text-neutral-500">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>Images only. Max 500KB per file. Avoid taking photos of sensitive or private areas.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 transition-all active:scale-[0.98]"
              >
                Submit Official Complaint
              </button>
              <button
                type="button"
                onClick={() => navigate("/complaints")}
                className="px-6 py-3.5 bg-white border border-neutral-200 text-black rounded-xl font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FileComplaint;
