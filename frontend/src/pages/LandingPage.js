import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AGENTS = [
  { icon: "💬", name: "Report Agent",      color: "#6366f1", tag: "NLP",      desc: "Conversational guided reporting — extracts every detail through smart dialogue." },
  { icon: "👁️", name: "Vision Agent",      color: "#22d3ee", tag: "CV",       desc: "Gemini Vision analyzes photos: brand, color, damage, unique features." },
  { icon: "✍️", name: "Description Agent", color: "#8b5cf6", tag: "LLM",      desc: "Transforms \"black bag\" → rich, searchable, AI-optimized descriptions." },
  { icon: "🔗", name: "Matching Agent",    color: "#10b981", tag: "Semantic",  desc: "Multi-factor semantic matching: image, text, color, brand, location, time." },
  { icon: "🧠", name: "Explainable AI",    color: "#f59e0b", tag: "XAI",      desc: "Always explains WHY two items match — factor by factor, never just a score." },
  { icon: "🔐", name: "Verification Agent",color: "#ef4444", tag: "Security", desc: "Generates personal ownership challenges to prevent fraudulent claims." },
  { icon: "🔔", name: "Notification Agent",color: "#06b6d4", tag: "Realtime", desc: "Instant alerts when high-confidence matches are found for your items." },
  { icon: "📊", name: "Analytics Agent",   color: "#ec4899", tag: "BI",       desc: "Recovery stats, location hotspots, and AI performance reports." },
];

const STATS = [
  { value: "94%", label: "Match Accuracy",   sub: "Semantic AI" },
  { value: "8",   label: "AI Agents",        sub: "Specialized" },
  { value: "3×",  label: "Faster Recovery",  sub: "vs manual" },
  { value: "100%", label: "Explainable",     sub: "Every decision" },
];

const FEATURES = [
  { icon: "🧠", title: "Multi-Agent AI",      color: "#6366f1", desc: "8 specialized agents collaborate to maximize recovery rates on campus." },
  { icon: "🔍", title: "Semantic Search",      color: "#22d3ee", desc: "Understands meaning — finds items even with vague or partial descriptions." },
  { icon: "🛡️", title: "Fraud Prevention",    color: "#ef4444", desc: "AI-generated ownership challenges before any item is returned." },
  { icon: "📈", title: "Smart Analytics",      color: "#ec4899", desc: "Admin dashboards with recovery rates, hotspots, and trend analysis." },
  { icon: "⚡", title: "Real-time Matching",   color: "#f59e0b", desc: "Instant notifications with full AI reasoning transparency." },
  { icon: "🎓", title: "Campus-Optimised",    color: "#10b981", desc: "Built for universities — student IDs, departments, campus locations." },
];

