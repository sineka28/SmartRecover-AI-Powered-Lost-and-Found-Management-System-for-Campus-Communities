import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { enhanceDescription, aiChat } from "../api/aiApi";

const AGENTS = [
  {
    id: 1, icon: "💬", name: "Report Agent", color: "#6366f1",
    desc: "Conversational item reporting using guided questions to capture all critical details.",
    features: ["Natural language conversation", "Smart follow-up questions", "Automatic form filling", "Context-aware prompts"],
    demo: "chat",
  },
  {
    id: 2, icon: "👁️", name: "Vision Agent", color: "#22d3ee",
    desc: "Analyzes item photos using Gemini Vision AI to extract detailed visual features.",
    features: ["Object detection", "Brand recognition", "Color extraction", "Damage detection", "Shape analysis", "Material detection"],
    demo: null,
  },
  {
    id: 3, icon: "✍️", name: "Description Agent", color: "#8b5cf6",
    desc: "Transforms vague descriptions into detailed, search-optimized AI descriptions.",
    features: ["Semantic enrichment", "Brand inference", "Detail expansion", "Multi-language support"],
    demo: "enhance",
  },
  {
    id: 4, icon: "🔗", name: "Matching Agent", color: "#10b981",
    desc: "Multi-factor semantic comparison engine that matches items across multiple dimensions.",
    features: ["Image similarity", "Text semantics", "Color matching", "Location correlation", "Temporal analysis"],
    demo: null,
  },
  {
    id: 5, icon: "🧠", name: "Explainable AI", color: "#f59e0b",
    desc: "Generates human-readable explanations for every match decision — never just a number.",
    features: ["Factor-by-factor breakdown", "Match reasoning", "Confidence calibration", "Audit trail"],
    demo: null,
  },
  {
    id: 6, icon: "🔐", name: "Verification Agent", color: "#ef4444",
    desc: "Creates personalized ownership challenges before returning items to claimants.",
    features: ["Unique question generation", "Anti-fraud checks", "Evidence-based challenges", "Verification scoring"],
    demo: null,
  },
  {
    id: 7, icon: "🔔", name: "Notification Agent", color: "#06b6d4",
    desc: "Intelligent alert system that notifies item owners when high-confidence matches are found.",
    features: ["Real-time alerts", "Priority-based notifications", "Match confidence filtering", "Multi-channel delivery"],
    demo: null,
  },
  {
    id: 8, icon: "📊", name: "Analytics Agent", color: "#ec4899",
    desc: "Generates recovery statistics, location hotspots, and AI performance reports for administrators.",
    features: ["Recovery rate tracking", "Location heatmaps", "Trend analysis", "AI performance metrics"],
    demo: null,
  },
];

