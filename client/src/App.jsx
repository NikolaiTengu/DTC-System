import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import GuestRegistrationPage from "./pages/GuestRegistrationPage";
import SelfRegistrationPage from "./pages/SelfRegistrationPage";
import ActiveGuestsPage from "./pages/ActiveGuestsPage";
import GuestHistoryPage from "./pages/GuestHistoryPage";
import PcsPage from "./pages/PcsPage";
import LayoutPage from "./pages/LayoutPage";
import EventsPage from "./pages/EventsPage";
import EventParticipantsPage from "./pages/EventParticipantsPage";
import FeedbackTemplatesPage from "./pages/FeedbackTemplatesPage";
import FeedbackResponsesPage from "./pages/FeedbackResponsesPage";
import ReportsPage from "./pages/ReportsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedRoute({ children }) {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped) return <div className="center-message">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/guest-register" element={<SelfRegistrationPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="guests/register" element={<GuestRegistrationPage />} />
        <Route path="guests/active" element={<ActiveGuestsPage />} />
        <Route path="guests/history" element={<GuestHistoryPage />} />
        <Route path="pcs" element={<PcsPage />} />
        <Route path="layout" element={<LayoutPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:eventId/participants" element={<EventParticipantsPage />} />
        <Route path="feedback/templates" element={<FeedbackTemplatesPage />} />
        <Route path="feedback/responses" element={<FeedbackResponsesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
