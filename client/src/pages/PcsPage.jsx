import { useState } from "react";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

const initialForm = {
  pcCode: "",
  displayName: "",
  roomZone: "",
  locationLabel: "",
  status: "available",
  sortOrder: 0
};

export default function PcsPage() {
  const { data, run } = useApi("/pcs?limit=50");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    await apiFetch("/pcs", {
      method: "POST",
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) })
    });
    setForm(initialForm);
    setMessage("PC added.");
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="PC Inventory" subtitle="Manage workstation metadata, availability, and layout placement." />
      <Toast message={message} />
      <section className="grid-two">
        <form className="panel" onSubmit={submit}>
          <h2>Add Workstation</h2>
          <div className="form-grid">
            {["pcCode", "displayName", "roomZone", "locationLabel", "sortOrder"].map((field) => (
              <label key={field}>
                {field}
                <input value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} />
              </label>
            ))}
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}>
                {["available", "occupied", "maintenance", "inactive", "pulled_out", "offline"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button>Add PC</button>
        </form>
        <div className="panel">
          <h2>Registered PCs</h2>
          <DataTable
            columns={[
              { key: "pcCode", label: "Code" },
              { key: "displayName", label: "Display Name" },
              { key: "roomZone", label: "Zone" },
              { key: "status", label: "Status" },
              { key: "sortOrder", label: "Order" },
              { key: "kioskSecret", label: "Kiosk Secret" }
            ]}
            rows={data?.items || []}
          />
        </div>
      </section>
    </div>
  );
}
