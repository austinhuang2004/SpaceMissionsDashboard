import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return count;
}

/* ── STAT CARD ── */
function StatCard({ label, value, suffix = "", accent }) {
  const animated = useCounter(typeof value === "number" ? value : 0);
  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <div className="stat-value">
        {typeof value === "number" ? animated.toLocaleString() : (value ?? "—")}
        {typeof value === "number" ? suffix : ""}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── STATUS BAR ── */
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

/* ── COMPANY BARS ── */
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

/* ── TIMELINE ── */
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

/* ── QUERY PANEL ── */
function QueryPanel({ data }) {
  // Tool 1: Mission count by company
  const [company1, setCompany1] = useState("");
  const [result1, setResult1] = useState(null);

  // Tool 2: Success rate by company
  const [company2, setCompany2] = useState("");
  const [result2, setResult2] = useState(null);

  // Tool 3: Missions by date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result3, setResult3] = useState(null);

  // Tool 6: Missions by year
  const [year, setYear] = useState("");
  const [result6, setResult6] = useState(null);

  // Tool 7: Most used rocket
  const [result7, setResult7] = useState(null);

  // Tool 8: Average missions per year
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [result8, setResult8] = useState(null);

  // Tool 9: Top companies by mission count
  const [topN, setTopN] = useState(10);
  const [result9, setResult9] = useState(null);

  const companies = [...new Set(data.map((r) => r.Company))].filter(Boolean).sort();

  const run1 = () => {
    if (!company1) return;
    const count = data.filter((r) => r.Company === company1).length;
    setResult1(count);
  };

  const run2 = () => {
    if (!company2) return;
    const rows = data.filter((r) => r.Company === company2);
    if (!rows.length) { setResult2("0.00% (company not found)"); return; }
    const rate = (rows.filter((r) => r.MissionStatus === "Success").length / rows.length * 100).toFixed(2);
    setResult2(`${rate}%`);
  };

  const run3 = () => {
    if (!startDate || !endDate) return;
    const missions = data
      .filter((r) => r.Date >= startDate && r.Date <= endDate)
      .sort((a, b) => a.Date.localeCompare(b.Date))
      .map((r) => r.Mission);
    setResult3(missions);
  };

  const run6 = () => {
    if (!year) return;
    const count = data.filter((r) => String(r.Date ?? "").slice(0, 4) === String(year)).length;
    setResult6(count);
  };

  const run7 = async () => {
    try {
      const res = await fetch(`${API}/api/rockets/most-used`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult7(data.rocket || "N/A");
    } catch (e) {
      setResult7("Error fetching data");
    }
  };

  const run8 = async () => {
    if (!startYear || !endYear) return;
    try {
      const res = await fetch(`${API}/api/missions/average-per-year?start_year=${startYear}&end_year=${endYear}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult8(`${data.average}`);
    } catch (e) {
      setResult8("Error fetching data");
    }
  };

  const run9 = async () => {
    if (!topN || topN <= 0) return;
    try {
      const res = await fetch(`${API}/api/companies/top?n=${topN}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult9(data);
    } catch (e) {
      setResult9([]);
    }
  };

  const inputStyle = {
    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: ".35rem",
    color: "var(--text)", fontFamily: "var(--fm)", fontSize: ".72rem",
    padding: ".38rem .7rem", outline: "none", width: "100%",
  };
  const btnStyle = {
    background: "rgba(0,229,160,.1)", border: "1px solid rgba(0,229,160,.3)",
    color: "var(--green)", fontFamily: "var(--fm)", fontSize: ".7rem",
    padding: ".38rem .9rem", borderRadius: ".35rem", cursor: "pointer", whiteSpace: "nowrap",
  };
  const resultBox = {
    marginTop: 10, background: "rgba(0,229,160,.05)", border: "1px solid rgba(0,229,160,.15)",
    borderRadius: ".4rem", padding: ".6rem .9rem", fontFamily: "var(--fm)", fontSize: ".72rem",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

      {/* getMissionCountByCompany */}
      <div className="chart-card">
        <div className="chart-title">getMissionCountByCompany</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select style={inputStyle} value={company1} onChange={(e) => setCompany1(e.target.value)}>
            <option value="">Select company…</option>
            {companies.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button style={btnStyle} onClick={run1}>Run</button>
        </div>
        {result1 !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Total missions: </span>
            <span style={{ color: "var(--green)", fontWeight: 700, fontSize: ".9rem" }}>{result1}</span>
          </div>
        )}
      </div>

      {/* getSuccessRate */}
      <div className="chart-card">
        <div className="chart-title">getSuccessRate</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select style={inputStyle} value={company2} onChange={(e) => setCompany2(e.target.value)}>
            <option value="">Select company…</option>
            {companies.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button style={btnStyle} onClick={run2}>Run</button>
        </div>
        {result2 !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Success rate: </span>
            <span style={{ color: "#00bfff", fontWeight: 700, fontSize: ".9rem" }}>{result2}</span>
          </div>
        )}
      </div>

      {/* getMissionsByDateRange */}
      <div className="chart-card">
        <div className="chart-title">getMissionsByDateRange</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input type="date" style={{ ...inputStyle, colorScheme: "dark", flex: 1 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span style={{ fontFamily: "var(--fm)", fontSize: ".65rem", color: "var(--muted)" }}>to</span>
          <input type="date" style={{ ...inputStyle, colorScheme: "dark", flex: 1 }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button style={btnStyle} onClick={run3}>Run</button>
        </div>
        {result3 !== null && (
          <div style={resultBox}>
            <div style={{ color: "var(--muted)", marginBottom: 6 }}>{result3.length} missions found:</div>
            <div style={{ maxHeight: 140, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
              {result3.length === 0
                ? <span style={{ color: "var(--muted)" }}>No missions in range.</span>
                : result3.map((m, i) => (
                  <span key={i} style={{ color: "var(--text)", fontSize: ".68rem" }}>• {m}</span>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* getMissionsByYear */}
      <div className="chart-card">
        <div className="chart-title">getMissionsByYear</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min="1957" max="2030" placeholder="e.g. 2020"
            style={inputStyle} value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run6()}
          />
          <button style={btnStyle} onClick={run6}>Run</button>
        </div>
        {result6 !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Missions in {year}: </span>
            <span style={{ color: "#c084fc", fontWeight: 700, fontSize: ".9rem" }}>{result6}</span>
          </div>
        )}
      </div>

      {/* getTopCompaniesByMissionCount */}
      <div className="chart-card">
        <div className="chart-title">getTopCompaniesByMissionCount</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min="1" max="100" placeholder="e.g. 3"
            style={inputStyle} value={topN}
            onChange={(e) => setTopN(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run9()}
          />
          <button style={btnStyle} onClick={run9}>Get Top Companies</button>
        </div>
        {result9 !== null && (
          <div style={resultBox}>
            <div style={{ color: "var(--muted)", marginBottom: 6 }}>Top {topN} companies:</div>
            <div style={{ maxHeight: 140, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
              {result9.length === 0
                ? <span style={{ color: "var(--muted)" }}>No data available.</span>
                : result9.map((c, i) => (
                  <span key={i} style={{ color: "var(--text)", fontSize: ".68rem" }}>• {c.name}: {c.count} missions</span>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* getMostUsedRocket */}
      <div className="chart-card">
        <div className="chart-title">getMostUsedRocket</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={btnStyle} onClick={run7}>Get Most Used Rocket</button>
        </div>
        {result7 !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Most used rocket: </span>
            <span style={{ color: "#ffb547", fontWeight: 700, fontSize: ".9rem" }}>{result7}</span>
          </div>
        )}
      </div>

      {/* getAverageMissionsPerYear */}
      <div className="chart-card">
        <div className="chart-title">getAverageMissionsPerYear</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min="1957" max="2030" placeholder="Start year"
            style={inputStyle} value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <span style={{ fontFamily: "var(--fm)", fontSize: ".65rem", color: "var(--muted)" }}>to</span>
          <input
            type="number" min="1957" max="2030" placeholder="End year"
            style={inputStyle} value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
          <button style={btnStyle} onClick={run8}>Calculate Average</button>
        </div>
        {result8 !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Average missions per year: </span>
            <span style={{ color: "#818cf8", fontWeight: 700, fontSize: ".9rem" }}>{result8}</span>
          </div>
        )}
      </div>

    </div>
  );
}

/* ── DATA TABLE ── */
const COLS = ["Company","Location","Date","Rocket","Mission","MissionStatus","Price"];
const PAGE_SIZE = 20;

function DataTable({ data }) {
  const [filters, setFilters] = useState({ Company: "", Mission: "", MissionStatus: "", startDate: "", endDate: "" });
  const [sort, setSort] = useState({ key: "Date", dir: "desc" });
  const [page, setPage] = useState(1);

  const setF = (k, v) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };
  const toggleSort = (k) => setSort((p) => p.key === k ? { key: k, dir: p.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" });

  const filtered = data.filter((r) => {
    if (filters.Company && !String(r.Company ?? "").toLowerCase().includes(filters.Company.toLowerCase())) return false;
    if (filters.Mission && !String(r.Mission ?? "").toLowerCase().includes(filters.Mission.toLowerCase())) return false;
    if (filters.MissionStatus && r.MissionStatus !== filters.MissionStatus) return false;
    if (filters.startDate && String(r.Date ?? "") < filters.startDate) return false;
    if (filters.endDate && String(r.Date ?? "") > filters.endDate) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sort.key] ?? "", vb = b[sort.key] ?? "";
    const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
    return sort.dir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="table-section">
      <div className="table-filters">
        <input className="filter-input" placeholder="Filter company…" value={filters.Company} onChange={(e) => setF("Company", e.target.value)} />
        <input className="filter-input" placeholder="Filter mission…" value={filters.Mission} onChange={(e) => setF("Mission", e.target.value)} />
        <select className="filter-input" value={filters.MissionStatus} onChange={(e) => setF("MissionStatus", e.target.value)}>
          <option value="">All statuses</option>
          {Object.keys(STATUS_COLORS).map((s) => <option key={s}>{s}</option>)}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--muted)" }}>
          From <input type="date" className="filter-input" style={{ colorScheme: "dark", width: 140 }} value={filters.startDate} onChange={(e) => setF("startDate", e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--muted)" }}>
          To <input type="date" className="filter-input" style={{ colorScheme: "dark", width: 140 }} value={filters.endDate} onChange={(e) => setF("endDate", e.target.value)} />
        </div>
        <span className="row-count">{filtered.length.toLocaleString()} missions</span>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th key={c} onClick={() => toggleSort(c)} className="sortable-th" style={{ color: sort.key === c ? "var(--green)" : undefined }}>
                  {c} {sort.key === c ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="data-row">
                {COLS.map((col) => (
                  <td key={col}>
                    {col === "MissionStatus" ? (
                      <span className="status-pill" style={{ color: STATUS_COLORS[row[col]], borderColor: (STATUS_COLORS[row[col]] ?? "#888") + "44" }}>
                        {row[col] ?? "—"}
                      </span>
                    ) : col === "Price" ? (
                      row[col] && row[col] !== 0 ? `$${Number(row[col]).toLocaleString()}M` : "—"
                    ) : (
                      row[col] ?? "—"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
        <span>Page {page} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
      </div>
    </div>
  );
}

/* ══ MAIN APP ══ */
export default function App() {
  const [summary, setSummary]       = useState(null);
  const [statusDist, setStatusDist] = useState({});
  const [companies, setCompanies]   = useState([]);
  const [rawData, setRawData]       = useState([]);
  const [tab, setTab]               = useState("overview");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/summary`).then((r) => { if (!r.ok) throw new Error("summary"); return r.json(); }),
      fetch(`${API}/api/status-distribution`).then((r) => { if (!r.ok) throw new Error("status"); return r.json(); }),
      fetch(`${API}/api/companies/top?n=10`).then((r) => { if (!r.ok) throw new Error("companies"); return r.json(); }),
      fetch(`${API}/api/raw-data`).then((r) => { if (!r.ok) throw new Error("raw-data"); return r.json(); }),
    ])
      .then(([sum, status, comp, raw]) => {
        setSummary(sum);
        setStatusDist(status);
        setCompanies(comp);
        setRawData(raw);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Could not connect to API at ${API}. Make sure your FastAPI server is running.\n\n${err.message}`);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #050810; --s1: #0c1120; --s2: #111827;
          --border: rgba(255,255,255,0.07);
          --green: #00e5a0; --blue: #00bfff; --purple: #c084fc; --amber: #ffb547;
          --text: #e2e8f0; --muted: #64748b;
          --fn: 'Syne', sans-serif; --fm: 'JetBrains Mono', monospace;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--fn); min-height: 100vh; }

        .stars { position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,.55) 0%,transparent 100%),
            radial-gradient(1px 1px at 34% 65%, rgba(255,255,255,.35) 0%,transparent 100%),
            radial-gradient(1px 1px at 55% 12%, rgba(255,255,255,.5) 0%,transparent 100%),
            radial-gradient(1px 1px at 72% 82%, rgba(255,255,255,.3) 0%,transparent 100%),
            radial-gradient(1px 1px at 88% 42%, rgba(255,255,255,.6) 0%,transparent 100%),
            radial-gradient(600px at 20% 30%, rgba(0,191,255,.04) 0%,transparent 60%),
            radial-gradient(600px at 80% 70%, rgba(192,132,252,.04) 0%,transparent 60%); }

        .app { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; padding: 2rem; }

        .hdr { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); }
        .hdr-eye { font-family: var(--fm); font-size: .68rem; letter-spacing: .25em; text-transform: uppercase; color: var(--green); margin-bottom: .35rem; }
        .hdr-title { font-size: clamp(2rem,4vw,3rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; }
        .hdr-title span { color: var(--blue); }
        .hdr-sub { font-family: var(--fm); font-size: .72rem; color: var(--muted); margin-top: .4rem; }
        .hdr-badge { font-family: var(--fm); font-size: .62rem; background: rgba(0,229,160,.08); border: 1px solid rgba(0,229,160,.2); color: var(--green); padding: .35rem .8rem; border-radius: 2rem; letter-spacing: .1em; }

        .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--s1); border: 1px solid var(--border); border-radius: .75rem; padding: 1.5rem; position: relative; overflow: hidden; transition: border-color .2s; }
        .stat-card::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent, var(--green)); opacity: .7; }
        .stat-card:hover { border-color: var(--accent, var(--green)); }
        .stat-value { font-size: 2.1rem; font-weight: 800; letter-spacing: -.03em; line-height: 1; word-break: break-word; }
        .stat-label { font-family: var(--fm); font-size: .62rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); margin-top: .4rem; }

        .tabs { display: flex; gap: .25rem; width: fit-content; background: var(--s1); border: 1px solid var(--border); border-radius: .5rem; padding: .25rem; margin-bottom: 1.5rem; }
        .tab { font-family: var(--fn); font-size: .78rem; font-weight: 700; letter-spacing: .06em; padding: .45rem 1.1rem; border: none; background: transparent; color: var(--muted); cursor: pointer; border-radius: .35rem; transition: all .18s; }
        .tab.active { background: var(--s2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,.4); }
        .tab:hover:not(.active) { color: var(--text); }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .chart-card { background: var(--s1); border: 1px solid var(--border); border-radius: .75rem; padding: 1.5rem; }
        .chart-card.full { grid-column: 1/-1; }
        .chart-title { font-family: var(--fm); font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.25rem; display: flex; align-items: center; gap: .5rem; }
        .chart-title::before { content:''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

        .table-section { background: var(--s1); border: 1px solid var(--border); border-radius: .75rem; overflow: hidden; }
        .table-filters { display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
        .filter-input { background: var(--bg); border: 1px solid var(--border); border-radius: .35rem; color: var(--text); font-family: var(--fm); font-size: .7rem; padding: .38rem .7rem; outline: none; transition: border-color .2s; width: 160px; }
        .filter-input:focus { border-color: rgba(0,229,160,.4); }
        .filter-input::placeholder { color: var(--muted); }
        select.filter-input { cursor: pointer; }
        .row-count { font-family: var(--fm); font-size: .62rem; color: var(--muted); margin-left: auto; }
        .table-scroll { overflow-x: auto; max-height: 520px; overflow-y: auto; }
        .table-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .table-scroll::-webkit-scrollbar-track { background: var(--bg); }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead { position: sticky; top: 0; z-index: 1; }
        .sortable-th { background: var(--s2); padding: .7rem 1rem; text-align: left; font-family: var(--fm); font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); cursor: pointer; white-space: nowrap; user-select: none; transition: color .15s; }
        .sortable-th:hover { color: var(--text); }
        .data-row { border-bottom: 1px solid rgba(255,255,255,.03); transition: background .12s; }
        .data-row:hover { background: rgba(255,255,255,.03); }
        .data-row td { padding: .55rem 1rem; font-family: var(--fm); font-size: .7rem; color: var(--muted); white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
        .data-row td:first-child { color: var(--text); font-weight: 500; }
        .status-pill { font-size: .6rem; padding: .12rem .5rem; border-radius: 1rem; border: 1px solid; letter-spacing: .04em; }
        .pagination { display: flex; align-items: center; gap: .4rem; padding: .7rem 1.25rem; justify-content: flex-end; border-top: 1px solid var(--border); font-family: var(--fm); font-size: .7rem; color: var(--muted); }
        .pagination button { background: var(--s2); border: 1px solid var(--border); color: var(--text); padding: .28rem .55rem; border-radius: .3rem; cursor: pointer; font-family: var(--fm); font-size: .7rem; transition: border-color .15s; }
        .pagination button:hover:not(:disabled) { border-color: rgba(0,229,160,.4); color: var(--green); }
        .pagination button:disabled { opacity: .3; cursor: default; }

        .error-box { background: rgba(255,75,110,.06); border: 1px solid rgba(255,75,110,.25); border-radius: .75rem; padding: 2rem; text-align: center; margin-top: 2rem; }
        .error-title { color: #ff4b6e; font-size: 1.1rem; font-weight: 700; margin-bottom: .75rem; }
        .error-msg { font-family: var(--fm); font-size: .72rem; color: var(--muted); white-space: pre-wrap; line-height: 1.6; }

        @media (max-width: 900px) { .stats { grid-template-columns: repeat(2,1fr); } .grid2 { grid-template-columns: 1fr; } }
        @media (max-width: 580px) { .app { padding: 1rem; } .hdr { flex-direction: column; align-items: flex-start; gap: .75rem; } }
      `}</style>

      <div className="stars" />
      <div className="app">
        <header className="hdr">
          <div>
            <div className="hdr-eye">Mission Intelligence Platform</div>
            <h1 className="hdr-title">Space <span>Missions</span></h1>
            <div className="hdr-sub">1957 — Present · Historical Launch Database</div>
          </div>
        </header>

        {/* ── ERROR STATE ── */}
        {error && (
          <div className="error-box">
            <div className="error-title">⚠ Cannot reach API server</div>
            <div className="error-msg">{error}</div>
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && !error && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: "1rem" }}>
            <div style={{ width: 36, height: 36, border: "2px solid var(--border)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontFamily: "var(--fm)", fontSize: ".68rem", letterSpacing: ".15em", color: "var(--muted)" }}>CONNECTING TO API…</span>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        {!loading && !error && (
          <>
            <div className="stats">
              <StatCard label="Total Missions"      value={summary?.total}        accent="#00e5a0" />
              <StatCard label="Success Rate"        value={summary?.successRate}  suffix="%" accent="#00bfff" />
              <StatCard label="Successful Launches" value={summary?.successCount} accent="#c084fc" />
              <StatCard label="Top Organization"    value={summary?.topCompany}   accent="#ffb547" />
            </div>

            <div className="tabs">
              {["overview","functions","data"].map((t) => (
                <button key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                  {t === "functions" ? "QUERY FUNCTIONS" : t.toUpperCase()}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="grid2">
                <div className="chart-card">
                  <div className="chart-title">Mission Outcomes</div>
                  <StatusBar data={statusDist} />
                </div>
                <div className="chart-card">
                  <div className="chart-title">Top 10 Organizations</div>
                  <CompanyBars companies={companies} />
                </div>
                <div className="chart-card full">
                  <div className="chart-title">Launches Per Year</div>
                  <Timeline data={rawData} />
                </div>
              </div>
            )}

            {tab === "functions" && <QueryPanel data={rawData} />}

            {tab === "data" && <DataTable data={rawData} />}
          </>
        )}
      </div>
    </>
  );
}