import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

const initialForm = {
  title: "",
  description: "",
  eventType: "training",
  date: "",
  startTime: "",
  endTime: "",
  venue: "DICT DTC Room",
  capacity: 30,
  personInChargeUserId: "",
  resourceSpeakers: [],
  status: "scheduled",
  notes: ""
};

export default function EventsPage() {
  const { data, run } = useApi("/events?limit=50");
  const usersApi = useApi("/users?limit=50");
  const [form, setForm] = useState(initialForm);
  const [speakerName, setSpeakerName] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    await apiFetch("/events", {
      method: "POST",
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) })
    });
    setForm(initialForm);
    setMessage("Event created.");
    run();
  }

  function addSpeaker() {
    if (!speakerName) return;
    setForm((current) => ({
      ...current,
      resourceSpeakers: [...current.resourceSpeakers, { name: speakerName, title: "", organization: "", contact: "" }]
    }));
    setSpeakerName("");
  }

  return (
    <div className="page-stack">
      <PageHeader title="Events and Trainings" subtitle="Schedule DTC activities and track participants." />
      <Toast message={message} />
      <section className="grid-two">
        <form className="panel" onSubmit={submit}>
          <h2>Create Event</h2>
          <div className="form-grid">
            {["title", "description", "date", "startTime", "endTime", "venue", "capacity", "notes"].map((field) => (
              <label key={field}>
                {field}
                {field === "description" || field === "notes" ? (
                  <textarea value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} />
                ) : (
                  <input value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} />
                )}
              </label>
            ))}
            <label>
              Event Type
              <select value={form.eventType} onChange={(e) => setForm((current) => ({ ...current, eventType: e.target.value }))}>
                <option value="training">Training</option>
                <option value="event">Event</option>
                <option value="seminar">Seminar</option>
              </select>
            </label>
            <label>
              Person In Charge
              <select value={form.personInChargeUserId} onChange={(e) => setForm((current) => ({ ...current, personInChargeUserId: e.target.value }))}>
                <option value="">Select</option>
                {(usersApi.data?.items || []).map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Resource Speaker
              <div className="inline-row">
                <input value={speakerName} onChange={(e) => setSpeakerName(e.target.value)} />
                <button type="button" className="ghost-button" onClick={addSpeaker}>
                  Add
                </button>
              </div>
            </label>
          </div>
          <div className="chip-row">
            {form.resourceSpeakers.map((speaker) => (
              <span className="chip" key={speaker.name}>{speaker.name}</span>
            ))}
          </div>
          <button>Create Event</button>
        </form>
        <div className="panel">
          <h2>Event List</h2>
          <DataTable
            columns={[
              { key: "title", label: "Title" },
              { key: "date", label: "Date" },
              { key: "eventType", label: "Type" },
              { key: "status", label: "Status" },
              {
                key: "personInChargeUserId",
                label: "Person In Charge",
                render: (row) => row.personInChargeUserId ? `${row.personInChargeUserId.firstName} ${row.personInChargeUserId.lastName}` : "N/A"
              },
              {
                key: "participants",
                label: "Participants",
                render: (row) => <Link to={`/events/${row._id}/participants`}>Manage</Link>
              }
            ]}
            rows={data?.items || []}
          />
        </div>
      </section>
    </div>
  );
}
