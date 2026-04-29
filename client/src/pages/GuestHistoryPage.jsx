import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

export default function GuestHistoryPage() {
  const { data } = useApi("/sessions?limit=100");

  return (
    <div className="page-stack">
      <PageHeader title="Guest History" subtitle="Permanent session history with completed and active visits." />
      <div className="panel">
        <DataTable
          columns={[
            { key: "guest", label: "Guest", render: (row) => row.guestId?.fullName },
            { key: "visitPurpose", label: "Purpose" },
            { key: "sessionStatus", label: "Status" },
            { key: "source", label: "Source" },
            { key: "checkInAt", label: "Check In" },
            { key: "checkOutAt", label: "Check Out" }
          ]}
          rows={data?.items || []}
        />
      </div>
    </div>
  );
}
