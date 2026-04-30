import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import { useApi } from "../hooks/useApi";

export default function DashboardPage() {
  const { data, loading } = useApi("/reports/dashboard");

  return (
    <div className="page-stack page-content">
      <PageHeader title="Dashboard" subtitle="Live DTC room operations overview." />
      {loading ? <div className="panel">Loading dashboard...</div> : null}
      {data ? (
        <>
          <section className="stats-grid metric-grid">
            <StatCard label="Active Guests" value={data.activeGuests} />
            <StatCard label="Checked Out Today" value={data.checkedOutToday} />
            <StatCard label="Active PC Sessions" value={data.activePcSessions} />
            <StatCard label="Available PCs" value={data.availablePcs} />
            <StatCard label="Occupied PCs" value={data.occupiedPcs} />
            <StatCard label="Offline / Maintenance" value={data.offlineMaintenancePcs} />
            <StatCard label="Today's Events" value={data.todaysEvents.length} />
            <StatCard label="Today's Participants" value={data.todaysParticipantCount} />
          </section>
          <section className="grid-two">
            <div className="panel">
              <h2>Today's Events</h2>
              <DataTable
                columns={[
                  { key: "title", label: "Title" },
                  { key: "date", label: "Date" },
                  { key: "status", label: "Status" }
                ]}
                rows={data.todaysEvents}
              />
            </div>
            <div className="panel">
              <h2>Recent Feedback</h2>
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
