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
        <span style={{ fontSize: 11, color: "#64748b" }}>AI Confidence</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{Math.round(pct)}% · {label}</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function MatchCard({ match, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const pct = match.matchPercentage || 0;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  // Parse match factors from matchReason
  const parsedFactors = MATCH_FACTORS.map(factor => {
    const reason = match.matchReason || "";
    const matched = reason.toLowerCase().includes(factor.toLowerCase()) &&
      (reason.includes("✅") || reason.includes("match"));
    return { factor, matched };
  });

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await onStatusChange(match.id, status);
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    PENDING: { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "rgba(245,158,11,0.3)" },
    CONFIRMED: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)" },
    REJECTED: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" },
  };
  const sc = statusColors[match.status] || statusColors.PENDING;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", transition: "all 0.2s", marginBottom: 16 }}>
      {/* Header bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg,${color},${color}55)` }} />

      <div style={{ padding: 24 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "'Space Grotesk',sans-serif" }}>{Math.round(pct)}%</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
              <span className={`badge ${pct >= 80 ? "badge-success" : pct >= 60 ? "badge-warning" : "badge-danger"}`}>
                {pct >= 80 ? "High Confidence" : pct >= 60 ? "Moderate" : "Low Confidence"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>AI Match #{match.id} · {new Date(match.createdAt).toLocaleDateString()}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ padding: "5px 12px", background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 20, fontSize: 12, fontWeight: 600, color: sc.color }}>
              {match.status}
            </div>
          </div>
        </div>

        {/* Items comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, marginBottom: 20, alignItems: "start" }}>
          {/* Lost Item */}
          <div style={{ padding: "14px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12 }}>
            <div className="badge badge-primary" style={{ marginBottom: 8, fontSize: 10 }}>📦 LOST ITEM</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{match.lostItem?.itemName}</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
              {match.lostItem?.category && <div>📂 {match.lostItem.category}</div>}
              {match.lostItem?.color && <div>🎨 {match.lostItem.color}</div>}
              {match.lostItem?.location && <div>📍 {match.lostItem.location}</div>}
            </div>
          </div>

          {/* Connector */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ width: 2, height: 20, background: `${color}40`, borderRadius: 1 }} />
            <div style={{ fontSize: 10, color: "#475569", textAlign: "center" }}>AI Match</div>
          </div>

          {/* Found Item */}
          <div style={{ padding: "14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12 }}>
            <div className="badge badge-success" style={{ marginBottom: 8, fontSize: 10 }}>🔍 FOUND ITEM</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{match.foundItem?.itemName}</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
              {match.foundItem?.category && <div>📂 {match.foundItem.category}</div>}
              {match.foundItem?.color && <div>🎨 {match.foundItem.color}</div>}
              {match.foundItem?.location && <div>📍 {match.foundItem.location}</div>}
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div style={{ marginBottom: 16 }}>
          <ConfidenceBar pct={pct} />
        </div>

        {/* Factor comparison */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {parsedFactors.map(({ factor, matched }) => (
            <div key={factor} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: matched ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${matched ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20 }}>
              <span style={{ fontSize: 11 }}>{matched ? "✓" : "○"}</span>
              <span style={{ fontSize: 11, color: matched ? "#6ee7b7" : "#475569", fontWeight: matched ? 600 : 400 }}>{factor}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        {match.status === "PENDING" && (
          <div style={{ display: "flex", gap: 10, marginBottom: expanded ? 16 : 0 }}>
            <button onClick={() => handleStatusChange("CONFIRMED")} disabled={updating} className="btn-success" style={{ flex: 1, justifyContent: "center", padding: "10px" }}>
              {updating ? "..." : "✅ Confirm Match"}
            </button>
            <button onClick={() => handleStatusChange("REJECTED")} disabled={updating} className="btn-danger" style={{ flex: 1, justifyContent: "center", padding: "10px" }}>
              {updating ? "..." : "❌ Reject"}
            </button>
            <button onClick={() => setExpanded(!expanded)} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, cursor: "pointer" }}>
              {expanded ? "▲" : "▼"}
            </button>
          </div>
        )}

        {/* Expandable AI reasoning */}
        {(expanded || match.status !== "PENDING") && match.matchReason && (
          <div style={{ marginTop: 12, padding: "16px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🧠</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>Explainable AI — Why This Match?</span>
            </div>
            <pre style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Inter',sans-serif", margin: 0 }}>
              {match.matchReason}
            </pre>
          </div>
        )}

        {match.status !== "PENDING" && (
          <button onClick={() => setExpanded(!expanded)} style={{ marginTop: 8, fontSize: 12, color: "#475569", background: "none", border: "none", cursor: "pointer" }}>
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
    } catch (e) { showToast("Failed to load matches", "error"); }
    finally { setLoading(false); }
  };

  const triggerMatching = async () => {
    setRunning(true);
    try {
      const res = await findMatches();
      showToast(`🤖 AI found ${res.data.data || 0} new matches!`, "success");
      await loadMatches();
    } catch { showToast("Matching failed", "error"); }
    finally { setRunning(false); }
  };

  const handleStatusChange = async (id, status) => {
    const { updateMatchStatus } = await import("../api/matchApi");
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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeIn 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>🤖 AI Smart Matches</h1>
                <p style={{ color: "#64748b", fontSize: 14 }}>Multi-factor semantic matching with full AI explainability.</p>
              </div>
              <button onClick={triggerMatching} disabled={running} style={{ padding: "11px 22px", background: running ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: running ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}>
                {running ? <><div className="spinner" />Running AI...</> : <>🤖 Run AI Matching</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total Matches", value: stats.total, color: "#6366f1" },
              { label: "High Confidence", value: stats.high, color: "#10b981" },
              { label: "Confirmed", value: stats.confirmed, color: "#22d3ee" },
              { label: "Pending Review", value: stats.pending, color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: "18px 20px", animation: `fadeIn 0.4s ${i*0.08}s ease both` }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{loading ? "—" : s.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 18px", background: filter === f ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: filter === f ? "#a5b4fc" : "#64748b", border: `1px solid ${filter === f ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {f} {f === "ALL" ? `(${matches.length})` : `(${matches.filter(m => m.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Matches list */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
              <div className="spinner" style={{ margin: "0 auto 16px", width: 32, height: 32, borderWidth: 3 }} />
              <p style={{ fontSize: 14 }}>Loading AI matches...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>No matches yet</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
                {filter !== "ALL" ? `No ${filter.toLowerCase()} matches.` : "Report lost and found items, then run AI matching to discover connections."}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={triggerMatching} className="btn-primary" style={{ padding: "11px 24px", fontSize: 14 }}>🤖 Run AI Matching</button>
                <button onClick={() => navigate("/lost-items")} className="btn-secondary" style={{ padding: "11px 24px", fontSize: 14 }}>📦 Report Lost Item</button>
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
