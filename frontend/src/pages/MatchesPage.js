import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllMatches, findMatches, updateMatchStatus } from "../api/matchApi";

const MATCH_FACTORS = ["Object Type", "Color", "Category", "Brand", "Location", "Date Range", "Description"];

function ConfidenceBar({ pct }) {
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  const label = pct >= 80 ? "Very High" : pct >= 60 ? "Moderate" : "Low";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>AI Confidence</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{Math.round(pct)}% · {label}</span>
      </div>
      <div style={{ height: 7, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 4, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

function MatchCard({ match, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const pct = match.matchPercentage || 0;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  const parsedFactors = MATCH_FACTORS.map(factor => {
    const reason = match.matchReason || "";
    const matched = reason.toLowerCase().includes(factor.toLowerCase()) &&
      (reason.includes("✅") || reason.includes("match"));
    return { factor, matched };
  });

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try { await onStatusChange(match.id, status); }
    finally { setUpdating(false); }
  };

  const SC = {
    PENDING:   { bg: "rgba(245,158,11,0.12)",  color: "#fcd34d", border: "rgba(245,158,11,0.28)"  },
    CONFIRMED: { bg: "rgba(16,185,129,0.12)",  color: "#6ee7b7", border: "rgba(16,185,129,0.28)"  },
    REJECTED:  { bg: "rgba(239,68,68,0.12)",   color: "#fca5a5", border: "rgba(239,68,68,0.28)"   },
  };
  const sc = SC[match.status] || SC.PENDING;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", marginBottom: 14, transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}28`; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}>
      {/* Confidence accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${color},${color}44)` }} />

      <div style={{ padding: "22px 24px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Confidence circle */}
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: `${color}14`, border: `2px solid ${color}35`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{Math.round(pct)}</div>
              <div style={{ fontSize: 9, color, fontWeight: 700, opacity: 0.8 }}>%</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className={`badge ${pct >= 80 ? "badge-success" : pct >= 60 ? "badge-warning" : "badge-danger"}`} style={{ fontSize: 11 }}>
                  {pct >= 80 ? "High Confidence" : pct >= 60 ? "Moderate Match" : "Low Confidence"}
                </span>
                <div style={{ padding: "3px 10px", background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: sc.color }}>
                  {match.status}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>AI Match #{match.id} · {new Date(match.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
          </div>
        </div>

        {/* Items comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 10, marginBottom: 18, alignItems: "center" }}>
          {/* Lost Item */}
          <div style={{ padding: "14px 16px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: "0.7px", marginBottom: 8, textTransform: "uppercase" }}>📦 Lost Item</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "'Space Grotesk',sans-serif" }}>{match.lostItem?.itemName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {match.lostItem?.category && <div style={{ fontSize: 12, color: "#64748b" }}>📂 {match.lostItem.category}</div>}
              {match.lostItem?.color    && <div style={{ fontSize: 12, color: "#64748b" }}>🎨 {match.lostItem.color}</div>}
              {match.lostItem?.location && <div style={{ fontSize: 12, color: "#64748b" }}>📍 {match.lostItem.location}</div>}
            </div>
          </div>

          {/* Connector */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: 1, height: 10, background: `${color}40`, borderRadius: 1 }} />
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}14`, border: `1.5px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ width: 1, height: 10, background: `${color}40`, borderRadius: 1 }} />
          </div>

          {/* Found Item */}
          <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6ee7b7", letterSpacing: "0.7px", marginBottom: 8, textTransform: "uppercase" }}>🔍 Found Item</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "'Space Grotesk',sans-serif" }}>{match.foundItem?.itemName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {match.foundItem?.category && <div style={{ fontSize: 12, color: "#64748b" }}>📂 {match.foundItem.category}</div>}
              {match.foundItem?.color    && <div style={{ fontSize: 12, color: "#64748b" }}>🎨 {match.foundItem.color}</div>}
              {match.foundItem?.location && <div style={{ fontSize: 12, color: "#64748b" }}>📍 {match.foundItem.location}</div>}
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div style={{ marginBottom: 14 }}>
          <ConfidenceBar pct={pct} />
        </div>

        {/* Factor chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {parsedFactors.map(({ factor, matched }) => (
            <div key={factor} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 11px", background: matched ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${matched ? "rgba(16,185,129,0.22)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, transition: "all 0.2s" }}>
              <span style={{ fontSize: 10 }}>{matched ? "✓" : "○"}</span>
              <span style={{ fontSize: 11, color: matched ? "#6ee7b7" : "#475569", fontWeight: matched ? 600 : 400 }}>{factor}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        {match.status === "PENDING" && (
          <div style={{ display: "flex", gap: 8, marginBottom: expanded ? 16 : 0 }}>
            <button onClick={() => handleStatusChange("CONFIRMED")} disabled={updating} className="btn-success" style={{ flex: 1, justifyContent: "center" }}>
              {updating ? <div className="spinner" style={{ borderTopColor: "#10b981" }} /> : "✅ Confirm Match"}
            </button>
            <button onClick={() => handleStatusChange("REJECTED")} disabled={updating} className="btn-danger" style={{ flex: 1, justifyContent: "center" }}>
              {updating ? <div className="spinner" style={{ borderTopColor: "#ef4444" }} /> : "❌ Reject"}
            </button>
            <button onClick={() => setExpanded(!expanded)} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
              {expanded ? "▲" : "▼"}
            </button>
          </div>
        )}

        {/* AI Reasoning */}
        {(expanded || match.status !== "PENDING") && match.matchReason && (
          <div style={{ marginTop: 12, padding: "16px 18px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🧠</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>Explainable AI — Why This Match?</span>
            </div>
            <pre style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Inter',sans-serif", margin: 0 }}>
              {match.matchReason}
            </pre>
          </div>
        )}
        {match.status !== "PENDING" && match.matchReason && (
          <button onClick={() => setExpanded(!expanded)} style={{ marginTop: 10, fontSize: 12, color: "#475569", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
            onMouseLeave={e => e.currentTarget.style.color = "#475569"}>
            {expanded ? "▲ Hide AI reasoning" : "▼ Show AI reasoning"}
          </button>
        )}
      </div>
    </div>
  );
}

function MatchesPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  useEffect(() => { loadMatches(); }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadMatches = async () => {
    try {
      const res = await getAllMatches();
      const unique = [];
      const seen = new Set();
      res.data.forEach(m => {
        const key = `${m.lostItem?.id}-${m.foundItem?.id}`;
        if (!seen.has(key)) { seen.add(key); unique.push(m); }
      });
      setMatches(unique.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0)));
    } catch { showToast("Failed to load matches", "error"); }
    finally { setLoading(false); }
  };

  const triggerMatching = async () => {
    setRunning(true);
    try {
      const res = await findMatches();
      showToast(`🤖 AI found ${res.data.data || 0} new matches!`, "success");
      await loadMatches();
    } catch { showToast("Matching engine failed", "error"); }
    finally { setRunning(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMatchStatus(id, status);
      showToast(`Match ${status.toLowerCase()} successfully`);
      setMatches(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch { showToast("Failed to update status", "error"); }
  };

  const filtered = filter === "ALL" ? matches : matches.filter(m => m.status === filter);
  const stats = {
    total: matches.length,
    high: matches.filter(m => m.matchPercentage >= 80).length,
    confirmed: matches.filter(m => m.status === "CONFIRMED").length,
    pending: matches.filter(m => m.status === "PENDING").length,
  };

  const FILTERS = ["ALL", "PENDING", "CONFIRMED", "REJECTED"];
  const filterCount = (f) => f === "ALL" ? matches.length : matches.filter(m => m.status === f).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c1a" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div className="page-header">
            <div className="page-header-text">
              <h1>🤖 AI Smart Matches</h1>
              <p>Multi-factor semantic matching with full AI explainability.</p>
            </div>
            <button onClick={triggerMatching} disabled={running}
              style={{ padding: "11px 22px", background: running ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: running ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 18px rgba(99,102,241,0.35)", transition: "all 0.25s" }}
              onMouseEnter={e => !running && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
              {running ? <><div className="spinner" />Running AI...</> : <>🤖 Run AI Matching</>}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Matches",   value: stats.total,     color: "#6366f1", icon: "🔗" },
              { label: "High Confidence", value: stats.high,      color: "#10b981", icon: "⬆️" },
              { label: "Confirmed",       value: stats.confirmed, color: "#22d3ee", icon: "✅" },
              { label: "Pending Review",  value: stats.pending,   color: "#f59e0b", icon: "⏳" },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: "18px 20px", animation: `fadeIn 0.4s ${i * 0.08}s ease both`, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}14`, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{loading ? "—" : s.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 7, marginBottom: 22, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "8px 18px", background: filter === f ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)", color: filter === f ? "#a5b4fc" : "#64748b", border: `1px solid ${filter === f ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {f} <span style={{ opacity: 0.7 }}>({filterCount(f)})</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
              <div className="spinner" style={{ margin: "0 auto 16px", width: 32, height: 32, borderWidth: 3 }} />
              <p style={{ fontSize: 14 }}>Loading AI matches...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>🤖</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>No matches yet</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                {filter !== "ALL" ? `No ${filter.toLowerCase()} matches found.` : "Report lost and found items, then run AI matching to discover connections."}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={triggerMatching} className="btn-primary">🤖 Run AI Matching</button>
                <button onClick={() => navigate("/lost-items")} className="btn-secondary">📦 Report Lost Item</button>
              </div>
            </div>
          ) : (
            <div>
              {filtered.map(match => (
                <MatchCard key={match.id} match={match} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      </main>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default MatchesPage;
