import { useState, useEffect } from "react";

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

export default StatCard;