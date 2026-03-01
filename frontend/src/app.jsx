import { useState, useEffect } from "react";
import StatCard from "./components/StatCard";
import StatusBar from "./components/StatusBar";
import CompanyBars from "./components/CompanyBars";
import Timeline from "./components/Timeline";
import QueryPanel from "./components/QueryPanel";
import DataTable from "./components/DataTable";

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

        .stars { display: none; }

        .app { position: relative; z-index: 1; width: 200%; max-width: 1600px; margin: 0 auto; padding: 2rem; }

        .hdr { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); }
        .hdr-eye { font-family: var(--fm); font-size: .68rem; letter-spacing: .25em; text-transform: uppercase; color: var(--green); margin-bottom: .35rem; }
        .hdr-title { font-size: clamp(2rem,4vw,3rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; }
        .hdr-title span { color: var(--blue); }
        .hdr-sub { font-family: var(--fm); font-size: .72rem; color: var(--muted); margin-top: .4rem; }
        .hdr-badge { font-family: var(--fm); font-size: .62rem; background: rgba(0,229,160,.08); border: 1px solid rgba(0,229,160,.2); color: var(--green); padding: .35rem .8rem; border-radius: 2rem; letter-spacing: .1em; }

        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--s1); border: 1px solid var(--border); border-radius: .75rem; padding: 1.5rem; position: relative; overflow: hidden; transition: border-color .2s; }
        .stat-card::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent, var(--green)); opacity: .7; }
        .stat-card:hover { border-color: var(--accent, var(--green)); }
        .stat-value { font-size: 2.1rem; font-weight: 800; letter-spacing: -.03em; line-height: 1; word-break: break-word; }
        .stat-label { font-family: var(--fm); font-size: .62rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); margin-top: .4rem; }

        .tabs { display: flex; gap: .25rem; width: fit-content; background: var(--s1); border: 1px solid var(--border); border-radius: .5rem; padding: .25rem; margin-bottom: 1.5rem; }
        .tab { font-family: var(--fn); font-size: .78rem; font-weight: 700; letter-spacing: .06em; padding: .45rem 1.1rem; border: none; background: transparent; color: var(--muted); cursor: pointer; border-radius: .35rem; transition: all .18s; }
        .tab.active { background: var(--s2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,.4); }
        .tab:hover:not(.active) { color: var(--text); }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .chart-card { background: var(--s1); border: 1px solid var(--border); border-radius: .75rem; padding: 1.5rem; }
        .chart-card.full { grid-column: 1/-1; }
        .chart-title { font-family: var(--fm); font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--text); margin-bottom: 1.25rem; display: flex; align-items: center; gap: .5rem; }

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