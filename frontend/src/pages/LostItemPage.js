import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { addLostItem } from "../api/lostItemApi";
import { uploadFile } from "../api/fileUploadApi";
import { enhanceDescription, aiChat } from "../api/aiApi";

const CATEGORIES = ["Electronics", "Bag/Backpack", "Clothing", "Documents/Cards", "Keys", "Jewelry/Accessories", "Books/Stationery", "Sports Equipment", "Wallet/Purse", "Umbrella", "Water Bottle", "Other"];
const LOCATIONS = ["Library", "Cafeteria", "Main Hall", "Block A", "Block B", "Block C", "Block D", "Lab 1", "Lab 2", "Sports Complex", "Parking Lot", "Bus Stop", "Lecture Hall", "Auditorium", "Other"];

const CHAT_STEPS = [
  { key: "itemName", question: "What item did you lose? (e.g., black laptop, blue umbrella, Samsung phone)", placeholder: "Describe the item name and type..." },
  { key: "category", question: "What category does your item belong to?", placeholder: "e.g., Electronics, Bag, Documents..." },
  { key: "color", question: "What color is the item?", placeholder: "e.g., Black, Blue, Silver with white logo..." },
  { key: "location", question: "Where did you last see it?", placeholder: "e.g., Library 2nd floor, near the computer lab..." },
  { key: "lostDate", question: "When did you lose it?", placeholder: "YYYY-MM-DD", type: "date" },
  { key: "description", question: "Any unique features? Stickers, scratches, engravings, what was inside?", placeholder: "Describe any unique identifying marks..." },
];

function LostItemPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("chat"); // "chat" | "form"
  const [chatStep, setChatStep] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "👋 Hi! I'm the **Report Agent**. I'll help you report your lost item by asking a few questions. Let's start!" },
    { role: "ai", text: CHAT_STEPS[0].question },
  ]);
  const [formData, setFormData] = useState({ itemName: "", category: "", color: "", location: "", lostDate: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // Chat agent logic
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentStep = CHAT_STEPS[chatStep];
    const userMessage = chatInput.trim();
    setChatInput("");

    // Add user message
    setChatHistory(prev => [...prev, { role: "user", text: userMessage }]);

    // Update formData
    const updatedForm = { ...formData, [currentStep.key]: userMessage };
    setFormData(updatedForm);

    const nextStep = chatStep + 1;

    if (nextStep < CHAT_STEPS.length) {
      // Add AI next question
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: "ai", text: CHAT_STEPS[nextStep].question }]);
        setChatStep(nextStep);
      }, 400);
    } else {
      // Done collecting — enhance description with AI
      setChatStep(nextStep);
      setTimeout(async () => {
        setChatHistory(prev => [...prev, { role: "ai", text: "✨ **Description Agent** is enhancing your description with AI..." }]);
        try {
          const res = await enhanceDescription(updatedForm.description, updatedForm.category, updatedForm.color);
          const enhanced = res.data.enhancedDescription || updatedForm.description;
          setFormData(f => ({ ...f, description: enhanced }));
          setChatHistory(prev => [...prev, {
            role: "ai",
            text: `✅ **Report complete!** Here's a summary of your lost item:\n\n📦 **${updatedForm.itemName}** (${updatedForm.category})\n📍 Last seen at: ${updatedForm.location}\n🎨 Color: ${updatedForm.color}\n📅 Lost on: ${updatedForm.lostDate}\n\n*AI enhanced description ready. Click "Submit Report" to proceed, or switch to Form Mode to review details.*`
          }]);
        } catch {
          setChatHistory(prev => [...prev, {
            role: "ai",
            text: `✅ **Report complete!** Ready to submit. Click "Submit Report" below to continue.`
          }]);
        }
      }, 600);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description) return showToast("Please enter a description first", "error");
    setEnhancing(true);
    try {
      const res = await enhanceDescription(formData.description, formData.category, formData.color);
      setFormData(f => ({ ...f, description: res.data.enhancedDescription || f.description }));
      showToast("✨ AI enhanced your description!", "success");
    } catch { showToast("AI enhancement unavailable", "info"); }
    finally { setEnhancing(false); }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const uploadRes = await uploadFile(imageFile);
        imageUrl = uploadRes.data.url;
      }
      const payload = { ...formData, imageUrl };
      await addLostItem(payload);
      showToast("📦 Lost item reported successfully! AI is now matching...", "success");
      setTimeout(() => navigate("/matches"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit report", "error");
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none",
    fontFamily: "'Inter',sans-serif", boxSizing: "border-box", transition: "all 0.2s"
  };

  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" };

  const allFieldsFilled = formData.itemName && formData.location && formData.lostDate;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeIn 0.5s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>📦 Report Lost Item</h1>
                <p style={{ color: "#64748b", fontSize: 14 }}>Use the AI chat agent or fill in the form to report your lost item.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setMode("chat")} style={{ padding: "9px 18px", background: mode === "chat" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: mode === "chat" ? "#a5b4fc" : "#64748b", border: `1px solid ${mode === "chat" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  💬 AI Chat Agent
                </button>
                <button onClick={() => setMode("form")} style={{ padding: "9px 18px", background: mode === "form" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: mode === "form" ? "#a5b4fc" : "#64748b", border: `1px solid ${mode === "form" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  📝 Form Mode
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mode === "chat" ? "1fr 380px" : "1fr", gap: 24, maxWidth: 1100 }}>

            {/* Left: Chat or Form */}
            {mode === "chat" ? (
              <div className="glass-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: 580 }}>
                {/* Chat header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Report Agent</div>
                    <div style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} /> Active</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "85%", padding: "10px 14px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: msg.role === "user" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)",
                        color: "#f1f5f9", fontSize: 13, lineHeight: 1.6,
                        border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                        whiteSpace: "pre-line"
                      }}>
                        {msg.text.replace(/\*\*/g, "").replace(/\*/g, "")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                {chatStep < CHAT_STEPS.length ? (
                  <form onSubmit={handleChatSubmit} style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
                    {CHAT_STEPS[chatStep]?.type === "date" ? (
                      <input type="date" value={chatInput} onChange={e => setChatInput(e.target.value)} required style={{ ...inputStyle, flex: 1, padding: "10px 12px" }} />
                    ) : (
                      <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={CHAT_STEPS[chatStep]?.placeholder} style={{ ...inputStyle, flex: 1, padding: "10px 12px" }} />
                    )}
                    <button type="submit" style={{ padding: "10px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>→</button>
                  </form>
                ) : (
                  <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button onClick={handleSubmit} disabled={loading || !allFieldsFilled} style={{ width: "100%", padding: "12px", background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      {loading ? <><div className="spinner" />Submitting...</> : "📦 Submit Report"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Form Mode */
              <div className="glass-card" style={{ padding: 28 }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={labelStyle}>Item Name *</label>
                      <input type="text" value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} placeholder="e.g., Black Laptop" required style={inputStyle} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Color</label>
                      <input type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="e.g., Black with silver trim" style={inputStyle} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
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
                  </div>

                  {/* AI Description */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={labelStyle}>Description *</label>
                      <button type="button" onClick={handleEnhanceDescription} disabled={enhancing} style={{ fontSize: 11, color: "#818cf8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                        {enhancing ? <><div className="spinner" style={{ width: 12, height: 12 }} /> Enhancing...</> : "✨ AI Enhance"}
                      </button>
                    </div>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your item... unique marks, stickers, contents, damage, etc." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                  </div>

                  <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 24px rgba(99,102,241,0.3)" }}>
                    {loading ? <><div className="spinner" />Submitting...</> : "📦 Submit Lost Item Report"}
                  </button>
                </form>
              </div>
            )}

            {/* Right panel: Image upload + tips */}
            {mode === "chat" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Image upload */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12, fontFamily: "'Space Grotesk',sans-serif" }}>📸 Add Item Photo</h3>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16, lineHeight: 1.5 }}>A photo helps the Vision Agent identify unique features and improves match accuracy.</p>

                  <label style={{ display: "block", padding: "20px", border: "2px dashed rgba(99,102,241,0.3)", borderRadius: 12, textAlign: "center", cursor: "pointer", background: "rgba(99,102,241,0.05)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor="rgba(99,102,241,0.6)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor="rgba(99,102,241,0.3)"}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
                    ) : (
                      <div>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                        <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>Click to upload photo</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>PNG, JPG up to 10MB</div>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </label>
                </div>

                {/* AI Tips */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12, fontFamily: "'Space Grotesk',sans-serif" }}>🧠 AI Agent Tips</h3>
                  {[
                    "Be specific about unique marks — scratches, stickers, engravings",
                    "Mention the exact campus location, not just a building",
                    "Include brand names and model numbers if known",
                    "Describe what was inside bags or wallets",
                  ].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <span style={{ color: "#6366f1", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Current form data */}
                {(formData.itemName || formData.location) && (
                  <div className="glass-card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>📋 Collected Info</h3>
                    {Object.entries(formData).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#475569", textTransform: "capitalize" }}>{k}: </span>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{v.length > 50 ? v.substring(0, 50) + "..." : v}</span>
                      </div>
                    ))}
                    {chatStep >= CHAT_STEPS.length && (
                      <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 12, padding: "10px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                        {loading ? "Submitting..." : "📦 Submit Report"}
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
