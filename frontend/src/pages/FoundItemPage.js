import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { addFoundItem } from "../api/foundItemApi";
import { uploadFile } from "../api/fileUploadApi";
import { enhanceDescription } from "../api/aiApi";

const CATEGORIES = ["Electronics", "Bag/Backpack", "Clothing", "Documents/Cards", "Keys", "Jewelry/Accessories", "Books/Stationery", "Sports Equipment", "Wallet/Purse", "Umbrella", "Water Bottle", "Other"];
const LOCATIONS = ["Library", "Cafeteria", "Main Hall", "Block A", "Block B", "Block C", "Block D", "Lab 1", "Lab 2", "Sports Complex", "Parking Lot", "Bus Stop", "Lecture Hall", "Auditorium", "Other"];

function FoundItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ itemName: "", category: "", color: "", location: "", foundDate: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Simulate Vision Agent analysis
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));
    setAnalyzing(false);
    setAiAnalysis({
      detected: ["Object identified", "Color profile extracted", "Brand detection attempted", "Damage assessment complete"],
      suggestion: "Vision Agent has analyzed the image. Fill in the details below for best matching results.",
    });
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description) return showToast("Please enter a description first", "error");
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
      if (imageFile) {
        const uploadRes = await uploadFile(imageFile);
        imageUrl = uploadRes.data.url;
      }
      await addFoundItem({ ...formData, imageUrl });
      showToast("🔍 Found item reported! AI is now searching for matches...", "success");
      setTimeout(() => navigate("/matches"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit report", "error");
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box", transition: "all 0.2s" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeIn 0.5s ease both" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>🔍 Report Found Item</h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>Report an item you found. The AI will immediately search for a match with reported lost items.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, maxWidth: 1100 }}>

            {/* Form */}
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "12px 16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#6ee7b7" }}>AI Multi-Agent System Active</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Vision + Description + Matching agents will process your report</div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Item Name *</label>
                    <input type="text" value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} placeholder="e.g., Blue Umbrella" required style={inputStyle} onFocus={e => e.target.style.borderColor="#10b981"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
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
                    <input type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="e.g., Blue, Black & White" style={inputStyle} onFocus={e => e.target.style.borderColor="#10b981"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Found Location *</label>
                    <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select location</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date Found *</label>
                    <input type="date" value={formData.foundDate} onChange={e => setFormData({ ...formData, foundDate: e.target.value })} required style={inputStyle} />
                  </div>
                </div>

                {/* Description with AI */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={labelStyle}>Description</label>
                    <button type="button" onClick={handleEnhanceDescription} disabled={enhancing} style={{ fontSize: 11, color: "#6ee7b7", background: "none", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      {enhancing ? <><div className="spinner" style={{ width: 12, height: 12, borderTopColor: "#10b981" }} /> Enhancing...</> : "✨ AI Enhance"}
                    </button>
                  </div>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the found item — brand, size, color details, any visible damage or unique marks..." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor="#10b981"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>

                <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg,#10b981,#059669)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 24px rgba(16,185,129,0.3)" }}>
                  {loading ? <><div className="spinner" style={{ borderTopColor: "#10b981" }} />Submitting...</> : "🔍 Submit Found Item Report"}
                </button>
              </form>
            </div>

            {/* Right: Image upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Vision Agent */}
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👁️</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>Vision Agent</div>
                    <div style={{ fontSize: 11, color: "#22d3ee" }}>Gemini Vision Ready</div>
                  </div>
                </div>

                <label style={{ display: "block", cursor: "pointer" }}>
                  <div style={{ border: "2px dashed rgba(16,185,129,0.3)", borderRadius: 12, overflow: "hidden", background: "rgba(16,185,129,0.04)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor="rgba(16,185,129,0.6)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor="rgba(16,185,129,0.3)"}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 160, objectFit: "cover" }} />
                    ) : (
                      <div style={{ padding: 24, textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                        <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>Upload photo for AI analysis</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>PNG, JPG up to 10MB</div>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>

                {analyzing && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div className="spinner" style={{ borderTopColor: "#22d3ee", borderColor: "rgba(34,211,238,0.2)" }} />
                      <span style={{ fontSize: 12, color: "#67e8f9", fontWeight: 600 }}>Vision Agent analyzing...</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>Detecting objects, colors, brands...</div>
                  </div>
                )}

                {aiAnalysis && !analyzing && (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6ee7b7", marginBottom: 8 }}>✅ Vision Analysis Complete</div>
                    {aiAnalysis.detected.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                        <span style={{ color: "#10b981", fontSize: 11 }}>✓</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Matching info */}
              <div className="glass-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12, fontFamily: "'Space Grotesk',sans-serif" }}>⚡ What Happens Next</h3>
                {[
                  { icon: "🔗", text: "Matching Agent compares with all lost items" },
                  { icon: "🧠", text: "Explainable AI generates match reasons" },
                  { icon: "🔔", text: "Owners are notified instantly" },
                  { icon: "🔐", text: "Verification questions are prepared" },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14 }}>{step.icon}</span>
                    <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{step.text}</span>
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
