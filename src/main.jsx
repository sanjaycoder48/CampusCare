import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FileComplaint from "./pages/FileComplaint.jsx";
import ReportEmergency from "./pages/ReportEmergency.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import Login from "./pages/Login.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminComplaints from "./admin/AdminComplaints.jsx";
import AdminEmergencies from "./admin/AdminEmergencies.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="file-complaint" element={<FileComplaint />} />
          <Route path="report-emergency" element={<ReportEmergency />} />
          <Route path="complaints" element={<MyComplaints />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="emergencies" element={<AdminEmergencies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
