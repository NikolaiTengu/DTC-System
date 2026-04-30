import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/global.css";
import "./components/shared/Button.css";
import "./components/shared/Card.css";
import "./components/shared/Badge.css";
import "./components/shared/Input.css";
import "./components/shared/Table.css";
import "./components/admin/Sidebar.css";
import "./components/admin/Dashboard.css";
import "./components/admin/PCInventory.css";
import "./components/admin/RoomLayout.css";
import "./components/kiosk/KioskLayout.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
