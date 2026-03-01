import { useState } from "react";

const COLS = ["Company","Location","Date","Rocket","RocketStatus","Time","Mission","MissionStatus","Price"];
const PAGE_SIZE = 20;

const STATUS_COLORS = {
  Success: "#00e5a0",
  Failure: "#ff4b6e",
  "Partial Failure": "#ffb547",
  "Prelaunch Failure": "#c084fc",
};

function DataTable({ data }) {
  const [filters, setFilters] = useState({ Company: "", Mission: "", MissionStatus: "", startDate: "", endDate: "", minPrice: "", maxPrice: "", rocketStatus: "", time: "" });
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
    if (filters.minPrice && (r.Price == null || r.Price < Number(filters.minPrice))) return false;
    if (filters.maxPrice && (r.Price == null || r.Price > Number(filters.maxPrice))) return false;
    if (filters.rocketStatus && r.RocketStatus !== filters.rocketStatus) return false;
    if (filters.time && !String(r.Time ?? "").toLowerCase().includes(filters.time.toLowerCase())) return false;
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
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--muted)" }}>
          Min Price <input type="number" className="filter-input" style={{ colorScheme: "dark", width: 120 }} placeholder="e.g. 10" value={filters.minPrice} onChange={(e) => setF("minPrice", e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--muted)" }}>
          Max Price <input type="number" className="filter-input" style={{ colorScheme: "dark", width: 120 }} placeholder="e.g. 100" value={filters.maxPrice} onChange={(e) => setF("maxPrice", e.target.value)} />
        </div>
        <select className="filter-input" value={filters.rocketStatus} onChange={(e) => setF("rocketStatus", e.target.value)}>
          <option value="">All rocket statuses</option>
          <option value="Active">Active</option>
          <option value="Retired">Retired</option>
        </select>
        <input className="filter-input" placeholder="Filter time…" value={filters.time} onChange={(e) => setF("time", e.target.value)} />
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
                      row[col] && row[col] !== 0 ? `${Number(row[col]).toLocaleString()}` : "—"
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

export default DataTable;