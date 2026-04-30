import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { useApi } from "../hooks/useApi";
import { apiFetch } from "../api/http";

export default function LayoutPage() {
  const { data, setData } = useApi("/pcs?limit=50");
  const [message, setMessage] = useState("");

  function move(id, key, delta) {
    setData((current) => ({
      ...current,
      items: current.items.map((item) => (item._id === id ? { ...item, [key]: Math.max(0, item[key] + delta) } : item))
    }));
  }

  async function saveLayout() {
    await apiFetch("/layout", {
      method: "POST",
      body: JSON.stringify({
        items: (data?.items || []).map((item) => ({
          _id: item._id,
          layoutX: item.layoutX,
          layoutY: item.layoutY,
          layoutWidth: item.layoutWidth,
          layoutHeight: item.layoutHeight,
          sortOrder: item.sortOrder
        }))
      })
    });
    setMessage("Layout saved.");
  }

  return (
    <div className="page-stack">
      <PageHeader title="Room Layout Editor" subtitle="Adjust workstation placement for the DTC room map." actions={<button className="btn btn-primary" onClick={saveLayout}>Save Layout</button>} />
      <div className="room-toolbar">
        <span>Use arrow controls to move workstation cards.</span>
      </div>
      <Toast message={message} />
      <div className="layout-grid">
        {(data?.items || []).map((pc) => (
          <div
            key={pc._id}
            className={`layout-card workstation-card status-${pc.status}`}
            style={{
              gridColumn: `${pc.layoutX + 1} / span ${pc.layoutWidth}`,
              gridRow: `${pc.layoutY + 1} / span ${pc.layoutHeight}`
            }}
          >
            <span className={`presence-dot ${pc.status === "offline" || pc.status === "inactive" ? "offline" : "online"}`} />
            <strong>{pc.displayName}</strong>
            <span>{pc.pcCode}</span>
            <small>{pc.status}</small>
            <div className="mini-actions">
              <button className="btn btn-ghost" onClick={() => move(pc._id, "layoutX", -1)}>←</button>
              <button className="btn btn-ghost" onClick={() => move(pc._id, "layoutX", 1)}>→</button>
              <button className="btn btn-ghost" onClick={() => move(pc._id, "layoutY", -1)}>↑</button>
              <button className="btn btn-ghost" onClick={() => move(pc._id, "layoutY", 1)}>↓</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
