import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Calendar,
  PackageSearch,
  GraduationCap,
  BookOpen,
  LogOut,
  X,
  Sparkles
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("campuscare-role");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/events", label: "Events & Clubs", icon: Calendar },
    { path: "/lostfound", label: "Lost & Found", icon: PackageSearch },
    { path: "/honours-minors", label: "Honours & Minors", icon: GraduationCap },
    { path: "/syllabus", label: "Academic Syllabus", icon: BookOpen },
    { path: "/complaints", label: "My Complaints", icon: ClipboardList },
    { path: "/file-complaint", label: "Report Issue / Emergency", icon: FilePlus }
  ];

  return (
    <aside className="w-72 bg-slate-50/90 backdrop-blur-md border-r border-slate-200/80 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* M3 Header */}
      <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-tight tracking-tight">CampusCare</div>
            <div className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider">Student Portal</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* M3 Navigation Drawer List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-4 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Main Menu
        </div>
        {navItems.map(item => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === "/"}
              className={({ isActive }) =>
                `m3-nav-item transition-all duration-200 ${
                  isActive
                    ? "m3-nav-item-active shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`
              }
            >
              <IconComp size={20} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* M3 Footer Actions */}
      <div className="p-4 border-t border-slate-200/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold text-rose-700 hover:bg-rose-100/70 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}