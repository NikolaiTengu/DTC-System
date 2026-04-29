import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  ["Dashboard", "/"],
  ["Users", "/users"],
  ["Roles", "/roles"],
  ["Register Guest", "/guests/register"],
  ["Active Guests", "/guests/active"],
  ["History", "/guests/history"],
  ["PCs", "/pcs"],
  ["Layout", "/layout"],
  ["Events", "/events"],
  ["Feedback Templates", "/feedback/templates"],
  ["Feedback Responses", "/feedback/responses"],
  ["Reports", "/reports"],
  ["Audit Logs", "/audit-logs"],
  ["Settings", "/settings"]
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-kicker">DICT</span>
          <strong>DTC System</strong>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(([label, href]) => (
            <NavLink key={href} to={href} end={href === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <div>
            <strong>{user?.firstName} {user?.lastName}</strong>
            <p>{user?.roles?.map((role) => role.name).join(", ")}</p>
          </div>
          <button className="ghost-button" onClick={logout}>Logout</button>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
