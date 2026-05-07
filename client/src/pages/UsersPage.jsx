import { useState } from "react";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  position: "",
  roleIds: []
};

export default function UsersPage() {
  const { data, run } = useApi("/users?limit=50");
  const rolesApi = useApi("/roles?limit=50");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(form)
    });
    setForm(initialForm);
    setMessage("User created.");
    run();
  }

  async function toggleActive(user) {
    await apiFetch(`/users/${user._id}/active`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !user.isActive })
    });
    setMessage("User status updated.");
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Employees and Users" subtitle="Create staff accounts and control access." />
      <Toast message={message} />
      <section className="grid-two">
        <form className="panel card users-form" onSubmit={submit}>
          <h2>Create User</h2>
          <div className="form-grid">
            {[
              { key: "firstName", label: "First Name" },
              { key: "lastName", label: "Last Name" },
              { key: "email", label: "Email" },
              { key: "password", label: "Password" },
              { key: "phone", label: "Phone" },
              { key: "position", label: "Position" },
            ].map((field) => (
              <label key={field.key}>
                {field.label}
                <input
                  className="input"
                  type={field.key === "password" ? "password" : "text"}
                  value={form[field.key]}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              </label>
            ))}
            <label>
              Roles
              <select
                className="select"
                multiple
                value={form.roleIds}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    roleIds: Array.from(event.target.selectedOptions).map((option) => option.value)
                  }))
                }
              >
                {(rolesApi.data?.items || []).map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button className="btn btn-primary">Create User</button>
        </form>
        <div className="panel card">
          <h2>User Directory</h2>
          <DataTable
            columns={[
              { key: "email", label: "Email" },
              {
                key: "fullName",
                label: "Name",
                render: (row) => `${row.firstName} ${row.lastName}`
              },
              {
                key: "roles",
                label: "Roles",
                render: (row) => row.roleIds?.map((role) => role.name).join(", ")
              },
              { key: "isActive", label: "Status", render: (row) => (row.isActive ? "Active" : "Inactive") },
              {
                key: "actions",
                label: "Action",
                render: (row) => (
                  <button className="btn btn-ghost" onClick={() => toggleActive(row)}>
                    {row.isActive ? "Deactivate" : "Activate"}
                  </button>
                )
              }
            ]}
            rows={data?.items || []}
          />
        </div>
      </section>
    </div>
  );
}
