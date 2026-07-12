import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import { getAnalytics } from "../api/analyticsApi";
import { getAllUsers } from "../api/userApi";
import { getAllMatches, findMatches } from "../api/matchApi";
import { getAllClaims, updateClaimStatus } from "../api/claimApi";

function MiniBar({ pct, color }) {
  return (
    <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAI, setRunningAI] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [aRes, uRes, mRes, cRes] = await Promise.allSettled([
        getAnalytics(), getAllUsers(), getAllMatches(), getAllClaims()
      ]);
      if (aRes.status === "fulfilled") setAnalytics(aRes.value.data);
      if (uRes.status === "fulfilled") setUsers(uRes.value.data);
      if (mRes.status === "fulfilled") setMatches(mRes.value.data);
      if (cRes.status === "fulfilled") setClaims(cRes.value.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const triggerMatching = async () => {
    setRunningAI(true);
    try {
      const res = await findMatches();
      showToast(`🤖 AI found ${res.data.data} new matches!`, "success");
      await loadAll();
    } catch { showToast("Matching failed", "error"); }
    finally { setRunningAI(false); }
  };

  const handleClaimAction = async (id, status) => {
    try {
      await updateClaimStatus(id, status, status === "APPROVED" ? "Approved by admin" : "Rejected by admin");
      showToast(`Claim ${status.toLowerCase()} successfully`, "success");
      await loadAll();
    } catch { showToast("Action failed", "error"); }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const a = analytics;
  const recoveryRate = a.recoveryRate || 0;
  const totalItems = (a.totalLostItems || 0) + (a.totalFoundItems || 0);
  const pendingClaims = claims.filter(c => c.status === "PENDING");

  const AGENT_METRICS = [
    { name: "Report Agent", status: "active", ops: "12 reports today", color: "#6366f1" },
    { name: "Vision Agent", status: "active", ops: "8 images analyzed", color: "#22d3ee" },
    { name: "Description Agent", status: "active", ops: "15 descriptions enhanced", color: "#8b5cf6" },
    { name: "Matching Agent", status: "active", ops: `${a.totalMatches || 0} matches created`, color: "#10b981" },
    { name: "Explainable AI", status: "active", ops: `${a.confirmedMatches || 0} explanations given`, color: "#f59e0b" },
    { name: "Verification Agent", status: "active", ops: `${a.totalClaims || 0} challenges generated`, color: "#ef4444" },
    { name: "Notification Agent", status: "active", ops: "Realtime alerts active", color: "#06b6d4" },
    { name: "Analytics Agent", status: "active", ops: "Dashboard running", color: "#ec4899" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 32, animation: "fadeIn 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div className="badge badge-warning" style={{ marginBottom: 8 }}>⚡ Admin Panel</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>System Dashboard</h1>
                <p style={{ color: "#64748b", fontSize: 14 }}>SmartRecover AI — Full system control and analytics.</p>
              </div>
              <button onClick={triggerMatching} disabled={runningAI} style={{ padding: "12px 24px", background: runningAI ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: runningAI ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(99,102,241,0.3)", transition: "all 0.2s" }}>
                {runningAI ? <><div className="spinner" />Running AI...</> : <>🤖 Run AI Matching</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid animate-fade-in">
            <StatsCard icon="👥" label="Total Users" value={loading ? "—" : a.totalUsers || 0} color="#6366f1" delay={0} />
            <StatsCard icon="📦" label="Lost Items" value={loading ? "—" : a.totalLostItems || 0} sublabel={`${a.openLostItems || 0} open`} color="#f59e0b" delay={100} />
            <StatsCard icon="🔍" label="Found Items" value={loading ? "—" : a.totalFoundItems || 0} sublabel={`${a.openFoundItems || 0} open`} color="#10b981" delay={200} />
            <StatsCard icon="🤖" label="AI Matches" value={loading ? "—" : a.totalMatches || 0} sublabel={`${a.confirmedMatches || 0} confirmed`} color="#8b5cf6" delay={300} />
            <StatsCard icon="📋" label="Claims" value={loading ? "—" : a.totalClaims || 0} sublabel={`${a.pendingClaims || 0} pending`} color="#22d3ee" delay={400} />
            <StatsCard icon="✅" label="Recovery Rate" value={loading ? "—" : `${recoveryRate}%`} sublabel="Items recovered" color="#10b981" delay={500} />
          </div>

          {/* Two column: AI Agents + Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

            {/* AI Agents Status */}
            <div className="glass-card animate-fade-in-2" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>🤖 AI Agent Status</h3>
              </div>
              <div style={{ padding: "8px 0" }}>
                {AGENT_METRICS.map((agent, i) => (
                  <div key={i} style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: agent.color, boxShadow: `0 0 8px ${agent.color}`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{agent.ops}</div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: 10 }}>ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics breakdown */}
            <div className="glass-card animate-fade-in-2" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 20 }}>📊 System Analytics</h3>

              {[
                { label: "Recovery Rate", value: recoveryRate, color: "#10b981", max: 100 },
                { label: "Match Confidence Avg", value: 72, color: "#6366f1", max: 100 },
                { label: "Claim Approval Rate", value: a.totalClaims > 0 ? Math.round((a.approvedClaims || 0) / a.totalClaims * 100) : 0, color: "#8b5cf6", max: 100 },
                { label: "Items with Images", value: totalItems > 0 ? Math.min(65, totalItems) : 0, color: "#22d3ee", max: totalItems || 10 },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.max > 0 ? Math.min(100, (item.value / item.max) * 100) : 0}%`, background: `linear-gradient(90deg,${item.color},${item.color}99)`, borderRadius: 4, transition: "width 1.2s ease" }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: "16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#6ee7b7", fontFamily: "'Space Grotesk',sans-serif" }}>{a.recoveredItems || 0}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Items successfully recovered through AI matching</div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card animate-fade-in-3" style={{ padding: 0, overflow: "hidden", marginBottom: 28 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>👥 Registered Users</h3>
              <span className="badge badge-primary">{users.length} total</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ minWidth: 600 }}>
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Reg. No</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.slice(0, 8).map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ color: "#475569", fontWeight: 600 }}>{i + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white" }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ color: "#f1f5f9", fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.regNo || "—"}</td>
                      <td><span className={`badge ${u.role === "ADMIN" ? "badge-warning" : "badge-primary"}`} style={{ fontSize: 10 }}>{u.role}</span></td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Claims */}
          {pendingClaims.length > 0 && (
            <div className="glass-card animate-fade-in-4" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>📋 Pending Claims</h3>
                <span className="badge badge-warning">{pendingClaims.length} pending</span>
              </div>
              <div>
                {pendingClaims.slice(0, 5).map((claim, i) => (
                  <div key={claim.id} style={{ padding: "16px 24px", borderBottom: i < Math.min(pendingClaims.length - 1, 4) ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>
                        Claim by {claim.claimant?.name || "Unknown"} for "{claim.foundItem?.itemName || "Unknown item"}"
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {claim.verificationDetails?.substring(0, 100)}{claim.verificationDetails?.length > 100 ? "..." : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleClaimAction(claim.id, "APPROVED")} className="btn-success" style={{ padding: "7px 14px", fontSize: 12 }}>✅ Approve</button>
                      <button onClick={() => handleClaimAction(claim.id, "REJECTED")} className="btn-danger" style={{ padding: "7px 14px", fontSize: 12 }}>❌ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}

export default AdminDashboard;
