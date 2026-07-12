import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const cardStyle = {
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    transition: "0.3s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            🤖 SmartRecover AI
          </h1>

          <p
            style={{
              color: "#dbeafe",
              marginTop: "8px",
            }}
          >
            AI Powered Lost & Found Management System
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Welcome Card */}

      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "40px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2>👋 Welcome Back!</h2>

        <p style={{ color: "#e5e7eb" }}>
          Manage lost items, found items and AI Smart Matches from one place.
        </p>
      </div>

      {/* Main Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "25px",
        }}
      >
        <div
          style={cardStyle}
          onClick={() => navigate("/lost-item")}
        >
          <h1>📦</h1>

          <h2 style={{ color: "#2563eb" }}>
            Report Lost Item
          </h2>

          <p style={{ color: "gray" }}>
            Submit details of a lost item.
          </p>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/found-item")}
        >
          <h1>🔍</h1>

          <h2 style={{ color: "#16a34a" }}>
            Report Found Item
          </h2>

          <p style={{ color: "gray" }}>
            Report an item you found.
          </p>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/matches")}
        >
          <h1>🤖</h1>

          <h2 style={{ color: "#7c3aed" }}>
            AI Smart Matches
          </h2>

          <p style={{ color: "gray" }}>
            View AI matched lost & found items.
          </p>
        </div>
      </div>

      {/* Footer */}

      <div
        style={{
          marginTop: "60px",
          textAlign: "center",
          color: "#cbd5e1",
        }}
      >
        SmartRecover AI © 2026
      </div>
    </div>
  );
}

export default DashboardPage;