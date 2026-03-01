const STATUS_COLORS = {
  Success: "#00e5a0",
  Failure: "#ff4b6e",
  "Partial Failure": "#ffb547",
  "Prelaunch Failure": "#c084fc",
};

function StatusBar({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (!total) return <p style={{ color: "var(--muted)", fontFamily: "var(--fm)", fontSize: ".75rem" }}>No data</p>;
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", gap: 2, marginBottom: 16 }}>
        {Object.entries(data).map(([k, v]) =>
          v > 0 ? (
            <div key={k} style={{ width: `${(v / total) * 100}%`, background: STATUS_COLORS[k] }} title={`${k}: ${v}`} />
          ) : null
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {Object.entries(data).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[k], flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--fm)", fontSize: ".68rem", color: "var(--muted)", flex: 1 }}>{k}</span>
            <span style={{ fontFamily: "var(--fm)", fontSize: ".68rem", fontWeight: 600 }}>{v.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusBar;