import { useNavigate, useLocation } from "react-router-dom";
import MobileNav from "./MobileNav";

const NAV_STUDENT = [
  { icon: "⚡", label: "Dashboard",     path: "/dashboard" },
  { icon: "📦", label: "Lost Items",    path: "/lost-items" },
  { icon: "🔍", label: "Found Items",   path: "/found-items" },
  { icon: "🤖", label: "AI Matches",    path: "/matches" },
  { icon: "📋", label: "My Claims",     path: "/claims" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
  { icon: "🧠", label: "AI Agents",     path: "/ai-agents" },
  { icon: "🔎", label: "Search",        path: "/search" },
  { icon: "👤", label: "Profile",       path: "/profile" },
];

const NAV_ADMIN = [
  { icon: "📊", label: "Admin Panel",   path: "/admin" },
  { icon: "👥", label: "Users",         path: "/admin/users" },
  { icon: "🤖", label: "AI Matches",    path: "/matches" },
  { icon: "📋", label: "All Claims",    path: "/admin/claims" },
  { icon: "📦", label: "Lost Items",    path: "/lost-items" },
  { icon: "🔍", label: "Found Items",   path: "/found-items" },
  { icon: "🧠", label: "AI Agents",     path: "/ai-agents" },
  { icon: "🔎", label: "Search",        path: "/search" },
  { icon: "👤", label: "Profile",       path: "/profile" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role     = localStorage.getItem("role") || "STUDENT";
  const userName = localStorage.getItem("userName") || "User";
  const isAdmin  = role === "ADMIN";
  const links    = isAdmin ? NAV_ADMIN : NAV_STUDENT;

  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }} onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>🧠</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>SmartRecover</div>
              <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>AI Platform</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding: "16px 24px 12px" }}>
          <span className={`badge ${isAdmin ? "badge-warning" : "badge-primary"}`} style={{ fontSize: 11 }}>
            {isAdmin ? "⚡ Admin" : "👤 Student"}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>
          {links.map(link => (
            <div
              key={link.path}
              className={`sidebar-link ${location.pathname === link.path ? "active" : ""}`}
              style={{ borderRadius: 10, marginBottom: 2 }}
              onClick={() => navigate(link.path)}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{link.icon}</span>
              <span>{link.label}</span>
            </div>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{isAdmin ? "Administrator" : "Student"}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{ width: "100%", padding: "9px 14px", background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar + drawer ── */}
      <MobileNav />
    </>
  );
}

export default Sidebar;
