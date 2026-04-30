import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const SOCKET_BASE = (import.meta.env.VITE_SOCKET_URL || "http://localhost:4000").replace(/\/$/, "");

function getQuery() {
  const params = new URLSearchParams(window.location.search);
  return {
    pcCode: params.get("pc") || localStorage.getItem("dtc_pc_code") || "",
    kioskSecret: params.get("secret") || localStorage.getItem("dtc_pc_secret") || "",
    ticket: params.get("ticket") || ""
  };
}

export default function WorkstationPage() {
  const defaults = useMemo(getQuery, []);
  const [pcCode, setPcCode] = useState(defaults.pcCode);
  const [kioskSecret, setKioskSecret] = useState(defaults.kioskSecret);
  const [ticketCode, setTicketCode] = useState(defaults.ticket);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("This workstation is locked.");
  const [session, setSession] = useState(null);
  const [feedbackAnswers, setFeedbackAnswers] = useState({ overall: 5, helpful: "yes", comments: "" });

  useEffect(() => {
    if (!pcCode || !kioskSecret) return;
    localStorage.setItem("dtc_pc_code", pcCode);
    localStorage.setItem("dtc_pc_secret", kioskSecret);
    fetch(`${API_BASE}/tickets/handshake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pcCode, kioskSecret })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.pc) {
          setState("awaiting_ticket");
          setMessage(`Waiting for ticket on ${data.pc.displayName}.`);
        } else {
          setState("error");
          setMessage(data.message || "Handshake failed.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Unable to connect to server.");
      });
  }, [pcCode, kioskSecret]);

  useEffect(() => {
    if (!pcCode || !kioskSecret) return undefined;
    const socket = io(SOCKET_BASE);
    socket.emit("workstation:presence", { pcCode, kioskSecret });
    return () => socket.disconnect();
  }, [pcCode, kioskSecret]);

  async function unlock(event) {
    event.preventDefault();
    const response = await fetch(`${API_BASE}/tickets/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pcCode, kioskSecret, ticketCode })
    });
    const data = await response.json();
    if (!response.ok) {
      setState("error");
      setMessage(data.message || "Ticket validation failed.");
      return;
    }
    setSession(data.session);
    setState("unlocked");
    setMessage("Session started. The guest may now use this workstation.");
  }

  async function sendFeedback(event) {
    event.preventDefault();
    if (!session) return;
    await fetch(`${API_BASE}/feedback-responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: "",
        visitSessionId: session._id,
        answers: feedbackAnswers,
        submittedByType: "guest"
      })
    }).catch(() => null);
    setState("idle");
    setMessage("Feedback submitted. Workstation is locked.");
    setSession(null);
  }

  return (
    <div className="workstation-shell kiosk-root">
      <div className="workstation-card kiosk-card">
        <span className="kicker">DICT DTC Workstation</span>
        <h1>{state === "unlocked" ? "Session Active" : "Locked Workstation"}</h1>
        <p>{message}</p>

        {!pcCode || !kioskSecret ? (
          <form className="workstation-form">
            <label>
              PC Code
              <input value={pcCode} onChange={(event) => setPcCode(event.target.value)} />
            </label>
            <label>
              Kiosk Secret
              <input value={kioskSecret} onChange={(event) => setKioskSecret(event.target.value)} />
            </label>
          </form>
        ) : null}

        {state !== "unlocked" ? (
          <form className="workstation-form" onSubmit={unlock}>
            <label>
              Ticket Code
              <input value={ticketCode} onChange={(event) => setTicketCode(event.target.value)} />
            </label>
            <button type="submit">Unlock Session</button>
          </form>
        ) : null}

        {state === "unlocked" ? (
          <div className="session-panel">
            <p>Session ID: {session?._id}</p>
            <p>Started: {session?.unlockStartedAt || "just now"}</p>
            <button onClick={() => setState("feedback")}>End Session and Show Feedback</button>
          </div>
        ) : null}

        {state === "feedback" ? (
          <form className="workstation-form" onSubmit={sendFeedback}>
            <label>
              Overall satisfaction
              <input
                type="number"
                min="1"
                max="5"
                value={feedbackAnswers.overall}
                onChange={(event) => setFeedbackAnswers((current) => ({ ...current, overall: Number(event.target.value) }))}
              />
            </label>
            <label>
              Was the staff helpful?
              <select
                value={feedbackAnswers.helpful}
                onChange={(event) => setFeedbackAnswers((current) => ({ ...current, helpful: event.target.value }))}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              Comments
              <textarea
                value={feedbackAnswers.comments}
                onChange={(event) => setFeedbackAnswers((current) => ({ ...current, comments: event.target.value }))}
              />
            </label>
            <button type="submit">Submit Feedback</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
