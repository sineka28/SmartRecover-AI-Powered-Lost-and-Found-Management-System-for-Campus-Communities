function StatsCard({ icon, label, value, sublabel, color = "#6366f1", trend, delay = 0 }) {
  const alphaMap = {
    "#6366f1": "rgba(99,102,241,0.14)",
    "#10b981": "rgba(16,185,129,0.14)",
    "#f59e0b": "rgba(245,158,11,0.14)",
    "#ef4444": "rgba(239,68,68,0.14)",
    "#22d3ee": "rgba(34,211,238,0.14)",
    "#8b5cf6": "rgba(139,92,246,0.14)",
    "#ec4899": "rgba(236,72,153,0.14)",
  };
  const bg = alphaMap[color] || "rgba(99,102,241,0.14)";

  return (
    <div
      className="stat-card animate-fade-in"
      style={{ animationDelay: `${delay}ms`, zIndex: 1 }}
    >
      {/* Accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, ${color}44)`, borderRadius: "20px 20px 0 0" }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, position: "relative", zIndex: 1 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, border: `1px solid ${color}28`,
          boxShadow: `0 4px 12px ${color}18`,
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            fontSize: 12, fontWeight: 600,
            color: trend >= 0 ? "#6ee7b7" : "#fca5a5",
            background: trend >= 0 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${trend >= 0 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            padding: "3px 9px", borderRadius: 20,
          }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: 30, fontWeight: 800,
        color: "#f1f5f9", lineHeight: 1,
        marginBottom: 5,
        fontFamily: "'Space Grotesk', sans-serif",
        position: "relative", zIndex: 1,
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: sublabel ? 3 : 0, position: "relative", zIndex: 1 }}>
        {label}
      </div>

      {sublabel && (
        <div style={{ fontSize: 11, color: "#64748b", position: "relative", zIndex: 1 }}>{sublabel}</div>
      )}

      {/* Corner glow */}
      <div style={{
        position: "absolute", right: -20, bottom: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: color, opacity: 0.06, filter: "blur(20px)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

export default StatsCard;
