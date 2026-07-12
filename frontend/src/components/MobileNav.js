import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

function MobileNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);
  const role    = localStorage.getItem("role") || "STUDENT";
  const isAdmin = role === "ADMIN";
  const links   = isAdmin ? NAV_ADMIN : NAV_STUDENT;
  const userName = localStorage.getItem("userName") || "User";

  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <>
      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "rgba(10,15,30,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 200, backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧠</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>SmartRecover <span style={{ color: "#6366f1" }}>AI</span></span>
        </div>
        <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", color: "#f1f5f9", fontSize: 20, cursor: "pointer", padding: 4 }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300 }} />
      )}

      {/* Drawer */}
      <div style={{ position: "fixed", top: 56, left: 0, bottom: 0, width: 260, background: "rgba(10,15,30,0.99)", borderRight: "1px solid rgba(255,255,255,0.07)", zIndex: 301, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", display: "flex", flexDirection: "column", padding: "16px 0", backdropFilter: "blur(20px)" }}>
        {/* User info */}
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{userName}</div>
              <span className={`badge ${isAdmin ? "badge-warning" : "badge-primary"}`} style={{ fontSize: 10 }}>{isAdmin ? "⚡ Admin" : "👤 Student"}</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
          {links.map(link => (
            <div key={link.path} onClick={() => { navigate(link.path); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 10, marginBottom: 2, cursor: "pointer", background: location.pathname === link.path ? "rgba(99,102,241,0.15)" : "transparent", color: location.pathname === link.path ? "#a5b4fc" : "#94a3b8", fontSize: 14, fontWeight: location.pathname === link.path ? 600 : 400, transition: "all 0.15s" }}>
              <span style={{ fontSize: 16, width: 20 }}>{link.icon}</span>
              <span>{link.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: "16px" }}>
          <button onClick={logout} style={{ width: "100%", padding: "10px", background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
