import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";
import "./PcSelector.css";

export default function PcSelector({ selectedPcId, onPcSelect, wantsPc }) {
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 4;

  useEffect(() => {
    if (!wantsPc) {
      setPcs([]);
      setPage(0);
      return;
    }

    let isMounted = true;
    const loadPcs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/pcs?limit=200");
        if (isMounted) {
          setPcs(data.items || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setPcs([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPcs();

    return () => {
      isMounted = false;
    };
  }, [wantsPc]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "var(--color-success)";
      case "occupied":
        return "var(--color-danger)";
      case "maintenance":
      case "pulled_out":
      case "offline":
        return "var(--color-warning)";
      case "inactive":
        return "var(--color-text-muted)";
      default:
        return "var(--color-text-muted)";
    }
  };

  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");

  if (!wantsPc) return null;

  if (loading) return <div className="pc-selector-loading">Loading available PCs...</div>;

  if (error) return <div className="pc-selector-error">Error loading PCs: {error}</div>;

  const pageCount = Math.max(1, Math.ceil(pcs.length / pageSize));
  const visible = pcs.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="pc-selector-container">
      <h3>Select a PC Workstation</h3>

      <div className="pc-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: "var(--color-success)" }} />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: "var(--color-danger)" }} />
          <span>In Use</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: "var(--color-warning)" }} />
          <span>Not Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: "var(--color-text-muted)" }} />
          <span>Inactive</span>
        </div>
      </div>

      {pcs.length === 0 ? (
        <div className="pc-empty-state">No PCs configured in the system.</div>
      ) : (
        <>
          <table className="pc-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Zone</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((pc) => (
                <tr
                  key={pc._id}
                  className={`pc-row ${selectedPcId === pc._id ? "selected" : ""} ${pc.status !== "available" ? "disabled" : ""}`}
                >
                  <td className="pc-name-cell">
                    <div className="pc-name">{pc.displayName}</div>
                  </td>
                  <td className="pc-code-cell">{pc.pcCode}</td>
                  <td className="pc-zone-cell">{pc.roomZone || "—"}</td>
                  <td className="pc-status-cell">
                    <span className="legend-dot" style={{ backgroundColor: getStatusColor(pc.status), marginRight: 8 }} />
                    {getStatusLabel(pc.status)}
                  </td>
                  <td className="pc-action-cell">
                    <button
                      type="button"
                      className="select-pc-btn"
                      onClick={() => pc.status === "available" && onPcSelect(pc._id)}
                      disabled={pc.status !== "available" && selectedPcId !== pc._id}
                    >
                      {selectedPcId === pc._id ? "Selected" : pc.status === "available" ? "Select" : "Unavailable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pc-pagination">
            <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
              Prev
            </button>
            <span>
              Page {page + 1} of {pageCount}
            </span>
            <button type="button" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
