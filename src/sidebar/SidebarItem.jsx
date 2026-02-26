import {NavLink} from "react-router-dom"

function SidebarItem({ icon: Icon, title, path }) {
   return (
     <NavLink
       to={path}
       className={({ isActive }) =>
         `flex items-center gap-3 px-4 py-2 rounded-lg transition-all
         ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`
       }
     >
       <Icon size={20} />
       <span>{title}</span>
     </NavLink>
   );
 }
 
 export default SidebarItem;