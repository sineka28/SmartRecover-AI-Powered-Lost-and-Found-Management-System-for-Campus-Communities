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
  const role     = localStorage.getItem("role") || "STUDENT";
  const isAdmin  = role === "ADMIN";
  const links    = isAdmin ? NAV_ADMIN : NAV_STUDENT;
  const userName = localStorage.getItem("userName") || "User";
  const logout   = () => { localStorage.clear(); navigate("/"); };

  const currentLink = links.find(l => l.path === location.pathname);

  return (
    <>
      {/* ── Top bar ── */}
      <div className="mobile-nav-bar" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "rgba(7,12,26,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 200, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 2px 8px rgba(99,102,241,0.4)" }}>🧠</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>
            SmartRecover <span style={{ color: "#818cf8" }}>AI</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {currentLink && (
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{currentLink.icon} {currentLink.label}</span>
          )}
          <button onClick={() => setOpen(o => !o)}
            style={{ width: 36, height: 36, background: open ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${open ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, color: "#f1f5f9", borderRadius: 9, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Overlay ── */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, backdropFilter: "blur(2px)" }} />
      )}

      {/* ── Drawer ── */}
      <div style={{ position: "fixed", top: 56, left: 0, bottom: 0, width: 264, background: "rgba(7,12,26,0.99)", borderRight: "1px solid rgba(255,255,255,0.07)", zIndex: 301, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", padding: "14px 0", backdropFilter: "blur(24px)" }}>
        {/* User info */}
        <div style={{ padding: "0 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", boxShadow: "0 4px 12px rgba(99,102,241,0.35)", flexShrink: 0 }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
              <span className={`badge ${isAdmin ? "badge-warning" : "badge-primary"}`} style={{ fontSize: 10, marginTop: 2 }}>{isAdmin ? "⚡ Admin" : "👤 Student"}</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}>
          {links.map(link => {
            const active = location.pathname === link.path;
            return (
              <div key={link.path}
                onClick={() => { navigate(link.path); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderRadius: 11, marginBottom: 2, cursor: "pointer", background: active ? "rgba(99,102,241,0.14)" : "transparent", color: active ? "#c7d2fe" : "#94a3b8", fontSize: 14, fontWeight: active ? 600 : 400, transition: "all 0.15s", position: "relative" }}>
                {active && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2.5, background: "linear-gradient(to bottom,#6366f1,#8b5cf6)", borderRadius: 2 }} />}
                <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{link.icon}</span>
                <span>{link.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout}
            style={{ width: "100%", padding: "11px", background: "rgba(239,68,68,0.09)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.16)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.09)"}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