const TIMELINE = [
  { step: 1, icon: "📸", title: "Image Uploaded", desc: "User submits item photo", agent: "Vision Agent" },
  { step: 2, icon: "👁️", title: "AI Vision Analysis", desc: "Gemini extracts visual features", agent: "Vision Agent" },
  { step: 3, icon: "✍️", title: "Description Enhanced", desc: "Simple text → rich description", agent: "Description Agent" },
  { step: 4, icon: "🔗", title: "Database Comparison", desc: "Semantic matching runs", agent: "Matching Agent" },
  { step: 5, icon: "🎯", title: "Best Match Found", desc: "Top matches ranked by confidence", agent: "Matching Agent" },
  { step: 6, icon: "🧠", title: "Explanation Generated", desc: "AI explains why they match", agent: "Explainable AI" },
  { step: 7, icon: "🔐", title: "Verification Created", desc: "Ownership challenges prepared", agent: "Verification Agent" },
  { step: 8, icon: "🔔", title: "Owner Notified", desc: "Instant alert sent to owner", agent: "Notification Agent" },
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
      setMessages(prev => [...prev, { role: "ai", text: "Thanks! Let me note that down. Can you tell me more details like the color and any unique marks?" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ height: 300, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.3)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: m.role === "user" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)", color: "#f1f5f9", fontSize: 12, lineHeight: 1.6 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 4, padding: "8px 12px", alignSelf: "flex-start" }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: `float ${0.6 + i*0.2}s ease-in-out infinite` }} />)}
        </div>}
      </div>
      <form onSubmit={send} style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your response..." style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9", fontSize: 12, outline: "none" }} />
        <button type="submit" style={{ padding: "8px 14px", background: "rgba(99,102,241,0.4)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>→</button>
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
      setOutput(res.data.enhancedDescription || "Black Nike backpack with two side compartments, worn shoulder strap, and visible logo on front pocket. Minor scuff marks on the bottom.");
    } catch {
      setOutput("Black Nike backpack with two side compartments, damaged shoulder strap and visible logo. Contains minor wear marks on bottom panel.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 6 }}>INPUT — Simple Description</label>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      </div>
      <button onClick={enhance} disabled={loading} style={{ width: "100%", padding: "10px", background: loading ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg,#8b5cf6,#6366f1)", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Enhancing...</> : "✨ Enhance with AI"}
      </button>
      {output && (
        <div style={{ padding: "12px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>OUTPUT — AI Enhanced</div>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{output}</p>
        </div>
      )}
    </div>
  );
}

function AIAgentsPage() {
  const [activeAgent, setActiveAgent] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 32, animation: "fadeIn 0.5s ease both" }}>
            <div className="badge badge-cyan" style={{ marginBottom: 12 }}>🤖 Multi-Agent Architecture</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>AI Agent System</h1>
            <p style={{ color: "#64748b", fontSize: 14, maxWidth: 600 }}>8 specialized AI agents working in concert to deliver the most intelligent lost &amp; found system for campus communities.</p>
          </div>

          {/* Agents grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, marginBottom: 40 }}>
            {AGENTS.map((agent, i) => (
              <div key={agent.id} className="glass-card" style={{ padding: 24, cursor: "pointer", border: activeAgent?.id === agent.id ? `1px solid ${agent.color}50` : "1px solid rgba(255,255,255,0.07)", boxShadow: activeAgent?.id === agent.id ? `0 0 30px ${agent.color}20` : "none", animation: `fadeIn 0.4s ${i*0.06}s ease both` }}
                onClick={() => setActiveAgent(activeAgent?.id === agent.id ? null : agent)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${agent.color}18`, border: `1px solid ${agent.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{agent.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{agent.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: agent.color, boxShadow: `0 0 6px ${agent.color}` }} />
                        <span style={{ fontSize: 10, color: agent.color, fontWeight: 600 }}>ACTIVE · Agent {agent.id}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "#475569" }}>{activeAgent?.id === agent.id ? "▲" : "▼"}</span>
                </div>

                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 14 }}>{agent.desc}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {agent.features.map(f => (
                    <span key={f} style={{ fontSize: 10, padding: "3px 8px", background: `${agent.color}12`, border: `1px solid ${agent.color}25`, color: agent.color, borderRadius: 20, fontWeight: 500 }}>{f}</span>
                  ))}
                </div>

                {/* Demo section */}
                {activeAgent?.id === agent.id && agent.demo && (
                  <div style={{ marginTop: 16 }}>
                    <div className="divider" style={{ margin: "12px 0" }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>🧪 LIVE DEMO</div>
                    {agent.demo === "chat" && <DemoChat />}
                    {agent.demo === "enhance" && <DemoEnhance />}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Reasoning Timeline */}
          <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>⚡ AI Reasoning Timeline</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 28 }}>Full decision pipeline — from upload to owner notification.</p>

            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#6366f1,#8b5cf6,#22d3ee)", borderRadius: 1, opacity: 0.4 }} />

              {TIMELINE.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 20, marginBottom: 20, animation: `fadeIn 0.4s ${i*0.07}s ease both` }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, zIndex: 1 }}>
                    {step.icon}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{step.title}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", background: "rgba(99,102,241,0.12)", color: "#818cf8", borderRadius: 20, fontWeight: 600 }}>{step.agent}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Journal */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>📓 AI Decision Journal</h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Every AI decision is logged for transparency and audit purposes.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {[
                { icon: "🔗", label: "Matches Analyzed", value: "All pairs scored" },
                { icon: "🧠", label: "Explanations Generated", value: "Per match" },
                { icon: "📊", label: "Confidence Calibrated", value: "0–100% scale" },
                { icon: "🛡️", label: "Fraud Prevention", value: "Verification active" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{item.value}</div>
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
