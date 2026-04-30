import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { apiFetch } from "../api/http";
import { useApi } from "../hooks/useApi";

export default function ActiveGuestsPage() {
  const { data, run } = useApi("/sessions/active");

  async function checkout(id) {
    await apiFetch(`/sessions/${id}/checkout`, {
      method: "POST",
      body: JSON.stringify({ triggerFeedback: true })
    });
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Active Guests" subtitle="Monitor ongoing guest sessions and check them out." />
      <div className="panel card">
        <DataTable
          columns={[
            { key: "guest", label: "Guest", render: (row) => row.guestId?.fullName },
            { key: "visitPurpose", label: "Purpose" },
            { key: "source", label: "Source" },
            { key: "pc", label: "Assigned PC", render: (row) => row.assignedPcId?.displayName || "None" },
            { key: "checkInAt", label: "Check In" },
            {
              key: "actions",
              label: "Action",
              render: (row) => <button className="btn btn-primary" onClick={() => checkout(row._id)}>Check Out</button>
            }
          ]}
          rows={data?.items || []}
        />
      </div>
    </div>
  );
}
