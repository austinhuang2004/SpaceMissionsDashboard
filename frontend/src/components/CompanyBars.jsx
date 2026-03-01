function CompanyBars({ companies }) {
  const COLORS = ["#00e5a0","#00bfff","#c084fc","#ffb547","#ff4b6e","#38bdf8","#f472b6","#a3e635","#fb923c","#818cf8"];
  const max = companies[0]?.count || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {companies.map((c, i) => (
        <div key={c.name} style={{ display: "grid", gridTemplateColumns: "150px 1fr 60px", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: ".63rem", color: "var(--muted)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.name}>{c.name}</span>
          <div style={{ height: 6, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(c.count / max) * 100}%`, background: COLORS[i % COLORS.length], borderRadius: 3 }} />
          </div>
          <span style={{ fontFamily: "var(--fm)", fontSize: ".63rem", color: "var(--muted)" }}>{c.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default CompanyBars;