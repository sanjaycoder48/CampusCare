import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
import Events from "./pages/Events.jsx";
import LostFound from "./pages/LostFound.jsx";
import Facilities from "./pages/Facilities.jsx";
import Cafeteria from "./pages/Cafeteria.jsx";
import AdminEvents from "./admin/AdminEvents.jsx";
import AdminLostFound from "./admin/AdminLostFound.jsx";

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
          <Route path="events" element={<Events />} />
          <Route path="lostfound" element={<LostFound />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="cafeteria" element={<Cafeteria />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="emergencies" element={<AdminEmergencies />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="lostfound" element={<AdminLostFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <SpeedInsights />
  </StrictMode>
);
