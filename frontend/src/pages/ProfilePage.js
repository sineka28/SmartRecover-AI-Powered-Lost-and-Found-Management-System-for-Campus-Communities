import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMyLostItems } from "../api/lostItemApi";
import { getMyFoundItems } from "../api/foundItemApi";
import { getMyClaims } from "../api/claimApi";

function ProfilePage() {
  const navigate = useNavigate();
  const userName  = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const role      = localStorage.getItem("role") || "STUDENT";

  const [stats, setStats]   = useState({ lost: 0, found: 0, claims: 0 });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(userName);

  useEffect(() => {
    Promise.allSettled([getMyLostItems(), getMyFoundItems(), getMyClaims()])
      .then(([l, f, c]) => {
        setStats({
          lost:   l.status === "fulfilled" ? l.value.data.length : 0,
          found:  f.status === "fulfilled" ? f.value.data.length : 0,
          claims: c.status === "fulfilled" ? c.value.data.length : 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const isAdmin = role === "ADMIN";

  const ACTIVITIES = [
    { icon: "📦", label: "Lost items reported", value: stats.lost, color: "#6366f1" },
    { icon: "🔍", label: "Found items reported", value: stats.found, color: "#10b981" },
    { icon: "📋", label: "Claims submitted", value: stats.claims, color: "#f59e0b" },
  ];

  const QUICK_LINKS = [
    { icon: "📦", label: "My Lost Items",    path: "/lost-items",   color: "#6366f1" },
    { icon: "🔍", label: "My Found Items",   path: "/found-items",  color: "#10b981" },
    { icon: "🤖", label: "AI Matches",       path: "/matches",      color: "#8b5cf6" },
    { icon: "📋", label: "My Claims",        path: "/claims",       color: "#f59e0b" },
    { icon: "🔔", label: "Notifications",    path: "/notifications",color: "#22d3ee" },
    { icon: "🧠", label: "AI Agents",        path: "/ai-agents",    color: "#ec4899" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* ── Header card ── */}
          <div className="glass-card animate-fade-in" style={{ padding: 0, overflow: "hidden", marginBottom: 28 }}>
            {/* Banner gradient */}
            <div style={{ height: 120, background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#22d3ee 100%)", position: "relative", overflow: "hidden" }}>
              {/* decorative circles */}
              <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -60, right: -40 }} />
              <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)", bottom: -30, left: 60 }} />
            </div>

            {/* Profile info row */}
            <div style={{ padding: "0 32px 28px", marginTop: -48, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  border: "4px solid #0a0f1e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 800, color: "white",
                  fontFamily: "'Space Grotesk',sans-serif",
                  flexShrink: 0
                }}>
                  {initials}
                </div>

                <div style={{ flex: 1, paddingBottom: 4 }}>
                  {editMode ? (
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        style={{ padding: "8px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(99,102,241,0.5)", borderRadius: 10, color: "#f1f5f9", fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", outline: "none" }}
                      />
                      <button onClick={() => { localStorage.setItem("userName", displayName); setEditMode(false); }} className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Save</button>
                      <button onClick={() => { setDisplayName(userName); setEditMode(false); }} className="btn-secondary" style={{ padding: "8px 18px", fontSize: 13 }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{displayName}</h1>
                      <button onClick={() => setEditMode(true)} style={{ padding: "4px 12px", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✏️ Edit</button>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                    {userEmail && <span style={{ fontSize: 13, color: "#64748b" }}>📧 {userEmail}</span>}
                    <span className={`badge ${isAdmin ? "badge-warning" : "badge-primary"}`} style={{ fontSize: 11 }}>
                      {isAdmin ? "⚡ Admin" : "👤 Student"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => { localStorage.clear(); navigate("/"); }}
                  className="btn-danger"
                  style={{ padding: "10px 20px", fontSize: 13 }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* ── Activity stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} className="glass-card animate-fade-in-2" style={{ padding: "22px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: a.color, fontFamily: "'Space Grotesk',sans-serif" }}>
                  {loading ? "—" : a.value}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{a.label}</div>
              </div>
            ))}
          </div>

          {/* ── Two-column: Account info + Quick Links ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

            {/* Account information */}
            <div className="glass-card animate-fade-in-3" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 20 }}>
                👤 Account Information
              </h3>
              {[
                { label: "Full Name",     value: displayName },
                { label: "Email",         value: userEmail || "Not set" },
                { label: "Role",          value: isAdmin ? "Administrator" : "Student" },
                { label: "Platform",      value: "SmartRecover AI" },
                { label: "Status",        value: "Active" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>
                    {row.label === "Status" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.8)", display: "inline-block" }} />
                        {row.value}
                      </span>
                    ) : row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick navigation */}
            <div className="glass-card animate-fade-in-3" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 20 }}>
                ⚡ Quick Access
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {QUICK_LINKS.map((link, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(link.path)}
                    style={{
                      padding: "14px 12px", background: `${link.color}10`, border: `1px solid ${link.color}25`,
                      borderRadius: 12, cursor: "pointer", transition: "all 0.2s", textAlign: "center"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${link.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{link.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{link.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── AI System info ── */}
          <div className="glass-card animate-fade-in-4" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16 }}>
              🤖 AI System Status
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
              {[
                { name: "Report Agent",       color: "#6366f1" },
                { name: "Vision Agent",        color: "#22d3ee" },
                { name: "Description Agent",   color: "#8b5cf6" },
                { name: "Matching Agent",      color: "#10b981" },
                { name: "Explainable AI",      color: "#f59e0b" },
                { name: "Verification Agent",  color: "#ef4444" },
                { name: "Notification Agent",  color: "#06b6d4" },
                { name: "Analytics Agent",     color: "#ec4899" },
              ].map((agent, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: agent.color, boxShadow: `0 0 8px ${agent.color}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{agent.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#10b981" }}>ACTIVE</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
