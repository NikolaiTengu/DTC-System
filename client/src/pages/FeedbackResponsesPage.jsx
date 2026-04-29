import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

export default function FeedbackResponsesPage() {
  const { data } = useApi("/feedback-responses?limit=100");

  return (
    <div className="page-stack">
      <PageHeader title="Feedback Responses" subtitle="Review collected guest and participant feedback." />
      <div className="panel">
        <DataTable
          columns={[
            { key: "template", label: "Template", render: (row) => row.templateId?.name || "Unknown" },
            { key: "submittedAt", label: "Submitted" },
            { key: "submittedByType", label: "Submitted By" },
            { key: "answers", label: "Answer Count", render: (row) => Object.keys(row.answers || {}).length }
          ]}
          rows={data?.items || []}
        />
      </div>
    </div>
  );
}
