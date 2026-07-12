function StatsCard({ icon, label, value, sublabel, color = "#6366f1", trend, delay = 0 }) {
  const colorMap = {
    "#6366f1": "rgba(99,102,241,0.15)",
    "#10b981": "rgba(16,185,129,0.15)",
    "#f59e0b": "rgba(245,158,11,0.15)",
    "#ef4444": "rgba(239,68,68,0.15)",
    "#22d3ee": "rgba(34,211,238,0.15)",
    "#8b5cf6": "rgba(139,92,246,0.15)",
  };
  const bg = colorMap[color] || "rgba(99,102,241,0.15)";

  return (
    <div
      className="stat-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: bg, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 20, border: `1px solid ${color}30`
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: trend >= 0 ? "#6ee7b7" : "#fca5a5",
            background: trend >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            padding: "3px 8px", borderRadius: 20
          }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", lineHeight: 1, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: sublabel ? 4 : 0 }}>
        {label}
      </div>

      {sublabel && (
        <div style={{ fontSize: 11, color: "#64748b" }}>{sublabel}</div>
      )}
    </div>
  );
}

export default StatsCard;
