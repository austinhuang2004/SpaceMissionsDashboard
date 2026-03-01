function Timeline({ data }) {
  const yearMap = {};
  data.forEach((r) => {
    const yr = String(r.Date ?? "").slice(0, 4);
    if (yr.length === 4 && !isNaN(yr)) yearMap[yr] = (yearMap[yr] || 0) + 1;
  });
  const years = Object.entries(yearMap).sort((a, b) => +a[0] - +b[0]);
  const max = Math.max(...years.map((y) => y[1]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 120, paddingBottom: 20, position: "relative", overflow: "hidden" }}>
      {years.map(([yr, cnt]) => (
        <div
          key={yr}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}
          title={`${yr}: ${cnt} missions`}
        >
          <div style={{ width: "100%", minHeight: 2, height: `${(cnt / max) * 100}%`, background: "linear-gradient(to top, #00bfff, rgba(0,191,255,.25))", borderRadius: "1px 1px 0 0", opacity: .55, transition: "opacity .15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = .55}
          />
          {+yr % 5 === 0 && <span style={{ fontFamily: "var(--fm)", fontSize: ".48rem", color: "var(--muted)", position: "absolute", bottom: 2 }}>{yr}</span>}
        </div>
      ))}
    </div>
  );
}

export default Timeline;