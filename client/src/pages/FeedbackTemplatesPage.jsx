import { useState } from "react";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

export default function FeedbackTemplatesPage() {
  const { data, run } = useApi("/feedback-templates?limit=50");
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
    questions: [{ id: "q1", label: "Overall satisfaction", type: "rating", required: true, order: 1, options: [] }]
  });

  async function submit(event) {
    event.preventDefault();
    await apiFetch("/feedback-templates", {
      method: "POST",
      body: JSON.stringify(form)
    });
    setForm({
      name: "",
      description: "",
      isActive: true,
      questions: [{ id: "q1", label: "Overall satisfaction", type: "rating", required: true, order: 1, options: [] }]
    });
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Feedback Form Builder" subtitle="Manage reusable exit and event feedback templates." />
      <section className="grid-two">
        <form className="panel card" onSubmit={submit}>
          <h2>Create Template</h2>
          <div className="form-grid">
            <label>
              Name
              <input className="input" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
            </label>
            <label>
              Description
              <textarea className="textarea" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
            </label>
          </div>
          <button className="btn btn-primary">Create Template</button>
        </form>
        <div className="panel card">
          <h2>Templates</h2>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "description", label: "Description" },
              { key: "isActive", label: "Status", render: (row) => (row.isActive ? "Active" : "Inactive") },
              { key: "questions", label: "Questions", render: (row) => row.questions.length }
            ]}
            rows={data?.items || []}
          />
        </div>
      </section>
    </div>
  );
}
