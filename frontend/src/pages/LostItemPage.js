import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { addLostItem } from "../api/lostItemApi";
import { uploadFile } from "../api/fileUploadApi";
import { enhanceDescription } from "../api/aiApi";

const CATEGORIES = ["Electronics", "Bag/Backpack", "Clothing", "Documents/Cards", "Keys", "Jewelry/Accessories", "Books/Stationery", "Sports Equipment", "Wallet/Purse", "Umbrella", "Water Bottle", "Other"];
const LOCATIONS  = ["Library", "Cafeteria", "Main Hall", "Block A", "Block B", "Block C", "Block D", "Lab 1", "Lab 2", "Sports Complex", "Parking Lot", "Bus Stop", "Lecture Hall", "Auditorium", "Other"];

const CHAT_STEPS = [
  { key: "itemName",    question: "What item did you lose?",                       placeholder: "e.g., Black laptop, blue umbrella, Samsung phone..." },
  { key: "category",   question: "What category does it belong to?",               placeholder: "e.g., Electronics, Bag, Documents..." },
  { key: "color",      question: "What colour is it?",                             placeholder: "e.g., Black, Blue, Silver with white logo..." },
  { key: "location",   question: "Where did you last see it?",                     placeholder: "e.g., Library 2nd floor, near the computer lab..." },
  { key: "lostDate",   question: "When did you lose it?",                          placeholder: "YYYY-MM-DD", type: "date" },
  { key: "description", question: "Any unique features? Stickers, scratches, what was inside?", placeholder: "Describe any unique identifying marks..." },
];

const inputStyle = {
  width: "100%", padding: "13px 15px",
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12, color: "#f1f5f9", fontSize: 14, outline: "none",
  fontFamily: "'Inter',sans-serif", boxSizing: "border-box", transition: "all 0.2s",
};
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.6px" };

function LostItemPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("chat");
  const [chatStep, setChatStep] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "👋 Hi! I'm the Report Agent. I'll help you document your lost item through a quick conversation. Let's start!" },
    { role: "ai", text: CHAT_STEPS[0].question },
  ]);
  const [formData, setFormData] = useState({ itemName: "", category: "", color: "", location: "", lostDate: "", description: "" });
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [enhancing, setEnhancing]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatInput("");
    const currentStep = CHAT_STEPS[chatStep];
    setChatHistory(prev => [...prev, { role: "user", text: userMessage }]);
    const updatedForm = { ...formData, [currentStep.key]: userMessage };
    setFormData(updatedForm);
    const nextStep = chatStep + 1;
    if (nextStep < CHAT_STEPS.length) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: "ai", text: CHAT_STEPS[nextStep].question }]);
        setChatStep(nextStep);
      }, 380);
    } else {
      setChatStep(nextStep);
      setTimeout(async () => {
        setChatHistory(prev => [...prev, { role: "ai", text: "✨ Description Agent is enhancing your report with AI..." }]);
        try {
          const res = await enhanceDescription(updatedForm.description, updatedForm.category, updatedForm.color);
          const enhanced = res.data.enhancedDescription || updatedForm.description;
          setFormData(f => ({ ...f, description: enhanced }));
          setChatHistory(prev => [...prev, {
            role: "ai",
            text: `✅ Report complete! Here's your summary:\n\n📦 ${updatedForm.itemName} (${updatedForm.category})\n📍 Last seen: ${updatedForm.location}\n🎨 Colour: ${updatedForm.color}\n📅 Lost: ${updatedForm.lostDate}\n\nAI has enhanced your description. Click "Submit Report" below.`,
          }]);
        } catch {
          setChatHistory(prev => [...prev, { role: "ai", text: "✅ Report complete! Click Submit Report below to proceed." }]);
        }
      }, 600);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description) return showToast("Enter a description first", "error");
    setEnhancing(true);
    try {
      const res = await enhanceDescription(formData.description, formData.category, formData.color);
      setFormData(f => ({ ...f, description: res.data.enhancedDescription || f.description }));
      showToast("✨ Description enhanced by AI!", "success");
    } catch { showToast("AI enhancement unavailable", "info"); }
    finally { setEnhancing(false); }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) { const u = await uploadFile(imageFile); imageUrl = u.data.url; }
      await addLostItem({ ...formData, imageUrl });
      showToast("📦 Lost item reported! AI is now matching...", "success");
      setTimeout(() => navigate("/matches"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit report", "error");
    } finally { setLoading(false); }
  };

  const allFieldsFilled = formData.itemName && formData.location && formData.lostDate;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c1a" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div className="page-header">
            <div className="page-header-text">
              <h1>📦 Report Lost Item</h1>
              <p>Use the AI chat agent or fill in the form manually.</p>
            </div>
            {/* Mode toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 4, gap: 4 }}>
              {[{ id: "chat", label: "💬 AI Chat Agent" }, { id: "form", label: "📝 Form Mode" }].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  style={{ padding: "8px 16px", background: mode === m.id ? "linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2))" : "transparent", color: mode === m.id ? "#c7d2fe" : "#64748b", border: `1px solid ${mode === m.id ? "rgba(99,102,241,0.4)" : "transparent"}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mode === "chat" ? "1fr 360px" : "1fr", gap: 22, maxWidth: 1100 }}>

            {/* Chat Mode */}
            {mode === "chat" ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", height: 590 }}>
                {/* Chat header */}
                <div style={{ padding: "15px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 12, background: "rgba(99,102,241,0.05)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>💬</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>Report Agent</div>
                    <div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 5, color: "#10b981" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 5px rgba(16,185,129,0.8)" }} />
                      Active · NLP-powered
                    </div>
                  </div>
                  {chatStep < CHAT_STEPS.length && (
                    <div style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>Step {chatStep + 1} of {CHAT_STEPS.length}</div>
                  )}
                </div>

                {/* Progress bar */}
                {chatStep <= CHAT_STEPS.length && (
                  <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ height: "100%", width: `${Math.min((chatStep / CHAT_STEPS.length) * 100, 100)}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", transition: "width 0.4s ease" }} />
                  </div>
                )}

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                      {msg.role === "ai" && (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🤖</div>
                      )}
                      <div style={{
                        maxWidth: "82%", padding: "10px 14px",
                        borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: msg.role === "user" ? "linear-gradient(135deg,rgba(99,102,241,0.55),rgba(139,92,246,0.45))" : "rgba(255,255,255,0.06)",
                        color: "#f1f5f9", fontSize: 13, lineHeight: 1.6,
                        border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                        whiteSpace: "pre-line",
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                {chatStep < CHAT_STEPS.length ? (
                  <form onSubmit={handleChatSubmit} style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 9, background: "rgba(0,0,0,0.15)" }}>
                    {CHAT_STEPS[chatStep]?.type === "date" ? (
                      <input type="date" value={chatInput} onChange={e => setChatInput(e.target.value)} required style={{ ...inputStyle, flex: 1, padding: "10px 12px" }} />
                    ) : (
                      <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={CHAT_STEPS[chatStep]?.placeholder} style={{ ...inputStyle, flex: 1, padding: "10px 12px" }}
                        onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    )}
                    <button type="submit" style={{ padding: "10px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>→</button>
                  </form>
                ) : (
                  <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}>
                    <button onClick={handleSubmit} disabled={loading || !allFieldsFilled}
                      style={{ width: "100%", padding: "13px", background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
                      {loading ? <><div className="spinner" /> Submitting...</> : "📦 Submit Report"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Form Mode */
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "12px 16px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12 }}>
                  <span style={{ fontSize: 18 }}>🤖</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>AI Multi-Agent System Active</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Report, Description &amp; Matching agents will process your submission</div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                    <div>
                      <label style={labelStyle}>Item Name *</label>
                      <input type="text" value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} placeholder="e.g., Black Laptop" required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Colour</label>
                      <input type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="e.g., Black with silver trim" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Seen Location *</label>
                      <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="">Select location</option>
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Date Lost *</label>
                      <input type="date" value={formData.lostDate} onChange={e => setFormData({ ...formData, lostDate: e.target.value })} required style={inputStyle} />
                    </div>
                    {/* Image upload in grid */}
                    <div>
                      <label style={labelStyle}>Item Photo (Optional)</label>
                      <label style={{ display: "block", height: 48, border: "2px dashed rgba(99,102,241,0.3)", borderRadius: 12, textAlign: "center", cursor: "pointer", background: "rgba(99,102,241,0.04)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, color: "#818cf8", fontWeight: 600 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}>
                        {imagePreview ? "📷 Photo selected ✓" : "📷 Upload photo"}
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                      <label style={labelStyle}>Description *</label>
                      <button type="button" onClick={handleEnhanceDescription} disabled={enhancing}
                        style={{ fontSize: 12, color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}>
                        {enhancing ? <><div className="spinner" style={{ width: 11, height: 11 }} /> Enhancing...</> : "✨ AI Enhance"}
                      </button>
                    </div>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your item — unique marks, stickers, contents, damage, brand, model..." rows={4} style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>

                  <button type="submit" disabled={loading}
                    style={{ width: "100%", padding: "14px", background: loading ? "rgba(99,102,241,0.35)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 24px rgba(99,102,241,0.35)" }}>
                    {loading ? <><div className="spinner" /> Submitting...</> : "📦 Submit Lost Item Report"}
                  </button>
                </form>
              </div>
            )}

            {/* Right panel (chat mode only) */}
            {mode === "chat" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Image upload */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(34,211,238,0.14)", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👁️</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>Vision Agent</div>
                      <div style={{ fontSize: 11, color: "#22d3ee" }}>Photo improves match accuracy</div>
                    </div>
                  </div>
                  <label style={{ display: "block", border: "2px dashed rgba(99,102,241,0.28)", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.55)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.28)"; e.currentTarget.style.background = "transparent"; }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 140, objectFit: "cover" }} />
                    ) : (
                      <div style={{ padding: 22, textAlign: "center" }}>
                        <div style={{ fontSize: 30, marginBottom: 8 }}>📷</div>
                        <div style={{ fontSize: 12, color: "#818cf8", fontWeight: 600 }}>Click to upload photo</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>PNG, JPG up to 10MB</div>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </label>
                </div>

                {/* AI Tips */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 14, fontFamily: "'Space Grotesk',sans-serif" }}>🧠 Tips for Better Matching</div>
                  {[
                    "Be specific about unique marks — scratches, stickers, engravings",
                    "Mention exact campus location, not just a building name",
                    "Include brand names and model numbers if known",
                    "Describe what was inside bags or wallets",
                  ].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#6366f1", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Collected info preview */}
                {(formData.itemName || formData.location) && (
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 18 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.6px" }}>📋 Collected Info</div>
                    {Object.entries(formData).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 5, display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#475569", textTransform: "capitalize", minWidth: 80, flexShrink: 0 }}>{k}:</span>
                        <span style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.length > 40 ? v.substring(0, 40) + "…" : v}</span>
                      </div>
                    ))}
                    {chatStep >= CHAT_STEPS.length && (
                      <button onClick={handleSubmit} disabled={loading}
                        style={{ width: "100%", marginTop: 14, padding: "11px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {loading ? <><div className="spinner" /> Submitting...</> : "📦 Submit Report"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default LostItemPage;
