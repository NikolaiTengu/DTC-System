import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WorkstationPage from "./pages/WorkstationPage";
import "./styles.css";
import "../../client/src/styles/tokens.css";
import "../../client/src/components/kiosk/KioskLayout.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<WorkstationPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
