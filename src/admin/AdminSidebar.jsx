import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Activity, Shield, LogOut, ExternalLink, Calendar, Package, X, DoorOpen, Coffee } from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/complaints", icon: FileText, label: "Complaints" },
  { to: "/admin/emergencies", icon: Activity, label: "Emergencies" },
  { to: "/admin/events", icon: Calendar, label: "Manage Events" },
  { to: "/admin/lostfound", icon: Package, label: "Lost & Found" },
  { to: "/admin/facilities", icon: DoorOpen, label: "Manage Facilities" },
  { to: "/admin/cafeteria", icon: Coffee, label: "Cafeteria & Mess" },
];

function AdminSidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("campuscare-role");
    localStorage.removeItem("campuscare-userId");
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-full sm:w-72 h-dvh md:h-screen bg-[#fafafa] text-black border-r border-neutral-200/60 shrink-0 select-none overflow-y-auto">
      <div className="flex flex-col flex-1 px-5 py-8">
        {/* Logo / Brand */}
        <div className="flex items-center justify-between mb-10 px-3 group">
          <NavLink to="/admin" onClick={onClose} className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-black text-white shadow-md shadow-black/10 transition-transform duration-300 group-hover:scale-105">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight leading-none block mb-1">CampusCare</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Admin Portal</p>
            </div>
          </NavLink>
          {onClose && (
            <button onClick={onClose} className="p-2 md:hidden hover:bg-neutral-200/60 rounded-xl text-neutral-500 hover:text-black transition-colors" aria-label="Close menu">
              <X size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                  ? "bg-white text-black shadow-sm ring-1 ring-neutral-200/60 translate-x-1"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100/80 hover:translate-x-0.5"
                }`
              }
            >
              <Icon size={20} strokeWidth={2} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-8 border-t border-neutral-200/60 space-y-2">
          {/* User Section */}
          <div className="flex items-center gap-3 w-full px-3 py-3 rounded-xl bg-neutral-100/50 text-left mt-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 font-bold text-sm shrink-0 border-2 border-white shadow-sm">
              AD
            </div>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-bold text-neutral-800 truncate w-full tracking-tight">Admin User</span>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Administrator</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-rose-100/80 text-neutral-400 hover:text-rose-600 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut size={18} strokeWidth={2} className="translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

