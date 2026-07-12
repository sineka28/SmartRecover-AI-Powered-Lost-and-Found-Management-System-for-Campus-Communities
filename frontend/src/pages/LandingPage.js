import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AGENTS = [
  { icon: "💬", name: "Report Agent", color: "#6366f1", desc: "Conversational item reporting — asks smart questions to capture every detail." },
  { icon: "👁️", name: "Vision Agent", color: "#22d3ee", desc: "Gemini Vision analyzes uploaded photos: brand, color, damage marks, unique features." },
  { icon: "✍️", name: "Description Agent", color: "#8b5cf6", desc: "Transforms \"black bag\" → \"Black Nike backpack with damaged strap and visible logo.\"" },
  { icon: "🔗", name: "Matching Agent", color: "#10b981", desc: "Multi-factor semantic matching: image, text, color, brand, location & time." },
  { icon: "🧠", name: "Explainable AI", color: "#f59e0b", desc: "Never just shows 94% — always explains WHY two items match, factor by factor." },
  { icon: "🔐", name: "Verification Agent", color: "#ef4444", desc: "Generates ownership questions: \"What sticker was on the laptop lid?\"" },
  { icon: "🔔", name: "Notification Agent", color: "#06b6d4", desc: "Instantly alerts owners when high-confidence matches are found." },
  { icon: "📊", name: "Analytics Agent", color: "#ec4899", desc: "Generates recovery stats, location hotspots, and AI performance reports." },
];

const STATS = [
  { value: "94%", label: "Match Accuracy" },
  { value: "8", label: "AI Agents" },
  { value: "3x", label: "Faster Recovery" },
  { value: "100%", label: "Explainable" },
];

const FEATURES = [
  { icon: "🧠", title: "Multi-Agent AI", desc: "8 specialized AI agents work in concert to maximize recovery rates on campus." },
  { icon: "🔍", title: "Semantic Search", desc: "Understands meaning, not just keywords — find items even with vague descriptions." },
  { icon: "🛡️", title: "Secure Verification", desc: "AI-generated ownership challenges prevent fraudulent claims before items are returned." },
  { icon: "📈", title: "Smart Analytics", desc: "Admin dashboards with recovery rates, location hotspots, and trend analysis." },
  { icon: "⚡", title: "Real-time Matching", desc: "Instant notifications when a match is found with full AI reasoning transparency." },
  { icon: "🎓", title: "Campus-Optimized", desc: "Built for university communities — student IDs, departments, and campus locations." },
];

