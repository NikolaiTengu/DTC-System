import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import Toast from "../components/Toast";
import { useApi } from "../hooks/useApi";
import {
  GroupsOutlined,
  AssignmentTurnedInOutlined,
  ComputerOutlined,
  EventAvailableOutlined,
  WarningAmberOutlined,
  EventNoteOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/material";

export default function DashboardPage() {
  const { data, loading, error } = useApi("/reports/dashboard");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncTone, setSyncTone] = useState("success");

  useEffect(() => {
    if (data && !loading) {
      setLastSyncedAt(new Date());
    }
  }, [data, loading]);

  useEffect(() => {
    let timer;

    if (loading) {
      setSyncTone("success");
      setSyncMessage("Syncing dashboard data...");
    } else if (error) {
      setSyncTone("error");
      setSyncMessage(error);
    } else if (data) {
      setSyncTone("success");
      setSyncMessage("Dashboard synced.");
      timer = setTimeout(() => setSyncMessage(""), 2500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, error, data]);

  const stats = data
    ? [
        { label: "Active Guests", value: data.activeGuests, icon: <GroupsOutlined fontSize="small" /> },
        { label: "Checked Out Today", value: data.checkedOutToday, icon: <AssignmentTurnedInOutlined fontSize="small" /> },
        { label: "Active PC Sessions", value: data.activePcSessions, icon: <ComputerOutlined fontSize="small" /> },
        { label: "Available PCs", value: data.availablePcs, icon: <EventAvailableOutlined fontSize="small" /> },
        { label: "Occupied PCs", value: data.occupiedPcs, icon: <ComputerOutlined fontSize="small" /> },
        { label: "Offline / Maintenance", value: data.offlineMaintenancePcs, icon: <WarningAmberOutlined fontSize="small" /> },
        { label: "Today's Events", value: data.todaysEvents.length, icon: <EventNoteOutlined fontSize="small" /> },
        { label: "Today's Participants", value: data.todaysParticipantCount, icon: <PeopleAltOutlined fontSize="small" /> },
      ]
    : [];

  const statusChip = (status) => {
    const normalized = String(status || "").toLowerCase();
    const palette = {
      active: { bg: "rgba(26, 63, 143, 0.08)", fg: "#FFFFFF" },
      pending: { bg: "rgba(245, 195, 0, 0.18)", fg: "#FFFFFF" },
      completed: { bg: "rgba(41, 82, 179, 0.08)", fg: "#1A3F8F" },
      cancelled: { bg: "rgba(204, 32, 39, 0.12)", fg: "#8B0000" },
    };
    const colors = palette[normalized] || { bg: "rgba(13, 43, 107, 0.08)", fg: "#0D2B6B" };

    return (
      <Chip
        label={status || "Unknown"}
        size="small"
        sx={{
          height: 28,
          borderRadius: 999,
          bgcolor: colors.bg,
          color: colors.fg,
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "capitalize",
        }}
      />
    );
  };

  return (
    <div className="page-stack page-content">
      <PageHeader title="Dashboard" subtitle="Live DTC room operations overview." />
      {syncMessage ? <Toast message={syncMessage} tone={syncTone} /> : null}
      {data && !loading ? (
        <>
          <section className="stats-grid metric-grid">
            {stats.map((item, index) => (
              <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} delay={index * 0.05} />
            ))}
          </section>
          <section className="grid-two">
            <div className="panel">
              <h2 className="panel-title">Today's Events</h2>
              <DataTable
                columns={[
                  { key: "title", label: "Title" },
                  { key: "date", label: "Date" },
                  {
                    key: "status",
                    label: "Status",
                    render: (row) => statusChip(row.status),
                  },
                ]}
                rows={data.todaysEvents}
              />
            </div>
            <div className="panel">
              <h2 className="panel-title">Recent Feedback</h2>
              <DataTable
                columns={[
                  { key: "submittedAt", label: "Submitted" },
                  { key: "submittedByType", label: "By" },
                  {
                    key: "answers",
                    label: "Answers",
                    render: (row) => Object.keys(row.answers || {}).length
                  }
                ]}
                rows={data.recentFeedback}
              />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
