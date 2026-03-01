import { NavLink } from "react-router-dom";
import { Newspaper, BellElectric, ScrollText, Shield } from "lucide-react";

const navItems = [
  { to: "/", icon: Newspaper, label: "Dashboard" },
  { to: "/emergency-log", icon: BellElectric, label: "Emergency Log" },
  { to: "/complaints", icon: ScrollText, label: "My Complaints" },
];

function Sidebar() {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white text-black border-r border-neutral-200 shrink-0">
      <div className="flex flex-col flex-1 px-4 py-6">
        {/* Logo / Brand */}
        <NavLink to="/" className="flex items-center gap-3 mb-8 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/10 text-black">
            <Shield size={22} strokeWidth={2} />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight">CampusCare</span>
            <p className="text-xs text-neutral-500">Admin Portal</p>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black/10 text-black"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.75} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Section - pushed to bottom */}
        <div className="mt-auto pt-6 border-t border-neutral-200">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition-colors text-left">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-200 text-neutral-700 font-medium text-sm shrink-0">
              JD
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium text-neutral-800 truncate w-full">John Doe</span>
              <span className="text-xs text-neutral-500">Admin</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
