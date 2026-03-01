import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "./AdminSidebar.jsx";

function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("campuscare-role");
    if (!role) {
      navigate("/login", { replace: true });
    } else if (role === "student") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

