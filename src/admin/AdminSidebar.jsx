import { NavLink, useNavigate } from "react";
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
  ShieldAlert
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
    <aside className="w-64 bg-neutral-900 text-white flex flex-col h-screen sticky top-0 shadow-lg">
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
            A
          </div>
          <div>
            <div className="font-bold text-white leading-tight">CampusCare</div>
            <div className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Admin Portal</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`
              }
            >
              <IconComp size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut size={18} />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
}
