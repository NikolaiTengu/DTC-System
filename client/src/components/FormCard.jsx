export default function FormCard({ title, children }) {
  return (
    <section className="panel">
      {title ? <h2>{title}</h2> : null}
      <div className="form-grid">{children}</div>
    </section>
  );
}
