import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { enhanceDescription, aiChat } from "../api/aiApi";

const AGENTS = [
  {
    id: 1, icon: "💬", name: "Report Agent", color: "#6366f1", tag: "NLP",
    desc: "Conversational item reporting using guided questions to capture all critical details.",
    features: ["Natural language conversation", "Smart follow-up questions", "Automatic form filling", "Context-aware prompts"],
    demo: "chat",
  },
  {
    id: 2, icon: "👁️", name: "Vision Agent", color: "#22d3ee", tag: "Computer Vision",
    desc: "Analyzes item photos using Gemini Vision AI to extract detailed visual features automatically.",
    features: ["Object detection", "Brand recognition", "Color profiling", "Damage detection", "Shape analysis", "Material detection"],
    demo: null,
  },
  {
    id: 3, icon: "✍️", name: "Description Agent", color: "#8b5cf6", tag: "LLM",
    desc: "Transforms vague descriptions into detailed, search-optimized AI descriptions for better matching.",
    features: ["Semantic enrichment", "Brand inference", "Detail expansion", "Multi-language support"],
    demo: "enhance",
  },
  {
    id: 4, icon: "🔗", name: "Matching Agent", color: "#10b981", tag: "Semantic AI",
    desc: "Multi-factor semantic comparison engine that matches items across multiple dimensions simultaneously.",
    features: ["Image similarity", "Text semantics", "Color matching", "Location correlation", "Temporal analysis"],
    demo: null,
  },
  {
    id: 5, icon: "🧠", name: "Explainable AI", color: "#f59e0b", tag: "XAI",
    desc: "Generates human-readable explanations for every match decision — never just a percentage.",
    features: ["Factor-by-factor breakdown", "Match reasoning", "Confidence calibration", "Audit trail"],
    demo: null,
  },
  {
    id: 6, icon: "🔐", name: "Verification Agent", color: "#ef4444", tag: "Security",
    desc: "Creates personalised ownership challenges before returning items to claimants.",
    features: ["Unique question generation", "Anti-fraud checks", "Evidence-based challenges", "Verification scoring"],
    demo: null,
  },
  {
    id: 7, icon: "🔔", name: "Notification Agent", color: "#06b6d4", tag: "Realtime",
    desc: "Intelligent alert system that notifies item owners when high-confidence matches are found.",
    features: ["Real-time alerts", "Priority-based routing", "Match confidence filtering", "Multi-channel delivery"],
    demo: null,
  },
  {
    id: 8, icon: "📊", name: "Analytics Agent", color: "#ec4899", tag: "Business Intelligence",
    desc: "Generates recovery statistics, location hotspots, and AI performance reports for administrators.",
    features: ["Recovery rate tracking", "Location heatmaps", "Trend analysis", "AI performance metrics"],
    demo: null,
  },
];

const TIMELINE = [
  { step: 1, icon: "📸", title: "Image Uploaded",        desc: "User submits item photo",                agent: "Vision Agent",        color: "#22d3ee" },
  { step: 2, icon: "👁️", title: "AI Vision Analysis",    desc: "Gemini extracts visual features",         agent: "Vision Agent",        color: "#22d3ee" },
  { step: 3, icon: "✍️", title: "Description Enhanced",  desc: "Simple text → rich AI description",      agent: "Description Agent",   color: "#8b5cf6" },
  { step: 4, icon: "🔗", title: "Database Comparison",   desc: "Semantic matching runs across all items",  agent: "Matching Agent",      color: "#10b981" },
  { step: 5, icon: "🎯", title: "Best Match Found",       desc: "Top matches ranked by confidence score",   agent: "Matching Agent",      color: "#10b981" },
  { step: 6, icon: "🧠", title: "Explanation Generated",  desc: "AI explains why items match, factor by factor", agent: "Explainable AI",  color: "#f59e0b" },
  { step: 7, icon: "🔐", title: "Verification Created",   desc: "Ownership challenge questions prepared",   agent: "Verification Agent",  color: "#ef4444" },
  { step: 8, icon: "🔔", title: "Owner Notified",         desc: "Instant alert sent to item owner",         agent: "Notification Agent",  color: "#06b6d4" },
];

function DemoChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm the Report Agent. What item did you lose?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await aiChat(userMsg, "lost_item_reporting");
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply || "Got it! Can you describe it further?" }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Thanks! Can you tell me more — the color and any unique marks?" }]);
    }
    setLoading(false);
  };

  const inputBase = { flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif" };

  return (
    <div style={{ height: 300, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.35)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
            {m.role === "ai" && (
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>🤖</div>
            )}
            <div style={{ maxWidth: "78%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "linear-gradient(135deg,rgba(99,102,241,0.6),rgba(139,92,246,0.5))" : "rgba(255,255,255,0.07)", color: "#f1f5f9", fontSize: 13, lineHeight: 1.55, border: m.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🤖</div>
            <div style={{ display: "flex", gap: 4, padding: "10px 13px", background: "rgba(255,255,255,0.07)", borderRadius: "14px 14px 14px 4px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
            </div>
          </div>
        )}
      </div>
      <form onSubmit={send} style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your response..." style={inputBase} />
        <button type="submit" style={{ padding: "10px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>→</button>
      </form>
    </div>
  );
}

function DemoEnhance() {
  const [input, setInput] = useState("black bag");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const enhance = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await enhanceDescription(input, "Bag/Backpack", "Black");
      setOutput(res.data.enhancedDescription || "Black Nike backpack with two side compartments, worn shoulder strap, and visible logo on front pocket. Minor scuff marks on the bottom panel.");
    } catch {
      setOutput("Black Nike backpack with two side compartments, damaged shoulder strap and visible logo. Contains minor wear marks on the bottom panel.");
    }
    setLoading(false);
  };

  const inputBase = { width: "100%", padding: "11px 13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif" };

  return (
    <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 10, color: "#64748b", fontWeight: 700, display: "block", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>INPUT — Simple Description</label>
        <input value={input} onChange={e => setInput(e.target.value)} style={inputBase} />
      </div>
      <button onClick={enhance} disabled={loading} style={{ width: "100%", padding: "11px", background: loading ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg,#8b5cf6,#6366f1)", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Enhancing...</> : "✨ Enhance with AI"}
      </button>
      {output && (
        <div style={{ padding: 14, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.22)", borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700, marginBottom: 8, letterSpacing: "0.8px", textTransform: "uppercase" }}>✨ AI Enhanced Output</div>
          <p style={{ fontSize: 13, color: "#c4b5fd", lineHeight: 1.7, margin: 0 }}>{output}</p>
        </div>
      )}
    </div>
  );
}

function AIAgentsPage() {
  const [activeAgent, setActiveAgent] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c1a" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 32, animation: "fadeIn 0.5s ease both" }}>
            <div className="badge badge-cyan" style={{ marginBottom: 12 }}>🤖 Multi-Agent Architecture</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>AI Agent System</h1>
            <p style={{ color: "#64748b", fontSize: 14, maxWidth: 580 }}>8 specialized AI agents working in concert to deliver the most intelligent lost &amp; found system ever built for campus communities.</p>
          </div>

          {/* Agent Count Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 8, marginBottom: 32 }}>
            {AGENTS.map((a, i) => (
              <div key={i} title={a.name}
                onClick={() => setActiveAgent(activeAgent?.id === a.id ? null : a)}
                style={{ padding: "10px 6px", background: activeAgent?.id === a.id ? `${a.color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${activeAgent?.id === a.id ? `${a.color}45` : "rgba(255,255,255,0.07)"}`, borderRadius: 12, textAlign: "center", cursor: "pointer", transition: "all 0.22s" }}>
                <div style={{ fontSize: 18 }}>{a.icon}</div>
                <div style={{ fontSize: 9, color: activeAgent?.id === a.id ? a.color : "#475569", fontWeight: 700, marginTop: 4, letterSpacing: "0.3px" }}>#{a.id}</div>
              </div>
            ))}
          </div>

          {/* Agents Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18, marginBottom: 36 }}>
            {AGENTS.map((agent, i) => (
              <div key={agent.id}
                onClick={() => setActiveAgent(activeAgent?.id === agent.id ? null : agent)}
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${activeAgent?.id === agent.id ? `${agent.color}45` : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: 22, cursor: "pointer", transition: "all 0.25s", boxShadow: activeAgent?.id === agent.id ? `0 0 30px ${agent.color}18` : "none", animation: `fadeIn 0.4s ${i * 0.05}s ease both`, position: "relative", overflow: "hidden" }}>
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${agent.color},${agent.color}33)`, opacity: activeAgent?.id === agent.id ? 1 : 0.5, transition: "opacity 0.25s" }} />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${agent.color}16`, border: `1px solid ${agent.color}32`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{agent.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{agent.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: agent.color, boxShadow: `0 0 5px ${agent.color}` }} />
                        <span style={{ fontSize: 10, color: agent.color, fontWeight: 700, letterSpacing: "0.5px" }}>ACTIVE · {agent.tag}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#64748b", flexShrink: 0 }}>
                    {activeAgent?.id === agent.id ? "▲" : "▼"}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 14 }}>{agent.desc}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {agent.features.map(f => (
                    <span key={f} style={{ fontSize: 10, padding: "3px 9px", background: `${agent.color}10`, border: `1px solid ${agent.color}22`, color: agent.color, borderRadius: 20, fontWeight: 600 }}>{f}</span>
                  ))}
                </div>

                {activeAgent?.id === agent.id && agent.demo && (
                  <div style={{ marginTop: 18 }} onClick={e => e.stopPropagation()}>
                    <div className="divider" style={{ margin: "14px 0" }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.8px", textTransform: "uppercase" }}>🧪 Live Demo</div>
                    {agent.demo === "chat" && <DemoChat />}
                    {agent.demo === "enhance" && <DemoEnhance />}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Reasoning Timeline */}
          <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>⚡ AI Reasoning Timeline</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 28 }}>Full decision pipeline — from upload to owner notification.</p>

            <div style={{ position: "relative" }}>
              {/* Gradient line */}
              <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#6366f1,#8b5cf6,#22d3ee,#10b981,#f59e0b,#ef4444,#06b6d4)", borderRadius: 1, opacity: 0.5 }} />

              {TIMELINE.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 20, marginBottom: 18, animation: `fadeIn 0.4s ${i * 0.07}s ease both`, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${step.color}16`, border: `1px solid ${step.color}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, zIndex: 1, boxShadow: `0 0 12px ${step.color}20` }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{step.title}</span>
                      <span style={{ fontSize: 10, padding: "2px 9px", background: `${step.color}14`, color: step.color, borderRadius: 20, fontWeight: 700, letterSpacing: "0.3px" }}>{step.agent}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{step.desc}</p>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2d3748", letterSpacing: "1px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Decision Journal */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 5 }}>📓 AI Decision Journal</h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Every AI decision is logged for transparency and audit purposes.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
              {[
                { icon: "🔗", label: "Matches Analyzed",         value: "All pairs scored",    color: "#10b981" },
                { icon: "🧠", label: "Explanations Generated",   value: "Per match",           color: "#f59e0b" },
                { icon: "📊", label: "Confidence Calibrated",    value: "0–100% scale",        color: "#6366f1" },
                { icon: "🛡️", label: "Fraud Prevention",         value: "Verification active", color: "#ef4444" },
              ].map((item, i) => (
                <div key={i} style={{ padding: 16, background: `${item.color}08`, border: `1px solid ${item.color}18`, borderRadius: 14, position: "relative", overflow: "hidden" }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 3, fontFamily: "'Space Grotesk',sans-serif" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{item.value}</div>
                  <div style={{ position: "absolute", bottom: -10, right: -10, width: 50, height: 50, borderRadius: "50%", background: item.color, opacity: 0.06, filter: "blur(12px)" }} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AIAgentsPage;
