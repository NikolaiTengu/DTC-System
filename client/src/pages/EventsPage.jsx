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
        <form className="panel card create-event-form" onSubmit={submit}>
          <h2>Create Event</h2>
          <div className="form-grid">
            {[
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "date", label: "Date", type: "date" },
              { key: "startTime", label: "Start Time", type: "time" },
              { key: "endTime", label: "End Time", type: "time" },
              { key: "venue", label: "Venue", type: "text" },
              { key: "capacity", label: "Capacity", type: "number" },
              { key: "notes", label: "Notes", type: "textarea" },
            ].map((field) => (
              field.key === "date" ? (
                <div className="field-stack" key={field.key}>
                  <label htmlFor="event-date">{field.label}</label>
                  <input
                    id="event-date"
                    className="input"
                    type="date"
                    value={form[field.key]}
                    onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))}
                  />
                </div>
              ) : (
                <label key={field.key}>
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea className="textarea" value={form[field.key]} onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))} />
                  ) : (
                    <input
                      className="input"
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))}
                    />
                  )}
                </label>
              )
            ))}
            <label>
              Event Type
              <select className="select" value={form.eventType} onChange={(e) => setForm((current) => ({ ...current, eventType: e.target.value }))}>
                <option value="training">Training</option>
                <option value="event">Event</option>
                <option value="seminar">Seminar</option>
              </select>
            </label>
            <label>
              Person In Charge
              <select className="select" value={form.personInChargeUserId} onChange={(e) => setForm((current) => ({ ...current, personInChargeUserId: e.target.value }))}>
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
                <input
                  className="input"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSpeaker();
                    }
                  }}
                />
              </div>
            </label>
          </div>
          <div className="chip-row">
            {form.resourceSpeakers.map((speaker) => (
              <span className="chip" key={speaker.name}>{speaker.name}</span>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">Create Event</button>
          </div>
        </form>
        <div className="panel card">
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
