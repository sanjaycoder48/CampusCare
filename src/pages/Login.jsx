import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield } from "lucide-react";

const ROLE_KEY = "campuscare-role";
const ID_KEY = "campuscare-userId";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center text-black font-semibold">
            CC
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black">CampusCare</h1>
            <p className="text-xs text-neutral-500">Choose how you want to sign in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Student ID or Admin ID"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-black placeholder-neutral-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Sign in as</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
                  role === "student"
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                <User size={16} />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
                  role === "admin"
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                <Shield size={16} />
                Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

