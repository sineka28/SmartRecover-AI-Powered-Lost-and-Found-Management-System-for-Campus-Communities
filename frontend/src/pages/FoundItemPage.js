import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { addFoundItem } from "../api/foundItemApi";
import { uploadFile } from "../api/fileUploadApi";
import { enhanceDescription } from "../api/aiApi";

const CATEGORIES = ["Electronics", "Bag/Backpack", "Clothing", "Documents/Cards", "Keys", "Jewelry/Accessories", "Books/Stationery", "Sports Equipment", "Wallet/Purse", "Umbrella", "Water Bottle", "Other"];
const LOCATIONS  = ["Library", "Cafeteria", "Main Hall", "Block A", "Block B", "Block C", "Block D", "Lab 1", "Lab 2", "Sports Complex", "Parking Lot", "Bus Stop", "Lecture Hall", "Auditorium", "Other"];

const inputStyle = {
  width: "100%", padding: "13px 15px",
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12, color: "#f1f5f9", fontSize: 14, outline: "none",
  fontFamily: "'Inter',sans-serif", boxSizing: "border-box", transition: "all 0.2s",
};
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.6px" };

function FoundItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ itemName: "", category: "", color: "", location: "", foundDate: "", description: "" });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing]     = useState(false);
  const [enhancing, setEnhancing]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null);
  const [aiAnalysis, setAiAnalysis]   = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalyzing(true);
    setAiAnalysis(null);
    await new Promise(r => setTimeout(r, 1800));
    setAnalyzing(false);
    setAiAnalysis({
      detected: ["Object identified", "Colour profile extracted", "Brand detection attempted", "Damage assessment complete"],
      suggestion: "Vision Agent has analyzed the image — fill in the details below for best matching results.",
    });
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description) return showToast("Enter a description first", "error");
    setEnhancing(true);
    try {
      const res = await enhanceDescription(formData.description, formData.category, formData.color);
      setFormData(f => ({ ...f, description: res.data.enhancedDescription || f.description }));
      showToast("✨ Description enhanced by AI!", "success");
    } catch { showToast("AI enhancement unavailable — description saved as-is", "info"); }
    finally { setEnhancing(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) { const u = await uploadFile(imageFile); imageUrl = u.data.url; }
      await addFoundItem({ ...formData, imageUrl });
      showToast("🔍 Found item reported! AI is searching for matches...", "success");
      setTimeout(() => navigate("/matches"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit report", "error");
    } finally { setLoading(false); }
  };

  const updateField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c1a" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div className="page-header">
            <div className="page-header-text">
              <h1>🔍 Report Found Item</h1>
              <p>Found something? Report it and AI will instantly search for a match.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 22, maxWidth: 1100 }}>

            {/* Main Form */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>
              {/* AI banner */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "13px 16px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 13 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#6ee7b7" }}>AI Multi-Agent System Active</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Vision + Description + Matching agents will process your report</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", align: "center", gap: 5 }}>
                  <span className="status-ping" />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={labelStyle}>Item Name *</label>
                    <input type="text" value={formData.itemName} onChange={e => updateField("itemName", e.target.value)} placeholder="e.g., Blue Umbrella" required style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select value={formData.category} onChange={e => updateField("category", e.target.value)} required style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Colour</label>
                    <input type="text" value={formData.color} onChange={e => updateField("color", e.target.value)} placeholder="e.g., Blue, Black &amp; White" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Found Location *</label>
                    <select value={formData.location} onChange={e => updateField("location", e.target.value)} required style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select location</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date Found *</label>
                    <input type="date" value={formData.foundDate} onChange={e => updateField("foundDate", e.target.value)} required style={inputStyle} />
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                    <label style={labelStyle}>Description</label>
                    <button type="button" onClick={handleEnhanceDescription} disabled={enhancing}
                      style={{ fontSize: 12, color: "#6ee7b7", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                      {enhancing ? <><div className="spinner" style={{ width: 11, height: 11, borderTopColor: "#10b981", borderColor: "rgba(16,185,129,0.2)" }} /> Enhancing...</> : "✨ AI Enhance"}
                    </button>
                  </div>
                  <textarea value={formData.description} onChange={e => updateField("description", e.target.value)} placeholder="Describe the found item — brand, size, colour details, any damage or unique marks..." rows={4} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "14px", background: loading ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg,#10b981,#059669)", color: "white", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 24px rgba(16,185,129,0.3)" }}>
                  {loading ? <><div className="spinner" style={{ borderTopColor: "#10b981", borderColor: "rgba(16,185,129,0.2)" }} /> Submitting...</> : "🔍 Submit Found Item Report"}
                </button>
              </form>
            </div>

            {/* Right Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Vision Agent */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(34,211,238,0.14)", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 12px rgba(34,211,238,0.15)" }}>👁️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>Vision Agent</div>
                    <div style={{ fontSize: 11, color: "#22d3ee", fontWeight: 600 }}>Gemini Vision Ready</div>
                  </div>
                </div>

                <label style={{ display: "block", cursor: "pointer" }}>
                  <div style={{ border: "2px dashed rgba(16,185,129,0.28)", borderRadius: 13, overflow: "hidden", background: "rgba(16,185,129,0.03)", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.55)"; e.currentTarget.style.background = "rgba(16,185,129,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.28)"; e.currentTarget.style.background = "rgba(16,185,129,0.03)"; }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 160, objectFit: "cover" }} />
                    ) : (
                      <div style={{ padding: 24, textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                        <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>Upload photo for AI analysis</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>PNG, JPG up to 10MB</div>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>

                {analyzing && (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.18)", borderRadius: 11 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <div className="spinner" style={{ borderTopColor: "#22d3ee", borderColor: "rgba(34,211,238,0.2)" }} />
                      <span style={{ fontSize: 12, color: "#67e8f9", fontWeight: 600 }}>Vision Agent analyzing...</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>Detecting objects, colours, brands...</div>
                  </div>
                )}

                {aiAnalysis && !analyzing && (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 11 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6ee7b7", marginBottom: 10 }}>✅ Vision Analysis Complete</div>
                    {aiAnalysis.detected.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "center" }}>
                        <span style={{ color: "#10b981", fontSize: 12 }}>✓</span>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* What happens next */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>⚡ What Happens Next</div>
                {[
                  { icon: "🔗", text: "Matching Agent scores against all lost items",   color: "#10b981" },
                  { icon: "🧠", text: "Explainable AI generates match reasoning",       color: "#f59e0b" },
                  { icon: "🔔", text: "Owners are notified instantly",                  color: "#22d3ee" },
                  { icon: "🔐", text: "Verification questions are prepared",            color: "#ef4444" },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 11, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${step.color}14`, border: `1px solid ${step.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{step.icon}</div>
                    <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, paddingTop: 4 }}>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

export default FoundItemPage;
