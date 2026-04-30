import { useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

export default function EventParticipantsPage() {
  const { eventId } = useParams();
  const { data, run } = useApi(`/events/${eventId}/participants`);
  const [form, setForm] = useState({ fullName: "", contactNumber: "", email: "", organization: "" });

  async function submit(event) {
    event.preventDefault();
    await apiFetch("/participants", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        ...form,
        registrationSource: "admin"
      })
    });
    setForm({ fullName: "", contactNumber: "", email: "", organization: "" });
    run();
  }

  async function updateAttendance(id, attendanceStatus) {
    await apiFetch(`/participants/${id}/attendance`, {
      method: "PATCH",
      body: JSON.stringify({ attendanceStatus })
    });
    run();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Event Participants" subtitle="Register participants and manage attendance." />
      <section className="grid-two">
        <form className="panel card" onSubmit={submit}>
          <h2>Register Participant</h2>
          <div className="form-grid">
            {["fullName", "contactNumber", "email", "organization"].map((field) => (
              <label key={field}>
                {field}
                <input className="input" value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} />
              </label>
            ))}
          </div>
          <button className="btn btn-primary">Add Participant</button>
        </form>
        <div className="panel card">
          <h2>Participant List</h2>
          <DataTable
            columns={[
              { key: "fullName", label: "Name", render: (row) => row.participantSnapshot.fullName },
              { key: "registrationSource", label: "Source" },
              { key: "attendanceStatus", label: "Attendance" },
              {
                key: "actions",
                label: "Action",
                render: (row) => (
                  <div className="inline-row">
                    <button className="btn btn-primary" onClick={() => updateAttendance(row._id, "checked_in")}>Check In</button>
                    <button className="btn btn-ghost" onClick={() => updateAttendance(row._id, "checked_out")}>
                      Check Out
                    </button>
                  </div>
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
