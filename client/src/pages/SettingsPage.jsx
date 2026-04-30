import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

export default function SettingsPage() {
  const { data, run } = useApi("/settings");
  const [message, setMessage] = useState("");

  async function save() {
    await apiFetch("/settings", {
      method: "POST",
      body: JSON.stringify({ items: data?.items || [] })
    });
    setMessage("Settings saved.");
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Settings" subtitle="Manage room and application defaults." actions={<button className="btn btn-primary" onClick={save}>Save Settings</button>} />
      {message ? <div className="toast success">{message}</div> : null}
      <div className="panel card">
        {(data?.items || []).map((item) => (
          <label key={item._id || item.key}>
            {item.key}
            <textarea
              className="textarea"
              value={JSON.stringify(item.value, null, 2)}
              onChange={(event) => {
                const nextValue = event.target.value;
                item.value = nextValue;
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
