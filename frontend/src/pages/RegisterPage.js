import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", regNo: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    setError("");
    try {
      await registerUser(form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0f1e", fontFamily: "'Inter',sans-serif", position: "relative", overflow: "hidden", padding: "40px 24px" }}>
      {/* Blobs */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)", top: -150, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)", bottom: -100, left: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.05) 1px, transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 480, zIndex: 1, animation: "fadeInScale 0.5s ease both" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 8px 24px rgba(99,102,241,0.5)", marginBottom: 16 }}>🎓</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>Join SmartRecover AI — Step {step} of 2</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.08)", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px", backdropFilter: "blur(20px)" }}>
          <form onSubmit={handleRegister}>
            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#fca5a5", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                ❌ {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div style={{ marginBottom: 18 }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="form-input" />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@university.edu" required className="form-input" />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="form-label">Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" required className="form-input" />
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 18 }}>
                  <label className="form-label">Registration Number <span style={{ color: "#475569", textTransform: "none", fontSize: 11 }}>(optional)</span></label>
                  <input type="text" name="regNo" value={form.regNo} onChange={handleChange} placeholder="e.g. CS20210045" className="form-input" />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="form-label">Phone Number <span style={{ color: "#475569", textTransform: "none", fontSize: 11 }}>(optional)</span></label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+60 12-345 6789" className="form-input" />
                </div>
                <div style={{ padding: "16px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, marginBottom: 24 }}>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                    🔒 Your information is secure. Registration number and phone help verify ownership of recovered items.
                  </p>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} style={{ flex: "0 0 auto", padding: "14px 20px", background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  ← Back
                </button>
              )}
              <button type="submit" disabled={loading} style={{ flex: 1, padding: "14px", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: loading ? "none" : "0 6px 24px rgba(99,102,241,0.4)", transition: "all 0.2s" }}>
                {loading ? <><div className="spinner" />Creating...</> : step === 1 ? <>Continue →</> : <>🚀 Create Account</>}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 20 }} />
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#818cf8", fontWeight: 600 }}>Sign In →</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#334155" }}>
          <Link to="/" style={{ color: "#475569" }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
