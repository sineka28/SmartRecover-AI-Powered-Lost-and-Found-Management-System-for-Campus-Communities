import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getMyNotifications, markAsRead, markAllAsRead } from "../api/notificationApi";

const TYPE_CONFIG = {
  MATCH: { icon: "🤖", color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", label: "AI Match" },
  CLAIM: { icon: "📋", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", label: "Claim" },
  INFO:  { icon: "ℹ️", color: "#22d3ee", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)", label: "Info" },
  ALERT: { icon: "⚠️", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "Alert" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  useEffect(() => { loadNotifications(); }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast("All notifications marked as read");
    } catch { showToast("Failed to mark all read", "error"); }
  };

  const filtered = filter === "ALL" ? notifications : filter === "UNREAD" ? notifications.filter(n => !n.isRead) : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeIn 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>🔔 Notifications</h1>
                  {unreadCount > 0 && (
                    <span style={{ padding: "2px 10px", background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{unreadCount}</span>
                  )}
                </div>
                <p style={{ color: "#64748b", fontSize: 14 }}>AI match alerts, claim updates, and system messages.</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} style={{ padding: "10px 20px", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  ✓ Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {["ALL", "UNREAD", "MATCH", "CLAIM", "INFO"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", background: filter === f ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: filter === f ? "#a5b4fc" : "#64748b", border: `1px solid ${filter === f ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {f}
              </button>
            ))}
          </div>

          {/* Notifications */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>You're all caught up!</h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>No {filter !== "ALL" ? filter.toLowerCase() + " " : ""}notifications yet.</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
              {filtered.map((n, i) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                    style={{
                      padding: "16px 24px",
                      display: "flex", alignItems: "flex-start", gap: 14,
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: n.isRead ? "transparent" : "rgba(99,102,241,0.04)",
                      cursor: n.isRead ? "default" : "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { if (!n.isRead) e.currentTarget.style.background = "rgba(99,102,241,0.07)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = n.isRead ? "transparent" : "rgba(99,102,241,0.04)"; }}
                  >
                    {/* Icon */}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: config.bg, border: `1px solid ${config.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: config.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{config.label}</span>
                        {!n.isRead && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px rgba(99,102,241,0.8)" }} />}
                      </div>
                      <p style={{ fontSize: 14, color: n.isRead ? "#64748b" : "#f1f5f9", lineHeight: 1.6, margin: 0, fontWeight: n.isRead ? 400 : 500 }}>{n.message}</p>
                    </div>

                    {/* Time */}
                    <div style={{ fontSize: 11, color: "#334155", flexShrink: 0, marginTop: 2 }}>{timeAgo(n.createdAt)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default NotificationsPage;
