import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Calendar,
  PackageSearch,
  GraduationCap,
  BookOpen,
  LogOut,
  X,
  Shield
} from "lucide-react";

export default function AdminSidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("campuscare-role");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/events", label: "Events & Clubs", icon: Calendar },
    { path: "/admin/lostfound", label: "Lost & Found", icon: PackageSearch },
    { path: "/admin/honours-minors", label: "Honours & Minors", icon: GraduationCap },
    { path: "/admin/syllabus", label: "Syllabus Manager", icon: BookOpen },
    { path: "/admin/complaints", label: "Complaints Manager", icon: ClipboardList },
    { path: "/admin/emergencies", label: "Emergency Dispatch", icon: AlertTriangle }
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-100 flex flex-col h-screen sticky top-0 z-40 select-none shadow-xl">
      {/* M3 Dark Drawer Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-950">
            <Shield size={20} />
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight tracking-tight">CampusCare</div>
            <div className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">Admin Portal</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-4 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Management Controls
        </div>
        {navItems.map(item => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <IconComp size={20} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Exit Button */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </aside>
  );
}
