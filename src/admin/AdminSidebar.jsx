import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Activity, Shield } from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/complaints", icon: FileText, label: "Complaints" },
  { to: "/admin/emergencies", icon: Activity, label: "Emergencies" },
];

function AdminSidebar() {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white text-black border-r border-neutral-200 shrink-0">
      <div className="flex flex-col flex-1 px-4 py-6">
        {/* Logo / Brand */}
        <NavLink to="/admin" className="flex items-center gap-3 mb-8 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/10 text-black">
            <Shield size={22} strokeWidth={2} />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight">CampusCare</span>
            <p className="text-xs text-neutral-500">For Administrators</p>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

        {/* Footer / Open user portal separately */}
        <div className="mt-auto pt-6 border-t border-neutral-200">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-600"
          >
            <span>↩</span>
            <span className="text-neutral-800">Student Portal</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

