import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

export default function AuditLogsPage() {
  const { data } = useApi("/audit-logs?limit=100");

  return (
    <div className="page-stack">
      <PageHeader title="Audit Logs" subtitle="Trace user activity and major system actions." />
      <div className="panel">
        <DataTable
          columns={[
            { key: "createdAt", label: "Timestamp" },
            { key: "actorName", label: "Actor" },
            { key: "module", label: "Module" },
            { key: "action", label: "Action" },
            { key: "targetId", label: "Target" }
          ]}
          rows={data?.items || []}
        />
      </div>
    </div>
  );
}
