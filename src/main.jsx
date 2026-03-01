import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmergencyLog from "./pages/EmergencyLog.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="emergency-log" element={<EmergencyLog />} />
          <Route path="complaints" element={<MyComplaints />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
