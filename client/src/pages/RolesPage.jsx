import { useState } from "react";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

const permissionOptions = [
  "manage_users",
  "manage_roles",
  "activate_users",
  "manage_guests",
  "assign_pcs",
  "manage_pcs",
  "manage_layout",
  "manage_events",
  "manage_feedback_forms",
  "trigger_feedback",
  "view_reports",
  "export_reports",
  "view_audit_logs"
];

export default function RolesPage() {
  const { data, run } = useApi("/roles?limit=50");
  const [form, setForm] = useState({ name: "", description: "", permissions: [] });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    await apiFetch("/roles", {
      method: "POST",
      body: JSON.stringify(form)
    });
    setForm({ name: "", description: "", permissions: [] });
    setMessage("Role created.");
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Roles and Permissions" subtitle="Database-backed RBAC configuration." />
      <Toast message={message} />
      <section className="grid-two">
        <form className="panel" onSubmit={submit}>
          <h2>Create Role</h2>
          <div className="form-grid">
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </label>
            <label>
              Permissions
              <select
                multiple
                value={form.permissions}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    permissions: Array.from(event.target.selectedOptions).map((option) => option.value)
                  }))
                }
              >
                {permissionOptions.map((permission) => (
                  <option key={permission} value={permission}>
                    {permission}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button>Create Role</button>
        </form>
        <div className="panel">
          <h2>Role List</h2>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "description", label: "Description" },
              {
                key: "permissions",
                label: "Permissions",
                render: (row) => row.permissions.join(", ")
              }
            ]}
            rows={data?.items || []}
          />
        </div>
      </section>
    </div>
  );
}
