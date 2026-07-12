import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMyClaims } from "../api/claimApi";

const STATUS_CONFIG = {
  PENDING:  { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", icon: "⏳" },
  APPROVED: { color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", icon: "✅" },
  REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", icon: "❌" },
};

function ClaimsPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyClaims()
      .then(res => setClaims(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          <div style={{ marginBottom: 28, animation: "fadeIn 0.5s ease both" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>📋 My Claims</h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>Track the status of your item claims.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>Loading...</div>
          ) : claims.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>No claims yet</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>When you claim a found item, it will appear here.</p>
              <button onClick={() => navigate("/found-items")} className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>🔍 Browse Found Items</button>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
              {claims.map((claim, i) => {
                const sc = STATUS_CONFIG[claim.status] || STATUS_CONFIG.PENDING;
                return (
                  <div key={claim.id} style={{ padding: "20px 24px", borderBottom: i < claims.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: sc.bg, border: `1px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {sc.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
                        Claim for "{claim.foundItem?.itemName || "Unknown item"}"
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                        Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                        {claim.adminRemarks && ` · Admin: ${claim.adminRemarks}`}
                      </div>
                      {claim.verificationDetails && (
                        <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                          {claim.verificationDetails.substring(0, 200)}{claim.verificationDetails.length > 200 ? "..." : ""}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "6px 14px", background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 20, fontSize: 12, fontWeight: 700, color: sc.color, flexShrink: 0 }}>
                      {claim.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ClaimsPage;
