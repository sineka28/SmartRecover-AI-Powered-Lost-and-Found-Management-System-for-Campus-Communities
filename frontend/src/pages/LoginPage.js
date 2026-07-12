import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      const { token, name, role, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      navigate(role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0f1e", fontFamily: "'Inter',sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Blobs */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)", top: -100, left: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)", bottom: 0, right: 0, pointerEvents: "none" }} />

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />

      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", display: "none" }}
        className="landing-left">
      </div>

      {/* Center form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 440, animation: "fadeInScale 0.5s ease both" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 8px 24px rgba(99,102,241,0.5)", marginBottom: 16 }}>🧠</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: "#64748b" }}>Sign in to SmartRecover AI</p>
          </div>

          {/* Card */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px", backdropFilter: "blur(20px)" }}>
            <form onSubmit={handleLogin}>
              {error && (
                <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#fca5a5", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  ❌ {error}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@university.edu" required className="form-input" />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="form-label">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className="form-input" />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", boxShadow: loading ? "none" : "0 6px 24px rgba(99,102,241,0.4)" }}>
                {loading ? <><div className="spinner" />Signing in...</> : <>🔐 Sign In</>}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 20 }} />
              <p style={{ fontSize: 13, color: "#64748b" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#818cf8", fontWeight: 600, transition: "color 0.2s" }}>Create Account →</Link>
              </p>
            </div>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#64748b" }}>Demo: Register a new account or use admin@demo.com / admin123 for admin access</p>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#334155" }}>
            <Link to="/" style={{ color: "#475569" }}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
