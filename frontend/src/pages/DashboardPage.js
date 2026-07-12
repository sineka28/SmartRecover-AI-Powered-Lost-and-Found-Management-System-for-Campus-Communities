import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import { getMyLostItems } from "../api/lostItemApi";
import { getMyFoundItems } from "../api/foundItemApi";
import { getAllMatches } from "../api/matchApi";
import { getUnreadCount, getMyNotifications } from "../api/notificationApi";
import { getAnalytics } from "../api/analyticsApi";

function DashboardPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, matchCount: 0, notifications: 0, recoveryRate: 0 });
  const [recentLost, setRecentLost] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lostRes, foundRes, matchRes, notifCountRes, notifRes, analyticsRes] = await Promise.allSettled([
        getMyLostItems(),
        getMyFoundItems(),
        getAllMatches(),
        getUnreadCount(),
        getMyNotifications(),
        getAnalytics(),
      ]);

      const lostItems = lostRes.status === "fulfilled" ? lostRes.value.data : [];
      const foundItems = foundRes.status === "fulfilled" ? foundRes.value.data : [];
      const matches = matchRes.status === "fulfilled" ? matchRes.value.data : [];
      const notifCount = notifCountRes.status === "fulfilled" ? notifCountRes.value.data.count : 0;
      const notifs = notifRes.status === "fulfilled" ? notifRes.value.data : [];
      const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value.data : {};

      setStats({
        lostCount: lostItems.length,
        foundCount: foundItems.length,
        matchCount: matches.length,
        notifications: notifCount,
        recoveryRate: analytics.recoveryRate || 0,
      });
      setRecentLost(lostItems.slice(0, 3));
      setRecentMatches(matches.slice(0, 3));
      setRecentNotifications(notifs.slice(0, 4));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      OPEN: { cls: "badge-warning", label: "Open" },
      MATCHED: { cls: "badge-primary", label: "Matched" },
      RECOVERED: { cls: "badge-success", label: "Recovered" },
      PENDING: { cls: "badge-warning", label: "Pending" },
      CONFIRMED: { cls: "badge-success", label: "Confirmed" },
      REJECTED: { cls: "badge-danger", label: "Rejected" },
    };
    const b = map[status] || { cls: "badge-primary", label: status };
    return <span className={`badge ${b.cls}`}>{b.label}</span>;
  };

  const notifIcons = { MATCH: "🤖", CLAIM: "📋", INFO: "ℹ️", ALERT: "⚠️" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* ── Header ── */}
          <div style={{ marginBottom: 32, animation: "fadeIn 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>
                  👋 Welcome back, {userName.split(" ")[0]}
                </h1>
                <p style={{ color: "#64748b", fontSize: 14 }}>
                  Here's what's happening with your lost &amp; found items today.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => navigate("/lost-items")} className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
                  📦 Report Lost
                </button>
                <button onClick={() => navigate("/found-items")} style={{ padding: "10px 20px", background: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  🔍 Report Found
                </button>
              </div>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="stats-grid animate-fade-in">
            <StatsCard icon="📦" label="Lost Items Reported" value={loading ? "—" : stats.lostCount} sublabel="By you" color="#6366f1" delay={0} />
            <StatsCard icon="🔍" label="Found Items Reported" value={loading ? "—" : stats.foundCount} sublabel="By you" color="#10b981" delay={100} />
            <StatsCard icon="🤖" label="AI Matches Found" value={loading ? "—" : stats.matchCount} sublabel="Total in system" color="#8b5cf6" delay={200} />
            <StatsCard icon="🔔" label="Unread Notifications" value={loading ? "—" : stats.notifications} sublabel="Awaiting review" color="#f59e0b" delay={300} />
          </div>

          {/* Recovery Progress */}
          <div className="glass-card animate-fade-in-2" style={{ padding: "24px 28px", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>📊 Campus Recovery Rate</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI-powered matching performance</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{stats.recoveryRate}%</div>
                <div style={{ fontSize: 11, color: "#10b981" }}>↑ System-wide</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ "--target-width": `${stats.recoveryRate}%`, width: `${stats.recoveryRate}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>0%</span>
              <span style={{ fontSize: 11, color: "#475569" }}>100%</span>
            </div>
          </div>

          {/* ── Three-column layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

            {/* Recent Lost Items */}
            <div className="glass-card animate-fade-in-2" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>📦 My Lost Items</h3>
                <button onClick={() => navigate("/lost-items")} style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
              </div>
              {loading ? (
                <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading...</div>
              ) : recentLost.length === 0 ? (
                <div style={{ padding: "32px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                  <p style={{ color: "#475569", fontSize: 13 }}>No lost items reported yet</p>
                  <button onClick={() => navigate("/lost-items")} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, marginTop: 12 }}>+ Report Lost Item</button>
                </div>
              ) : (
                <div>
                  {recentLost.map((item, i) => (
                    <div key={item.id} style={{ padding: "14px 24px", borderBottom: i < recentLost.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 3 }}>{item.itemName}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>📍 {item.location || "Unknown"}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Matches */}
            <div className="glass-card animate-fade-in-3" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>🤖 AI Matches</h3>
                <button onClick={() => navigate("/matches")} style={{ fontSize: 12, color: "#8b5cf6", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
              </div>
              {loading ? (
                <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading...</div>
              ) : recentMatches.length === 0 ? (
                <div style={{ padding: "32px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
                  <p style={{ color: "#475569", fontSize: 13 }}>No matches yet. Report items to trigger AI matching!</p>
                </div>
              ) : (
                <div>
                  {recentMatches.map((match, i) => (
                    <div key={match.id} style={{ padding: "14px 24px", borderBottom: i < recentMatches.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}>
                          {match.lostItem?.itemName || "Unknown"} ↔ {match.foundItem?.itemName || "Unknown"}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>AI Match #{match.id}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: match.matchPercentage >= 80 ? "#6ee7b7" : match.matchPercentage >= 60 ? "#fcd34d" : "#fca5a5" }}>
                          {Math.round(match.matchPercentage)}%
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>match</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Notifications ── */}
          <div className="glass-card animate-fade-in-4" style={{ padding: 0, overflow: "hidden", marginBottom: 28 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>🔔 Recent Notifications</h3>
              <button onClick={() => navigate("/notifications")} style={{ fontSize: 12, color: "#f59e0b", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
            </div>
            {recentNotifications.length === 0 ? (
              <div style={{ padding: "28px 24px", textAlign: "center", color: "#475569", fontSize: 13 }}>No notifications yet — you're all caught up! 🎉</div>
            ) : (
              <div>
                {recentNotifications.map((n, i) => (
                  <div key={n.id} style={{ padding: "14px 24px", borderBottom: i < recentNotifications.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                      {notifIcons[n.type] || "🔔"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: n.isRead ? "#64748b" : "#f1f5f9", lineHeight: 1.5, fontWeight: n.isRead ? 400 : 500 }}>{n.message}</p>
                    </div>
                    {!n.isRead && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: 5 }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Quick Actions ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }} className="animate-fade-in-4">
            {[
              { icon: "📦", title: "Report Lost", desc: "Lost something?", path: "/lost-items", color: "#6366f1" },
              { icon: "🔍", title: "Report Found", desc: "Found something?", path: "/found-items", color: "#10b981" },
              { icon: "🤖", title: "View Matches", desc: "See AI results", path: "/matches", color: "#8b5cf6" },
              { icon: "🧠", title: "AI Agents", desc: "Explore agents", path: "/ai-agents", color: "#22d3ee" },
            ].map((action, i) => (
              <div key={i} onClick={() => navigate(action.path)} style={{ padding: "20px", background: `${action.color}12`, border: `1px solid ${action.color}25`, borderRadius: 14, cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${action.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{action.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{action.title}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{action.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
