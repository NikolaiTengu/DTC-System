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
  const [permissionPage, setPermissionPage] = useState(0);
  const permissionPageSize = 5;
  const permissionPageCount = Math.max(1, Math.ceil(permissionOptions.length / permissionPageSize));
  const visiblePermissions = permissionOptions.slice(
    permissionPage * permissionPageSize,
    permissionPage * permissionPageSize + permissionPageSize
  );

  function togglePermission(permission) {
    setForm((current) => {
      const isSelected = current.permissions.includes(permission);
      return {
        ...current,
        permissions: isSelected
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission]
      };
    });
  }

  function previousPermissionPage() {
    setPermissionPage((current) => Math.max(0, current - 1));
  }

  function nextPermissionPage() {
    setPermissionPage((current) => Math.min(permissionPageCount - 1, current + 1));
  }

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
        <form className="panel card roles-form" onSubmit={submit}>
          <h2>Create Role</h2>
          <div className="form-grid">
            <label>
              Name
              <input className="input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label>
              Description
              <textarea
                className="textarea"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </label>
            <label className="permissions-field">
              Permissions
              <div className="permission-table-wrap table-wrapper">
                <table className="permission-table table">
                  <thead>
                    <tr>
                      <th>Permission</th>
                      <th>Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePermissions.map((permission) => (
                      <tr key={permission}>
                        <td className="permission-name-cell">{permission}</td>
                        <td className="permission-toggle-cell">
                          <input
                            type="checkbox"
                            checked={form.permissions.includes(permission)}
                            onChange={() => togglePermission(permission)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="permission-table-footer">
                  <span className="toolbar-meta">Page {permissionPage + 1} of {permissionPageCount}</span>
                  <div className="button-group">
                    <button className="btn btn-ghost" type="button" onClick={previousPermissionPage} disabled={permissionPage === 0}>
                      Prev
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={nextPermissionPage}
                      disabled={permissionPage >= permissionPageCount - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">Create Role</button>
          </div>
        </form>
        <div className="panel card">
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
