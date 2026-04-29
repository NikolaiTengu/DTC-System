import { useState } from "react";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

export default function ReportsPage() {
  const [tab, setTab] = useState("guests");
  const guests = useApi("/reports/guests");
  const pcs = useApi("/reports/pcs");
  const events = useApi("/reports/events");
  const feedback = useApi("/reports/feedback");

  const views = {
    guests: {
      title: "Guest Sessions",
      rows: guests.data?.items || [],
      columns: [
        { key: "guest", label: "Guest", render: (row) => row.guestId?.fullName },
        { key: "visitPurpose", label: "Purpose" },
        { key: "sessionStatus", label: "Status" },
        { key: "source", label: "Source" }
      ]
    },
    pcs: {
      title: "PC Usage",
      rows: pcs.data?.items || [],
      columns: [
        { key: "_id", label: "PC ID" },
        { key: "sessionCount", label: "Sessions" },
        { key: "totalHours", label: "Hours", render: (row) => row.totalHours?.toFixed?.(2) || row.totalHours }
      ]
    },
    events: {
      title: "Event Summary",
      rows: events.data?.items || [],
      columns: [
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" },
        { key: "participantCount", label: "Participants" }
      ]
    },
    feedback: {
      title: "Feedback Summary",
      rows: feedback.data?.items || [],
      columns: [
        { key: "submittedAt", label: "Submitted" },
        { key: "submittedByType", label: "Type" },
        { key: "answers", label: "Answers", render: (row) => Object.keys(row.answers || {}).length }
      ]
    }
  };

  const current = views[tab];

  return (
    <div className="page-stack">
      <PageHeader title="Reports" subtitle="Operational and analytics views with export-ready backend endpoints." />
      <div className="tab-row">
        {Object.keys(views).map((key) => (
          <button key={key} className={tab === key ? "tab-active" : "ghost-button"} onClick={() => setTab(key)}>
            {views[key].title}
          </button>
        ))}
      </div>
      <div className="panel">
        <h2>{current.title}</h2>
        <DataTable columns={current.columns} rows={current.rows} />
      </div>
    </div>
  );
}
