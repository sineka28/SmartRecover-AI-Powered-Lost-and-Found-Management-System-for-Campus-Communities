import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const CATEGORIES = ["All", "Electronics", "Bag/Backpack", "Clothing", "Documents/Cards", "Keys", "Jewelry/Accessories", "Books/Stationery", "Sports Equipment", "Wallet/Purse", "Umbrella", "Water Bottle", "Other"];
const LOCATIONS  = ["All", "Library", "Cafeteria", "Main Hall", "Block A", "Block B", "Block C", "Block D", "Lab 1", "Lab 2", "Sports Complex", "Parking Lot", "Bus Stop", "Lecture Hall", "Auditorium"];

function SearchPage() {
  const navigate = useNavigate();
  const [query,    setQuery]    = useState("");
  const [type,     setType]     = useState("both");   // "lost" | "found" | "both"
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(false);

  const doSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const [lostRes, foundRes] = await Promise.allSettled([
        type !== "found" ? api.get("/lost-items") : Promise.reject("skip"),
        type !== "lost"  ? api.get("/found-items") : Promise.reject("skip"),
      ]);

      const lostItems  = lostRes.status  === "fulfilled" ? lostRes.value.data  : [];
      const foundItems = foundRes.status === "fulfilled" ? foundRes.value.data : [];

      const q = query.toLowerCase().trim();

      const filter = (items) => items.filter(item => {
        const matchQuery    = !q || [item.itemName, item.description, item.color, item.category, item.location].some(f => f?.toLowerCase().includes(q));
        const matchCategory = category === "All" || item.category === category;
        const matchLocation = location === "All" || item.location === location;
        return matchQuery && matchCategory && matchLocation;
      });

      setResults({
        lost:  type !== "found" ? filter(lostItems)  : [],
        found: type !== "lost"  ? filter(foundItems) : [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "11px 14px", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
    color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif",
    transition: "border-color 0.2s",
  };

  const totalResults = results ? results.lost.length + results.found.length : null;

  const getStatusBadge = (status) => {
    const map = { OPEN: ["badge-warning","Open"], MATCHED: ["badge-primary","Matched"], RECOVERED: ["badge-success","Recovered"], CLAIMED: ["badge-cyan","Claimed"] };
    const [cls, label] = map[status] || ["badge-primary", status];
    return <span className={`badge ${cls}`} style={{ fontSize: 11 }}>{label}</span>;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Sidebar />
      <main className="main-with-sidebar">
        <div className="page-content">

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeIn 0.5s ease both" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>🔎 Smart Search</h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>Search across all lost and found items with AI-powered filters.</p>
          </div>

          {/* Search form */}
          <div className="glass-card animate-fade-in" style={{ padding: 24, marginBottom: 28 }}>
            <form onSubmit={doSearch}>
              {/* Main search bar */}
              <div style={{ position: "relative", marginBottom: 20 }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#64748b" }}>🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name, description, color, brand..."
                  style={{ ...inputStyle, width: "100%", paddingLeft: 44, paddingRight: 16, fontSize: 15 }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              {/* Filters row */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
                {/* Item type */}
                <div style={{ flex: "0 0 auto" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Search In</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[["both","📦+🔍 Both"],["lost","📦 Lost"],["found","🔍 Found"]].map(([v,l]) => (
                      <button key={v} type="button" onClick={() => setType(v)} style={{ padding: "8px 14px", background: type === v ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: type === v ? "#a5b4fc" : "#64748b", border: `1px solid ${type === v ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, width: "100%", cursor: "pointer" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Location */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Location</label>
                  <select value={location} onChange={e => setLocation(e.target.value)} style={{ ...inputStyle, width: "100%", cursor: "pointer" }}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={loading} style={{ padding: "11px 28px", background: loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                  {loading ? <><div className="spinner" />Searching...</> : "Search"}
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {results === null ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔎</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Start Searching</h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>Enter a keyword or apply filters and click Search.</p>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>😕</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>No results found</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Try different keywords or broader filters.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => navigate("/lost-items")} className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>📦 Report Lost</button>
                <button onClick={() => navigate("/found-items")} className="btn-secondary" style={{ padding: "10px 22px", fontSize: 14 }}>🔍 Report Found</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>Found</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk',sans-serif" }}>{totalResults}</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>results</span>
              </div>

              {/* Lost items section */}
              {results.lost.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#a5b4fc", fontFamily: "'Space Grotesk',sans-serif" }}>📦 Lost Items</h3>
                    <span className="badge badge-primary">{results.lost.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                    {results.lost.map(item => (
                      <ItemCard key={item.id} item={item} type="lost" getStatusBadge={getStatusBadge} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Found items section */}
              {results.found.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#6ee7b7", fontFamily: "'Space Grotesk',sans-serif" }}>🔍 Found Items</h3>
                    <span className="badge badge-success">{results.found.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                    {results.found.map(item => (
                      <ItemCard key={item.id} item={item} type="found" getStatusBadge={getStatusBadge} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ItemCard({ item, type, getStatusBadge, navigate }) {
  const isLost = type === "lost";
  const accent = isLost ? "#6366f1" : "#10b981";
  return (
    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.itemName} style={{ width: "100%", height: 140, objectFit: "cover" }} />
      )}
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{item.itemName}</div>
          {getStatusBadge(item.status)}
        </div>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
          {item.category && <div>📂 {item.category}</div>}
          {item.color    && <div>🎨 {item.color}</div>}
          {item.location && <div>📍 {item.location}</div>}
          {(isLost ? item.lostDate : item.foundDate) && (
            <div>📅 {new Date(isLost ? item.lostDate : item.foundDate).toLocaleDateString()}</div>
          )}
        </div>
        {item.description && (
          <p style={{ fontSize: 12, color: "#475569", marginTop: 10, lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
            {item.description.length > 100 ? item.description.substring(0, 100) + "…" : item.description}
          </p>
        )}
        {isLost ? null : (
          <button
            onClick={() => navigate("/claims")}
            style={{ marginTop: 12, width: "100%", padding: "8px", background: `${accent}15`, color: "#6ee7b7", border: `1px solid ${accent}30`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            📋 Claim This Item
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
