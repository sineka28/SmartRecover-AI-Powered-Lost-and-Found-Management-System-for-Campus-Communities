import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import { getMyLostItems } from "../api/lostItemApi";
import { getMyFoundItems } from "../api/foundItemApi";
import { getAllMatches } from "../api/matchApi";
import { getUnreadCount, getMyNotifications } from "../api/notificationApi";
import { getAnalytics } from "../api/analyticsApi";

const STATUS_MAP = {
  OPEN:      { cls: "badge-warning", label: "Open",      dot: "#f59e0b" },
  MATCHED:   { cls: "badge-primary", label: "Matched",   dot: "#6366f1" },
  RECOVERED: { cls: "badge-success", label: "Recovered", dot: "#10b981" },
  PENDING:   { cls: "badge-warning", label: "Pending",   dot: "#f59e0b" },
  CONFIRMED: { cls: "badge-success", label: "Confirmed", dot: "#10b981" },
  REJECTED:  { cls: "badge-danger",  label: "Rejected",  dot: "#ef4444" },
};

const NOTIF_ICONS = { MATCH: "🤖", CLAIM: "📋", INFO: "ℹ️", ALERT: "⚠️" };
const NOTIF_COLORS = { MATCH: "#6366f1", CLAIM: "#f59e0b", INFO: "#22d3ee", ALERT: "#ef4444" };

const QUICK_ACTIONS = [
  { icon: "📦", title: "Report Lost",   desc: "Lost something on campus?", path: "/lost-items",  color: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)" },
  { icon: "🔍", title: "Report Found",  desc: "Found something? Help reunite it.", path: "/found-items", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)" },
  { icon: "🤖", title: "AI Matches",   desc: "View AI-generated matches.", path: "/matches",     color: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)" },
  { icon: "🧠", title: "AI Agents",    desc: "Explore the AI agent system.", path: "/ai-agents",  color: "#22d3ee", gradient: "linear-gradient(135deg,#22d3ee,#0891b2)" },
];

function SkeletonLine({ w = "100%", h = 14, mb = 0 }) {
  return <div className="skeleton" style={{ width: w, height: h, marginBottom: mb, borderRadius: 6 }} />;
}

function DashboardPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, matchCount: 0, notifications: 0, recoveryRate: 0 });
  const [recentLost, setRecentLost] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [lostRes, foundRes, matchRes, notifCountRes, notifRes, analyticsRes] = await Promise.allSettled([
        getMyLostItems(), getMyFoundItems(), getAllMatches(),
        getUnreadCount(), getMyNotifications(), getAnalytics(),
      ]);
      const lostItems  = lostRes.status  === "fulfilled" ? lostRes.value.data  : [];
      const foundItems = foundRes.status === "fulfilled" ? foundRes.value.data : [];
      const matches    = matchRes.status === "fulfilled" ? matchRes.value.data : [];
      const notifCount = notifCountRes.status === "fulfilled" ? notifCountRes.value.data.count : 0;
      const notifs     = notifRes.status === "fulfilled" ? notifRes.value.data : [];
      const analytics  = analyticsRes.status === "fulfilled" ? analyticsRes.value.data : {};
      setStats({ lostCount: lostItems.length, foundCount: foundItems.length, matchCount: matches.length, notifications: notifCount, recoveryRate: analytics.recoveryRate || 0 });
      setRecentLost(lostItems.slice(0, 4));
      setRecentMatches(matches.slice(0, 4));
      setRecentNotifications(notifs.slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status) => {
    const b = STATUS_MAP[status] || { cls: "badge-primary", label: status };
    return <span className={`badge ${b.cls}`}>{b.label}</span>;
  };

  const matchColor = (pct) => pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c1a" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* ── Header ── */}
          <div style={{ marginBottom: 30, animation: "fadeIn 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 5 }}>{greeting}</div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>
                  Welcome back, {userName.split(" ")[0]} 👋
                </h1>
                <p style={{ color: "#64748b", fontSize: 14 }}>Here's what's happening with your lost &amp; found items today.</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => navigate("/lost-items")} className="btn-primary btn-sm">📦 Report Lost</button>
                <button onClick={() => navigate("/found-items")} className="btn-success btn-sm">🔍 Report Found</button>
              </div>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="stats-grid">
            <StatsCard icon="📦" label="Lost Items Reported" value={loading ? "—" : stats.lostCount} sublabel="by you" color="#6366f1" delay={0} />
            <StatsCard icon="🔍" label="Found Items Reported" value={loading ? "—" : stats.foundCount} sublabel="by you" color="#10b981" delay={80} />
            <StatsCard icon="🤖" label="AI Matches" value={loading ? "—" : stats.matchCount} sublabel="in system" color="#8b5cf6" delay={160} />
            <StatsCard icon="🔔" label="Unread Alerts" value={loading ? "—" : stats.notifications} sublabel="awaiting review" color="#f59e0b" delay={240} />
          </div>

          {/* ── Recovery Rate ── */}
          <div className="glass-card animate-fade-in-2" style={{ padding: "22px 26px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 3 }}>📊 Campus Recovery Rate</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>AI-powered matching performance across all users</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stats.recoveryRate}%</div>
                <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>↑ System-wide</div>
              </div>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ "--target-width": `${stats.recoveryRate}%`, width: `${stats.recoveryRate}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>0%</span>
              <span style={{ fontSize: 11, color: "#475569" }}>100%</span>
            </div>
          </div>

          {/* ── Content Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* Lost Items */}
            <div className="glass-card animate-fade-in-2" style={{ padding: 0, overflow: "hidden" }}>
              <div className="panel-header">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>📦 My Lost Items</h3>
                <button onClick={() => navigate("/lost-items")} style={{ fontSize: 12, color: "#818cf8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
              </div>
              {loading ? (
                <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1,2,3].map(i => <SkeletonLine key={i} h={40} />)}
                </div>
              ) : recentLost.length === 0 ? (
                <div style={{ padding: "36px 22px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                  <p style={{ color: "#475569", fontSize: 13, marginBottom: 14 }}>No lost items reported yet</p>
                  <button onClick={() => navigate("/lost-items")} className="btn-primary btn-sm">+ Report Lost Item</button>
                </div>
              ) : (
                <div>
                  {recentLost.map((item, i) => (
                    <div key={item.id} style={{ padding: "13px 22px", borderBottom: i < recentLost.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.itemName}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>📍 {item.location || "Unknown location"}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Matches */}
            <div className="glass-card animate-fade-in-3" style={{ padding: 0, overflow: "hidden" }}>
              <div className="panel-header">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>🤖 AI Matches</h3>
                <button onClick={() => navigate("/matches")} style={{ fontSize: 12, color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
              </div>
              {loading ? (
                <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1,2,3].map(i => <SkeletonLine key={i} h={40} />)}
                </div>
              ) : recentMatches.length === 0 ? (
                <div style={{ padding: "36px 22px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🤖</div>
                  <p style={{ color: "#475569", fontSize: 13 }}>No matches yet — report items to trigger AI matching!</p>
                </div>
              ) : (
                <div>
                  {recentMatches.map((match, i) => {
                    const pct = Math.round(match.matchPercentage || 0);
                    const c = matchColor(pct);
                    return (
                      <div key={match.id} style={{ padding: "13px 22px", borderBottom: i < recentMatches.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {match.lostItem?.itemName || "Unknown"} ↔ {match.foundItem?.itemName || "Unknown"}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Match #{match.id}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: c, fontFamily: "'Space Grotesk',sans-serif" }}>{pct}%</div>
                          <div style={{ height: 3, width: 48, background: `${c}30`, borderRadius: 2, overflow: "hidden", marginTop: 3 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 2 }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Notifications ── */}
          <div className="glass-card animate-fade-in-4" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
            <div className="panel-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>🔔 Recent Notifications</h3>
              <button onClick={() => navigate("/notifications")} style={{ fontSize: 12, color: "#fcd34d", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
            </div>
            {recentNotifications.length === 0 ? (
              <div style={{ padding: "28px 22px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                You're all caught up! 🎉
              </div>
            ) : (
              <div>
                {recentNotifications.map((n, i) => {
                  const nColor = NOTIF_COLORS[n.type] || "#6366f1";
                  return (
                    <div key={n.id} style={{ padding: "13px 22px", borderBottom: i < recentNotifications.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "flex-start", gap: 13 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${nColor}14`, border: `1px solid ${nColor}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                        {NOTIF_ICONS[n.type] || "🔔"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: n.isRead ? "#64748b" : "#e2e8f0", lineHeight: 1.5, fontWeight: n.isRead ? 400 : 500, margin: 0 }}>{n.message}</p>
                      </div>
                      {!n.isRead && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: 5, boxShadow: "0 0 6px rgba(99,102,241,0.8)" }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Quick Actions ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }} className="animate-fade-in-4">
            {QUICK_ACTIONS.map((action, i) => (
              <div key={i} onClick={() => navigate(action.path)}
                style={{ padding: "20px 18px", background: `${action.color}0e`, border: `1px solid ${action.color}22`, borderRadius: 16, cursor: "pointer", transition: "all 0.22s", textAlign: "center", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${action.color}22`; e.currentTarget.style.borderColor = `${action.color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${action.color}22`; }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{action.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Space Grotesk',sans-serif" }}>{action.title}</div>
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{action.desc}</div>
                {/* Corner accent */}
                <div style={{ position: "absolute", bottom: -10, right: -10, width: 50, height: 50, borderRadius: "50%", background: action.color, opacity: 0.07, filter: "blur(12px)" }} />
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
