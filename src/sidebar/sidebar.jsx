import SidebarItem from "./SidebarItem";
import { sidebarMenu } from "./sidebarData";

function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white shadow-md p-4">
      <div className="mb-8 text-xl font-bold">
        CampusCare
      </div>

      <div className="space-y-2">
        {sidebarMenu.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            title={item.title}
            path={item.path}
          />
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;