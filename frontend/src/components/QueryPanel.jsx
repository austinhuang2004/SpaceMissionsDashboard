import { useState } from "react";

const API = "http://127.0.0.1:8000";

function QueryPanel({ data }) {
  const [companyForMissionCount, setCompanyForMissionCount] = useState("");
  const [missionCountResult, setMissionCountResult] = useState(null);

  const [companyForSuccessRate, setCompanyForSuccessRate] = useState("");
  const [successRateResult, setSuccessRateResult] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [missionsByDateRangeResult, setMissionsByDateRangeResult] = useState(null);

  const [year, setYear] = useState("");
  const [missionsByYearResult, setMissionsByYearResult] = useState(null);

  const [mostUsedRocketResult, setMostUsedRocketResult] = useState(null);

  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [averageMissionsResult, setAverageMissionsResult] = useState(null);

  const [topN, setTopN] = useState("");
  const [topCompaniesResult, setTopCompaniesResult] = useState(null);

  const [missionStatusCountResult, setMissionStatusCountResult] = useState(null);

  const companies = [...new Set(data.map((r) => r.Company))].filter(Boolean).sort();

  const getMissionCountByCompany = () => {
    if (!companyForMissionCount) return;
    const count = data.filter((r) => r.Company === companyForMissionCount).length;
    setMissionCountResult(count);
  };

  const getSuccessRateByCompany = () => {
    if (!companyForSuccessRate) return;
    const rows = data.filter((r) => r.Company === companyForSuccessRate);
    if (!rows.length) { setSuccessRateResult("0.0% (company not found)"); return; }
    const successes = rows.filter((r) => r.MissionStatus === "Success").length;
    const rate = (successes / rows.length) * 100;
    setSuccessRateResult(`${successes === 0 ? "0.0" : rate.toFixed(2)}%`);
  };

  const getMissionsByDateRange = () => {
    if (!startDate || !endDate) return;
    const missions = data
      .filter((r) => r.Date >= startDate && r.Date <= endDate)
      .sort((a, b) => a.Date.localeCompare(b.Date))
      .map((r) => r.Mission);
    setMissionsByDateRangeResult(missions);
  };

  const getMissionsByYear = () => {
    if (!year) return;
    const count = data.filter((r) => String(r.Date ?? "").slice(0, 4) === String(year)).length;
    setMissionsByYearResult(count);
  };

  const getMostUsedRocket = async () => {
    try {
      const res = await fetch(`${API}/api/rockets/most-used`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMostUsedRocketResult(data.rocket || "N/A");
    } catch (e) {
      setMostUsedRocketResult("Error fetching data");
    }
  };

  const getAverageMissionsPerYear = async () => {
    if (!startYear || !endYear) return;
    try {
      const res = await fetch(`${API}/api/missions/average-per-year?start_year=${startYear}&end_year=${endYear}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setAverageMissionsResult(`${data.average}`);
    } catch (e) {
      setAverageMissionsResult("Error fetching data");
    }
  };

  const getTopCompaniesByMissionCount = async () => {
    if (!topN || topN <= 0) return;
    try {
      const res = await fetch(`${API}/api/companies/top?n=${topN}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setTopCompaniesResult(data);
    } catch (e) {
      setTopCompaniesResult([]);
    }
  };

  const getMissionStatusCount = async () => {
    try {
      const res = await fetch(`${API}/api/status-distribution`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMissionStatusCountResult(data);
    } catch (e) {
      setMissionStatusCountResult({});
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
        <div className="chart-title">GET MISSION COUNT BY COMPANY</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select style={inputStyle} value={companyForMissionCount} onChange={(e) => setCompanyForMissionCount(e.target.value)}>
            <option value="">Select company…</option>
            {companies.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button style={btnStyle} onClick={getMissionCountByCompany}>Run</button>
        </div>
        {missionCountResult !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Total missions: </span>
            <span style={{ color: "var(--green)", fontWeight: 700, fontSize: ".9rem" }}>{missionCountResult}</span>
          </div>
        )}
      </div>

      {/* getSuccessRate */}
      <div className="chart-card">
        <div className="chart-title">GET SUCCESS RATE</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select style={inputStyle} value={companyForSuccessRate} onChange={(e) => setCompanyForSuccessRate(e.target.value)}>
            <option value="">Select company…</option>
            {companies.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button style={btnStyle} onClick={getSuccessRateByCompany}>Run</button>
        </div>
        {successRateResult !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Success rate: </span>
            <span style={{ color: "#00bfff", fontWeight: 700, fontSize: ".9rem" }}>{successRateResult}</span>
          </div>
        )}
      </div>

      {/* getMissionsByDateRange */}
      <div className="chart-card">
        <div className="chart-title">GET MISSIONS BY DATE RANGE</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input type="date" style={{ ...inputStyle, colorScheme: "dark", flex: 1 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span style={{ fontFamily: "var(--fm)", fontSize: ".65rem", color: "var(--muted)" }}>to</span>
          <input type="date" style={{ ...inputStyle, colorScheme: "dark", flex: 1 }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button style={btnStyle} onClick={getMissionsByDateRange}>Run</button>
        </div>
        {missionsByDateRangeResult !== null && (
          <div style={resultBox}>
            <div style={{ color: "var(--muted)", marginBottom: 6 }}>{missionsByDateRangeResult.length} missions found:</div>
            <div style={{ maxHeight: 140, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
              {missionsByDateRangeResult.length === 0
                ? <span style={{ color: "var(--muted)" }}>No missions in range.</span>
                : missionsByDateRangeResult.map((m, i) => (
                  <span key={i} style={{ color: "var(--text)", fontSize: ".68rem" }}>• {m}</span>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* getMissionsByYear */}
      <div className="chart-card">
        <div className="chart-title">GET MISSIONS BY YEAR</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min="1957" max="2030" placeholder="e.g. 2020"
            style={inputStyle} value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run6()}
          />
          <button style={btnStyle} onClick={getMissionsByYear}>Run</button>
        </div>
        {missionsByYearResult !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Missions in {year}: </span>
            <span style={{ color: "#c084fc", fontWeight: 700, fontSize: ".9rem" }}>{missionsByYearResult}</span>
          </div>
        )}
      </div>

      {/* getTopCompaniesByMissionCount */}
      <div className="chart-card">
        <div className="chart-title">GET TOP COMPANIES BY MISSION COUNT</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min="1" max="100" placeholder="Enter number of companies to show"
            style={inputStyle} value={topN}
            onChange={(e) => setTopN(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run9()}
          />
          <button style={btnStyle} onClick={getTopCompaniesByMissionCount}>Get Top Companies</button>
        </div>
        {topCompaniesResult !== null && (
          <div style={resultBox}>
            <div style={{ color: "var(--muted)", marginBottom: 6 }}>Top {topN} companies:</div>
            <div style={{ maxHeight: 140, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
              {topCompaniesResult.length === 0
                ? <span style={{ color: "var(--muted)" }}>No data available.</span>
                : topCompaniesResult.map((c, i) => (
                  <span key={i} style={{ color: "var(--text)", fontSize: ".68rem" }}>• {c.name}: {c.count} missions</span>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* getMostUsedRocket */}
      <div className="chart-card">
        <div className="chart-title">GET MOST USED ROCKET</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={btnStyle} onClick={getMostUsedRocket}>Get Most Used Rocket</button>
        </div>
        {mostUsedRocketResult !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Most used rocket: </span>
            <span style={{ color: "#ffb547", fontWeight: 700, fontSize: ".9rem" }}>{mostUsedRocketResult}</span>
          </div>
        )}
      </div>

      {/* getAverageMissionsPerYear */}
      <div className="chart-card">
        <div className="chart-title">GET AVERAGE MISSIONS PER YEAR</div>
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
          <button style={btnStyle} onClick={getAverageMissionsPerYear}>Calculate Average</button>
        </div>
        {averageMissionsResult !== null && (
          <div style={resultBox}>
            <span style={{ color: "var(--muted)" }}>Average missions per year: </span>
            <span style={{ color: "#818cf8", fontWeight: 700, fontSize: ".9rem" }}>{averageMissionsResult}</span>
          </div>
        )}
      </div>

      {/* getMissionStatusCount */}
      <div className="chart-card">
        <div className="chart-title">GET MISSION STATUS COUNT</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={btnStyle} onClick={getMissionStatusCount}>Get Status Counts</button>
        </div>
        {missionStatusCountResult !== null && (
          <div style={resultBox}>
            <div style={{ color: "var(--muted)", marginBottom: 6 }}>Mission status counts:</div>
            <div style={{ maxHeight: 140, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
              {Object.entries(missionStatusCountResult).map(([status, count]) => (
                <span key={status} style={{ color: "var(--text)", fontSize: ".68rem" }}>• {status}: {count}</span>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default QueryPanel;