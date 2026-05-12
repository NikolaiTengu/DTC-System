import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import PageHeader from "../../components/PageHeader";
import Toast from "../../components/Toast";
import PcSelector from "../../components/PcSelector";
import { apiFetch } from "../../api/http";

const initialForm = {
  fullName: "",
  sex: "",
  age: "",
  contactNumber: "",
  email: "",
  address: "",
  organization: "",
  visitPurpose: "",
  wantsPc: false,
  eventId: "",
  remarks: ""
};

export default function GuestRegistrationView({ title, source, publicPage = false }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [otherPurpose, setOtherPurpose] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedPcId, setSelectedPcId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("dtc_access_token");
    if (!token && !publicPage) return;
    apiFetch(publicPage ? "/events/public" : "/events?limit=20")
      .then((data) => setEvents(data.items || []))
      .catch(() => setEvents([]));
  }, [publicPage]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      visitPurpose: form.visitPurpose === "Others" ? otherPurpose : form.visitPurpose,
      age: form.age ? Number(form.age) : undefined,
      wantsPc: Boolean(form.wantsPc),
      source,
      eventId: form.eventId || null
    };

    // Include selected PC for admin registrations
    if (!publicPage && form.wantsPc && selectedPcId) {
      payload.assignedPcId = selectedPcId;
    }

    try {
      const data = await apiFetch("/guests", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setResult(data);
      setForm(initialForm);
      setOtherPurpose("");
      setSelectedPcId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  const content = (
    <div className="page-stack">
      {!publicPage ? <PageHeader title={title} subtitle="Register guest visits and assign workstations automatically." /> : null}
      <div className="panel card">
        {publicPage ? (
          <div className="guest-hero">
            <span className="brand-kicker">DICT DTC</span>
            <h1>{title}</h1>
            <p>Complete this form to log your visit and request a workstation if needed.</p>
          </div>
        ) : null}
        {error ? <Toast message={error} tone="error" /> : null}
        <form id="guest-form" className="form-grid" onSubmit={submit}>
          {[
            { key: "fullName", label: "Full name" },
            { key: "contactNumber", label: "Contact Number" },
            { key: "email", label: "Email" },
            { key: "address", label: "Address" },
            { key: "organization", label: "Organization" },
            { key: "visitPurpose", label: "Visit Purpose" },
            { key: "remarks", label: "Remarks" },
          ].map((field) => (
            <label key={field.key}>
              {field.label}
              {field.key === "remarks" ? (
                <textarea className="textarea" value={form[field.key]} onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))} />
              ) : field.key === "visitPurpose" ? (
                <>
                  <select className="select" value={form[field.key]} onChange={(e) => {
                    const nextValue = e.target.value;
                    setForm((current) => ({ ...current, [field.key]: nextValue }));
                    if (nextValue !== "Others") {
                      setOtherPurpose("");
                    }
                  }}>
                    <option value="">Select purpose</option>
                    <option value="Training Session">Training Session</option>
                    <option value="Seminar/Workshop">Seminar/Workshop</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Orientation">Orientation</option>
                    <option value="Assessment/Examination">Assessment/Examination</option>
                    <option value="Coaching/Mentoring">Coaching/Mentoring</option>
                    <option value="Facility Visit/Tour">Facility Visit/Tour</option>
                    <option value="Guest Speeker/Resource Person">Guest Speeker/Resource Person</option>
                    <option value="Administrative Transaction">Administrative Transaction</option>
                    <option value="Document Submission">Document Submission</option>
                    <option value="Inquiry/Consultation">Inquiry/Consultation</option>
                    <option value="Equipment/Materials Delivery">Equipment/Materials Delivery</option>
                    <option value="Technical Support/Maintenance">Technical Support/Maintenance</option>
                    <option value="Monitoring/Evaluation">Monitoring/Evaluation</option>
                    <option value="Partnership/Coordination Visit">Partnership/Coordination Visit</option>
                    <option value="Event Participation">Event Participation</option>
                    <option value="OJT/Internship-Related Visit">OJT/Internship-Related Visit</option>
                    <option value="Client/Stakeholder Visit">Client/Stakeholder Visit</option>
                    <option value="Staff/Employee Visit">Staff/Employee Visit</option>
                    <option value="Others">Others</option>
                  </select>
                  {form[field.key] === "Others" ? (
                    <input
                      className="input"
                      placeholder="Specify purpose"
                      value={otherPurpose}
                      onChange={(e) => setOtherPurpose(e.target.value)}
                    />
                  ) : null}
                </>
              ) : (
                <input className="input" value={form[field.key]} onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))} />
              )}
            </label>
          ))}
          <label>
            Sex
            <select className="select" value={form.sex} onChange={(e) => setForm((current) => ({ ...current, sex: e.target.value }))}>
              <option value="">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Age
            <input className="input" value={form.age} onChange={(e) => setForm((current) => ({ ...current, age: e.target.value }))} type="number" />
          </label>
          <label>
            Related Event
            <select className="select" value={form.eventId} onChange={(e) => setForm((current) => ({ ...current, eventId: e.target.value }))}>
              <option value="">None</option>
              {events.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.wantsPc}
              onChange={(e) => {
                setForm((current) => ({ ...current, wantsPc: e.target.checked }));
                if (!e.target.checked) {
                  setSelectedPcId(null);
                }
              }}
            />
            I need a PC workstation
          </label>
        </form>
        {!publicPage && form.wantsPc && (
          <div className="pc-section">
            <div className="pc-section-header">
              <button type="submit" form="guest-form" className="register-btn btn btn-primary">
                Register Guest
              </button>
            </div>
            <PcSelector 
              selectedPcId={selectedPcId} 
              onPcSelect={setSelectedPcId}
              wantsPc={form.wantsPc}
            />
          </div>
        )}
        {!form.wantsPc && (
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" form="guest-form">{publicPage ? "Submit Registration" : "Register Guest"}</button>
          </div>
        )}
      </div>
      {result ? (
        <div className="panel card">
          <h2>Registration Complete</h2>
          <p>Guest: {result.guest.fullName}</p>
          <p>Status: {result.session.sessionStatus}</p>
          <p>Assigned PC: {result.assignedPc?.displayName || "None"}</p>
          <p>Ticket Code: {result.ticket?.code || "N/A"}</p>
          {result.qrDataUrl ? <img alt="Ticket QR" className="qr-preview" src={result.qrDataUrl} /> : null}
          {!publicPage ? (
            <div className="inline-qr">
              <QRCodeSVG value={`${window.location.origin}/guest-register`} size={120} />
              <span>Self-service QR entry</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {!result && !publicPage ? (
        <div className="panel card qr-panel">
          <h2>Self-Service Entry QR</h2>
          <div className="inline-qr">
            <QRCodeSVG value={`${window.location.origin}/guest-register`} size={140} />
            <span>{`${window.location.origin}/guest-register`}</span>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (publicPage) {
    return <div className="guest-page-shell">{content}</div>;
  }
  return content;
}
