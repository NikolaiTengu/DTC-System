export default function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {hint ? <small className="card-muted">{hint}</small> : null}
    </article>
  );
}