const STEPS = [
  { icon: "📸", label: "Upload Photo",         agent: "Vision Agent",       color: "#22d3ee" },
  { icon: "✍️", label: "Enhance Description",  agent: "Description Agent",  color: "#8b5cf6" },
  { icon: "🔗", label: "Semantic Match",       agent: "Matching Agent",     color: "#10b981" },
  { icon: "🧠", label: "Explain Decision",     agent: "Explainable AI",     color: "#f59e0b" },
  { icon: "🔐", label: "Verify Ownership",     agent: "Verification Agent", color: "#ef4444" },
  { icon: "🔔", label: "Notify Owner",         agent: "Notification Agent", color: "#06b6d4" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveAgent(a => (a + 1) % AGENTS.length), 2400);
    return () => clearInterval(t);
  }, []);

  const scrolled = scrollY > 48;

  return (
    <div style={{ background: "#070c1a", color: "#f1f5f9", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 clamp(20px,4vw,56px)", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(7,12,26,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}>🧠</div>
          <span style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
            SmartRecover <span style={{ color: "#818cf8" }}>AI</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => navigate("/login")}
            style={{ padding: "9px 20px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
            Sign In
          </button>
          <button onClick={() => navigate("/register")}
            style={{ padding: "9px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4)"; }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "110px clamp(20px,5vw,80px) 80px", overflow: "hidden" }}>
        {/* Background elements */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.07) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 100%)" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 440px", gap: 64, alignItems: "center", zIndex: 1 }}>
          {/* Left */}
          <div style={{ animation: "fadeIn 0.8s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.28)", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#a5b4fc", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse-glow 2s infinite" }} />
              Multi-Agent AI System · Campus Lost &amp; Found
            </div>

            <h1 style={{ fontSize: "clamp(38px,6vw,66px)", fontWeight: 900, lineHeight: 1.07, marginBottom: 22, fontFamily: "'Space Grotesk',sans-serif" }}>
              Recover What's Lost<br />
              <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                with AI Intelligence
              </span>
            </h1>

            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.75, marginBottom: 38, maxWidth: 520 }}>
              8 specialized AI agents work in concert to match lost and found items on campus with up to{" "}
              <strong style={{ color: "#a5b4fc" }}>94% accuracy</strong> — and always explain <em>why</em>.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")}
                style={{ padding: "15px 34px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.5)", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.5)"; }}>
                🚀 Start for Free
              </button>
              <button onClick={() => document.getElementById("agents").scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "15px 34px", background: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}>
                See AI Agents ↓
              </button>
            </div>

            {/* Trust row */}
            <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              {["✅ Free to use", "⚡ Real-time matching", "🔒 Secure & private"].map((t, i) => (
                <div key={i} style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Right: Animated AI card */}
          <div style={{ animation: "float 5s ease-in-out infinite", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {AGENTS.map((agent, i) => (
              <div key={i}
                style={{
                  padding: "14px 16px",
                  background: activeAgent === i ? `${agent.color}12` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeAgent === i ? `${agent.color}45` : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 14,
                  transition: "all 0.35s ease",
                  boxShadow: activeAgent === i ? `0 0 20px ${agent.color}20` : "none",
                  cursor: "default",
                }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{agent.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: activeAgent === i ? agent.color : "#94a3b8", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 2 }}>{agent.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: activeAgent === i ? agent.color : "#475569", boxShadow: activeAgent === i ? `0 0 6px ${agent.color}` : "none", transition: "all 0.3s" }} />
                  <span style={{ fontSize: 10, color: activeAgent === i ? agent.color : "#475569", fontWeight: 600 }}>{agent.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ────────────────────────────────── */}
      <section style={{ padding: "52px clamp(20px,5vw,80px)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", animation: `fadeIn 0.5s ${i * 0.1}s ease both`, padding: "8px 0" }}>
              <div style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section style={{ padding: "96px clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="badge badge-primary" style={{ marginBottom: 14 }}>✨ Why SmartRecover AI?</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Built for the AI Era</h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>Every feature is engineered to cut the time between lost and recovered.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ padding: 26, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, transition: "all 0.25s", animation: `fadeIn 0.5s ${i * 0.07}s ease both`, position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}35`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${f.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                {/* Left accent */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${f.color}, ${f.color}44)`, borderRadius: "2px 0 0 2px" }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}14`, border: `1px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "'Space Grotesk',sans-serif" }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Agents ───────────────────────────────────── */}
      <section id="agents" style={{ padding: "96px clamp(20px,5vw,80px)", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="badge badge-cyan" style={{ marginBottom: 14 }}>🤖 Multi-Agent System</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>8 Specialized AI Agents</h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>Each agent is an expert in its domain — collaborating seamlessly to maximise recovery.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18 }}>
            {AGENTS.map((agent, i) => (
              <div key={i} style={{
                padding: 22, borderRadius: 18, cursor: "default",
                background: activeAgent === i ? `${agent.color}10` : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeAgent === i ? `${agent.color}40` : "rgba(255,255,255,0.07)"}`,
                boxShadow: activeAgent === i ? `0 0 28px ${agent.color}18` : "none",
                animation: `fadeIn 0.5s ${i * 0.06}s ease both`,
                transition: "all 0.3s ease", position: "relative", overflow: "hidden",
              }}>
                {/* Top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${agent.color},${agent.color}44)`, opacity: activeAgent === i ? 1 : 0, transition: "opacity 0.3s" }} />

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${agent.color}18`, border: `1px solid ${agent.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{agent.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{agent.name}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: agent.color, boxShadow: `0 0 5px ${agent.color}` }} />
                      <span style={{ fontSize: 10, color: agent.color, fontWeight: 700, letterSpacing: "0.5px" }}>{agent.tag}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Pipeline ─────────────────────────────────── */}
      <section style={{ padding: "96px clamp(20px,5vw,80px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="badge badge-primary" style={{ marginBottom: 14 }}>⚡ AI Reasoning Pipeline</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>From Upload to Owner Notified</h2>
            <p style={{ color: "#64748b", fontSize: 17 }}>Every step of the AI decision process, in real time.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ padding: "22px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, animation: `fadeIn 0.5s ${i * 0.09}s ease both`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 12, right: 14, fontSize: 11, fontWeight: 800, color: "#475569", letterSpacing: "1px" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: `${step.color}14`, border: `1px solid ${step.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{step.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Space Grotesk',sans-serif" }}>{step.label}</div>
                <div style={{ fontSize: 11, color: step.color, fontWeight: 600 }}>{step.agent}</div>
                {/* Bottom accent */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${step.color}60,transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{ padding: "80px clamp(20px,5vw,80px) 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "64px 48px", background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.07))", border: "1px solid rgba(99,102,241,0.22)", borderRadius: 28, boxShadow: "0 0 80px rgba(99,102,241,0.12)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 18 }}>🧠</div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Ready to Find What's Lost?</h2>
            <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>Join your campus on SmartRecover AI — the most intelligent lost &amp; found system ever built.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")}
                style={{ padding: "14px 34px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.45)", transition: "all 0.25s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                🎓 Create Student Account
              </button>
              <button onClick={() => navigate("/login")}
                style={{ padding: "14px 34px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ padding: "28px clamp(20px,5vw,56px)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🧠</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>SmartRecover AI</span>
        </div>
        <div style={{ fontSize: 12, color: "#475569" }}>© 2026 SmartRecover AI · Multi-Agent Intelligent Lost &amp; Found System</div>
      </footer>
    </div>
  );
}

export default LandingPage;
