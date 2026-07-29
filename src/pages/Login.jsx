import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Sparkles } from "lucide-react";

const ROLE_KEY = "campuscare-role";
const ID_KEY = "campuscare-userId";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const existingRole = localStorage.getItem(ROLE_KEY);
    if (existingRole === "admin") {
      navigate("/admin", { replace: true });
    } else if (existingRole === "student") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(ID_KEY, userId.trim());
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100/80 px-4 select-none">
      <div className="w-full max-w-[440px] bg-white border border-slate-200/80 rounded-[32px] p-8 sm:p-10 shadow-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">CampusCare</h1>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Material 3 Campus Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">University ID *</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter Student or Admin ID"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Access Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                  role === "student"
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <User size={22} className={role === "student" ? "text-white" : "text-slate-400"} />
                <span className="text-xs font-bold">Student Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                  role === "admin"
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Shield size={22} className={role === "admin" ? "text-white" : "text-slate-400"} />
                <span className="text-xs font-bold">Admin Portal</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="m3-button-filled w-full py-4 text-sm"
            >
              Continue to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