const WORKFLOW_STEPS = [
  { icon: "📸", label: "Image Uploaded" },
  { icon: "👁️", label: "AI Vision Analysis" },
  { icon: "✍️", label: "Description Enhanced" },
  { icon: "🔗", label: "Database Compared" },
  { icon: "🎯", label: "Best Match Found" },
  { icon: "🧠", label: "Explanation Generated" },
  { icon: "🔐", label: "Verification Created" },
  { icon: "🔔", label: "Owner Notified" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveAgent(a => (a + 1) % AGENTS.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#0a0f1e", color: "#f1f5f9", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* ── Navbar ─────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 40 ? "rgba(10,15,30,0.95)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
        borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>🧠</div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>SmartRecover <span style={{ color: "#6366f1" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={{ padding: "10px 22px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color="#f1f5f9"; e.currentTarget.style.borderColor="rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="#94a3b8"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; }}>
            Sign In
          </button>
          <button onClick={() => navigate("/register")} style={{ padding: "10px 22px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "120px 48px 80px", overflow: "hidden" }}>
        {/* Blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.6 }} />

        <div style={{ textAlign: "center", maxWidth: 820, zIndex: 1, animation: "fadeIn 0.8s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, fontSize: 13, fontWeight: 600, color: "#a5b4fc", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: "pulse-glow 2s infinite", display: "inline-block" }} />
            Multi-Agent AI System · Campus Lost & Found
          </div>

          <h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
            Recover What's Lost<br />
            <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              with AI Intelligence
            </span>
          </h1>

          <p style={{ fontSize: 20, color: "#94a3b8", lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            8 specialized AI agents work together to match lost and found items on campus with up to <strong style={{ color: "#a5b4fc" }}>94% accuracy</strong> — and always explain <em>why</em>.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{ padding: "16px 36px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.5)", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(99,102,241,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,0.5)"; }}>
              🚀 Start for Free
            </button>
            <button onClick={() => document.getElementById("agents").scrollIntoView({ behavior: "smooth" })} style={{ padding: "16px 36px", background: "rgba(255,255,255,0.05)", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
              See AI Agents ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ───────────────────── */}
      <section style={{ padding: "48px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", animation: `fadeIn 0.5s ${i*0.1}s ease both` }}>
              <div style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────── */}
      <section style={{ padding: "96px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-primary" style={{ marginBottom: 16 }}>✨ Why SmartRecover AI?</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16 }}>Built for the AI Era</h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>Every feature is designed to reduce the time between lost and recovered.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: 28, animation: `fadeIn 0.5s ${i*0.08}s ease both` }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Agents ──────────────────────── */}
      <section id="agents" style={{ padding: "96px 48px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-cyan" style={{ marginBottom: 16 }}>🤖 Multi-Agent System</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16 }}>8 Specialized AI Agents</h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>Each agent is an expert in its domain, collaborating to maximize recovery.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {AGENTS.map((agent, i) => (
              <div key={i} className="glass-card" style={{
                padding: 24, cursor: "pointer",
                border: activeAgent === i ? `1px solid ${agent.color}50` : "1px solid rgba(255,255,255,0.06)",
                boxShadow: activeAgent === i ? `0 0 24px ${agent.color}25` : "none",
                animation: `fadeIn 0.5s ${i*0.06}s ease both`,
                transition: "all 0.3s ease"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${agent.color}20`, border: `1px solid ${agent.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{agent.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{agent.name}</div>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{agent.desc}</p>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: agent.color, boxShadow: `0 0 8px ${agent.color}` }} />
                  <span style={{ fontSize: 11, color: agent.color, fontWeight: 600 }}>Agent {i + 1} of 8</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Timeline ──────────────── */}
      <section style={{ padding: "96px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-primary" style={{ marginBottom: 16 }}>⚡ AI Reasoning Timeline</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16 }}>From Upload to Owner Notified</h2>
            <p style={{ color: "#64748b", fontSize: 17 }}>See every step of the AI decision process in real time.</p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 100, animation: `fadeIn 0.4s ${i*0.1}s ease both` }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg,rgba(99,102,241,0.6),rgba(139,92,246,0.4))", minWidth: 20 }} />}
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, boxShadow: "0 0 20px rgba(99,102,241,0.2)" }}>
                    {step.icon}
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg,rgba(139,92,246,0.4),rgba(99,102,241,0.6))", minWidth: 20 }} />}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 10, textAlign: "center", maxWidth: 80, lineHeight: 1.4, fontWeight: 500 }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section style={{ padding: "80px 48px 100px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "60px 48px", background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 24, boxShadow: "0 0 60px rgba(99,102,241,0.15)" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🧠</div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16 }}>
            Ready to Find What's Lost?
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join your campus on SmartRecover AI and experience the most intelligent lost &amp; found system ever built.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{ padding: "15px 36px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.4)", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              🎓 Create Student Account
            </button>
            <button onClick={() => navigate("/login")} style={{ padding: "15px 36px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.color="#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.color="#94a3b8"}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer style={{ padding: "32px 48px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🧠</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>SmartRecover AI</span>
        </div>
        <div style={{ fontSize: 12, color: "#475569" }}>© 2026 SmartRecover AI · Multi-Agent Intelligent Lost &amp; Found System</div>
      </footer>
    </div>
  );
}

export default LandingPage;
