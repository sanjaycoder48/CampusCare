import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FileComplaint from "./pages/FileComplaint.jsx";
import ReportEmergency from "./pages/ReportEmergency.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="file-complaint" element={<FileComplaint />} />
          <Route path="report-emergency" element={<ReportEmergency />} />
          <Route path="complaints" element={<MyComplaints />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
