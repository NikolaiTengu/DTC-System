import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";
import AppLayout from "./layouts/AppLayout";
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const RolesPage = lazy(() => import("./pages/RolesPage"));
const GuestRegistrationPage = lazy(() => import("./pages/GuestRegistrationPage"));
const SelfRegistrationPage = lazy(() => import("./pages/SelfRegistrationPage"));
const ActiveGuestsPage = lazy(() => import("./pages/ActiveGuestsPage"));
const GuestHistoryPage = lazy(() => import("./pages/GuestHistoryPage"));
const PcsPage = lazy(() => import("./pages/PcsPage"));
const LayoutPage = lazy(() => import("./pages/LayoutPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventParticipantsPage = lazy(() => import("./pages/EventParticipantsPage"));
const FeedbackTemplatesPage = lazy(() => import("./pages/FeedbackTemplatesPage"));
const FeedbackResponsesPage = lazy(() => import("./pages/FeedbackResponsesPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const AuditLogsPage = lazy(() => import("./pages/AuditLogsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function LoadingScreen({ label = "Loading interface" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at top, rgba(144, 238, 144, 0.22), transparent 35%), linear-gradient(180deg, #f7f4ee 0%, #f1eadf 100%)",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "min(420px, 100%)",
          p: 4,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(12px)",
          textAlign: "center",
        }}
      >
        <CircularProgress
          size={54}
          thickness={4}
          sx={{ color: "success.main", mb: 2.5 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Please wait while the client finishes loading.
        </Typography>
        <LinearProgress
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: "rgba(46, 107, 62, 0.12)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              background: "linear-gradient(90deg, #8fd19e 0%, #b9e3c1 100%)",
            },
          }}
        />
      </Box>
    </Box>
  );
}

function ProtectedRoute({ children }) {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped) return <LoadingScreen label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading modules" />}>
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
    </Suspense>
  );
}
